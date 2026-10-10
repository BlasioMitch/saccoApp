import client from '../graphql/client'
import { enqueue, newKey } from './outbox'
import { isNetworkFailure, isOffline, markServerUnreachable } from './network'
import { OFFLINE_OPERATIONS, TEMP_ID_PREFIX } from './operations'

// The one way the thunks send a change that may be made offline. Online: sent now with an idempotency key.
// Offline (or the server can't be reached): kept in the outbox, and answered with the placeholder row so the
// page shows it at once, marked "Waiting to sync". Returns the same { data } shape as client.mutate.
// label: optional wording for the waiting list when the page knows more than the store (e.g. the member's name)
export async function mutateOrQueue({ operation, variables, getState, label }) {
  const definition = OFFLINE_OPERATIONS[operation]
  const state = getState?.() ?? {}

  const queue = () => {
    const key = newKey()
    const tempId = definition.creates ? `${TEMP_ID_PREFIX}${key}` : null
    enqueue({
      id: key,
      userId: state.auth?.user?.id ?? null,
      operation,
      label: label ?? definition.label(variables, state),
      variables,
      tempId,
    })
    return { data: { [definition.field]: definition.placeholder(variables, tempId, state) }, queued: true }
  }

  if (isOffline()) return queue()
  try {
    const result = await client.mutate({
      mutation: definition.document,
      variables,
      context: { headers: { 'x-idempotency-key': newKey() } },
    })
    return { data: result.data, queued: false }
  } catch (error) {
    if (!isNetworkFailure(error)) throw error
    markServerUnreachable()
    return queue()
  }
}
