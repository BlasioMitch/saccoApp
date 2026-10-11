// Every staff change that can be made offline goes through here: sent now, or kept with a placeholder row
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mutate = vi.fn()
vi.mock('../graphql/client', () => ({ default: { mutate: (...args) => mutate(...args) } }))

const { mutateOrQueue } = await import('./mutateOrQueue')
const { getOutbox, removeItem } = await import('./outbox')
const network = await import('./network')

const state = {
  auth: { user: { id: 'staff-1' } },
  accounts: { accounts: [{ id: 'a1', accountNumber: 'JS-001', owner: { first_name: 'Jane', last_name: 'Smith' } }] },
}
const variables = { transaction: { accountId: 'a1', type: 'SAVINGS_DEPOSIT', amount: 12345, status: 'COMPLETED' } }

beforeEach(() => {
  for (const item of getOutbox()) removeItem(item.id)
  mutate.mockReset()
  network.markServerReachable()
  window.dispatchEvent(new Event('online'))
})

describe('mutateOrQueue', () => {
  it('online: sends it now with an idempotency key', async () => {
    mutate.mockResolvedValue({ data: { createTransaction: { id: 't1' } } })
    const result = await mutateOrQueue({ operation: 'CREATE_TRANSACTION', variables, getState: () => state })
    expect(result).toEqual({ data: { createTransaction: { id: 't1' } }, queued: false })
    expect(mutate.mock.calls[0][0].context.headers['x-idempotency-key']).toEqual(expect.any(String))
    expect(getOutbox()).toEqual([])
  })

  it('offline: queues it, named for the member, and answers with a "waiting to sync" row', async () => {
    window.dispatchEvent(new Event('offline'))
    const result = await mutateOrQueue({ operation: 'CREATE_TRANSACTION', variables, getState: () => state })
    expect(mutate).not.toHaveBeenCalled()
    expect(result.queued).toBe(true)
    const row = result.data.createTransaction
    expect(row).toMatchObject({ amount: 12345, syncStatus: 'pending', acountName: 'JS-001' })
    expect(row.id).toMatch(/^offline-/)
    expect(getOutbox()).toEqual([expect.objectContaining({ userId: 'staff-1', tempId: row.id, label: 'Record deposit of UGX 12,345 for Jane Smith (JS-001)' })])
  })

  it('queues it when the request fails to reach the server, but not when the server refuses it', async () => {
    mutate.mockRejectedValueOnce(Object.assign(new Error('Failed to fetch'), { networkError: new TypeError('x'), graphQLErrors: [] }))
    expect((await mutateOrQueue({ operation: 'CREATE_TRANSACTION', variables, getState: () => state })).queued).toBe(true)
    expect(network.isOffline()).toBe(true)

    network.markServerReachable()
    mutate.mockRejectedValueOnce(Object.assign(new Error('Insufficient balance'), { graphQLErrors: [{ message: 'Insufficient balance' }] }))
    await expect(mutateOrQueue({ operation: 'CREATE_TRANSACTION', variables, getState: () => state })).rejects.toThrow('Insufficient balance')
    expect(getOutbox()).toHaveLength(1)
  })

  it('an edit made offline marks the existing row pending, without a temporary id', async () => {
    window.dispatchEvent(new Event('offline'))
    const result = await mutateOrQueue({
      operation: 'UPDATE_ACCOUNT',
      variables: { updateAccountId: 'a1', status: 'INACTIVE' },
      getState: () => state,
    })
    expect(result.data.updateAccount).toMatchObject({ id: 'a1', accountNumber: 'JS-001', status: 'INACTIVE', syncStatus: 'pending' })
    expect(getOutbox()[0].tempId).toBeNull()
  })
})
