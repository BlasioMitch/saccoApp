import client from '../graphql/client'
import { fetchTransactions } from '../reducers/transactionReducer'
import { fetchUsers } from '../reducers/userReducer'
import { fetchAccounts } from '../reducers/accountsReducer'
import { fetchLoans } from '../reducers/loansReducer'
import { failItem, getOutbox, removeItem, replaceInOutbox } from './outbox'
import { isNetworkFailure, isOffline, markServerUnreachable, setSyncing } from './network'
import { OFFLINE_OPERATIONS, TEMP_ID_PREFIX } from './operations'

let running = false

const codeOf = (error) => error?.graphQLErrors?.[0]?.extensions?.code
const messageOf = (error) => error?.graphQLErrors?.[0]?.message || error?.message || 'The server refused this change'
const refersToUnsentRecord = (variables) => JSON.stringify(variables ?? {}).includes(TEMP_ID_PREFIX)

// Sends the signed-in user's waiting changes in the order they were made.
// - A new record's temporary id is swapped for the real one in later changes (e.g. register a member, then
//   open their account, then record a deposit, all offline).
// - Still offline: stop and try again later. Signed out: keep them for after the next sign-in.
// - Refused by the server (e.g. not enough balance, already decided): set aside for Retry or Discard.
export async function syncOutbox({ dispatch, getState }) {
  const { auth } = getState()
  if (running || isOffline() || !auth.isAuthenticated) return { sent: 0, failed: 0 }
  running = true
  let sent = 0
  let failed = 0
  try {
    const ids = getOutbox().filter(item => !item.error && (!item.userId || item.userId === auth.user?.id)).map(item => item.id)
    if (ids.length) setSyncing(true)
    for (const id of ids) {
      const item = getOutbox().find(entry => entry.id === id)
      if (!item || item.error) continue
      if (refersToUnsentRecord(item.variables)) {
        failItem(item.id, 'It depends on a new record that could not be sent')
        failed += 1
        continue
      }
      const definition = OFFLINE_OPERATIONS[item.operation]
      try {
        const result = await client.mutate({
          mutation: definition.document,
          variables: item.variables,
          context: { headers: { 'x-idempotency-key': item.id, 'x-queued-at': item.queuedAt } },
        })
        removeItem(item.id)
        sent += 1
        const realId = result.data?.[definition.field]?.id
        if (item.tempId && realId) replaceInOutbox(item.tempId, realId)
      } catch (error) {
        if (isNetworkFailure(error)) {
          markServerUnreachable()
          break
        }
        if (codeOf(error) === 'UNAUTHORIZED' || codeOf(error) === 'PASSWORD_CHANGE_REQUIRED') break
        if (codeOf(error) === 'IN_PROGRESS') continue
        failItem(item.id, messageOf(error))
        failed += 1
      }
    }
    // Swap the "Waiting to sync" rows for the server's records
    if (sent || failed) {
      dispatch(fetchTransactions())
      dispatch(fetchUsers())
      dispatch(fetchAccounts())
      dispatch(fetchLoans())
      client.refetchQueries({ include: 'active' }).catch(() => {})
    }
    return { sent, failed }
  } finally {
    running = false
    setSyncing(false)
  }
}
