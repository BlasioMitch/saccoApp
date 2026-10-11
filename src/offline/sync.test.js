// Sending offline changes when back online: in order, once each, refused ones set aside
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mutate = vi.fn()
vi.mock('../graphql/client', () => ({ default: { mutate: (...args) => mutate(...args), refetchQueries: vi.fn(async () => []) } }))
vi.mock('../reducers/transactionReducer', () => ({ fetchTransactions: () => ({ type: 'fetchTransactions' }) }))
vi.mock('../reducers/userReducer', () => ({ fetchUsers: () => ({ type: 'fetchUsers' }) }))
vi.mock('../reducers/accountsReducer', () => ({ fetchAccounts: () => ({ type: 'fetchAccounts' }) }))
vi.mock('../reducers/loansReducer', () => ({ fetchLoans: () => ({ type: 'fetchLoans' }) }))

const { syncOutbox } = await import('./sync')
const { enqueue, getOutbox, removeItem } = await import('./outbox')
const network = await import('./network')

const store = (userId = 'staff-1') => ({ dispatch: vi.fn(), getState: () => ({ auth: { isAuthenticated: true, user: { id: userId } } }) })
const offlineError = () => Object.assign(new Error('Failed to fetch'), { networkError: new TypeError('Failed to fetch'), graphQLErrors: [] })
const refused = (message, code = 'BAD_USER_INPUT') => Object.assign(new Error(message), { graphQLErrors: [{ message, extensions: { code } }] })

const deposit = (label, extra = {}) => enqueue({ userId: 'staff-1', operation: 'CREATE_TRANSACTION', label, variables: { transaction: { accountId: 'a1', type: 'SAVINGS_DEPOSIT', amount: 100 } }, ...extra })

beforeEach(() => {
  for (const item of getOutbox()) removeItem(item.id)
  mutate.mockReset()
  network.markServerReachable()
  window.dispatchEvent(new Event('online'))
})

describe('syncOutbox', () => {
  it('sends changes in order with their idempotency key and the time they were made', async () => {
    const first = deposit('First')
    const second = deposit('Second')
    mutate.mockResolvedValue({ data: { createTransaction: { id: 't' } } })
    const result = await syncOutbox(store())
    expect(result).toEqual({ sent: 2, failed: 0 })
    expect(mutate.mock.calls.map(([options]) => options.context.headers)).toEqual([
      { 'x-idempotency-key': first.id, 'x-queued-at': first.queuedAt },
      { 'x-idempotency-key': second.id, 'x-queued-at': second.queuedAt },
    ])
    expect(getOutbox()).toEqual([])
  })

  it('stops at the first change that cannot get through and keeps the rest', async () => {
    deposit('First')
    deposit('Second')
    mutate.mockRejectedValueOnce(offlineError())
    await syncOutbox(store())
    expect(mutate).toHaveBeenCalledTimes(1)
    expect(getOutbox().map(item => [item.label, item.error])).toEqual([['First', null], ['Second', null]])
    expect(network.isOffline()).toBe(true)
  })

  it('sets a refused change aside and carries on with the rest', async () => {
    deposit('Too big')
    deposit('Fine')
    mutate.mockRejectedValueOnce(refused('Insufficient balance: 50 available')).mockResolvedValueOnce({ data: { createTransaction: { id: 't2' } } })
    expect(await syncOutbox(store())).toEqual({ sent: 1, failed: 1 })
    expect(getOutbox()).toEqual([expect.objectContaining({ label: 'Too big', error: 'Insufficient balance: 50 available' })])
  })

  it('leaves a change another copy is sending for the next round', async () => {
    deposit('Busy')
    mutate.mockRejectedValueOnce(refused('This change is already being sent.', 'IN_PROGRESS'))
    await syncOutbox(store())
    expect(getOutbox()).toEqual([expect.objectContaining({ label: 'Busy', error: null })])
  })

  it('swaps a new record\'s temporary id into later changes, and fails changes that depend on an unsent one', async () => {
    enqueue({ userId: 'staff-1', operation: 'CREATE_USER', label: 'Register', tempId: 'offline-u', variables: { user: { email: 'a@b.c' } } })
    enqueue({ userId: 'staff-1', operation: 'CREATE_ACCOUNT', label: 'Open', tempId: 'offline-a', variables: { account: { userId: 'offline-u' } } })
    enqueue({ userId: 'staff-1', operation: 'CREATE_TRANSACTION', label: 'Deposit', variables: { transaction: { accountId: 'offline-a' } } })
    mutate
      .mockResolvedValueOnce({ data: { createUser: { id: 'real-user' } } })
      .mockRejectedValueOnce(refused('User already has an account'))
    await syncOutbox(store())
    expect(mutate.mock.calls[1][0].variables).toEqual({ account: { userId: 'real-user' } })
    expect(getOutbox().map(item => [item.label, item.error])).toEqual([
      ['Open', 'User already has an account'],
      ['Deposit', 'It depends on a new record that could not be sent'],
    ])
  })

  it("only sends the signed-in user's changes, and nothing while offline", async () => {
    deposit('Mine')
    enqueue({ userId: 'someone-else', operation: 'CREATE_TRANSACTION', label: 'Theirs', variables: {} })
    window.dispatchEvent(new Event('offline'))
    expect(await syncOutbox(store())).toEqual({ sent: 0, failed: 0 })
    window.dispatchEvent(new Event('online'))
    mutate.mockResolvedValue({ data: {} })
    await syncOutbox(store())
    expect(getOutbox().map(item => item.label)).toEqual(['Theirs'])
  })

  it('shows syncing while it runs, and refreshes the lists afterwards', async () => {
    deposit('One')
    let syncingDuringSend = null
    mutate.mockImplementation(async () => { syncingDuringSend = network.getNetwork().syncing; return { data: {} } })
    const s = store()
    await syncOutbox(s)
    expect(syncingDuringSend).toBe(true)
    expect(network.getNetwork().syncing).toBe(false)
    expect(s.dispatch.mock.calls.map(([action]) => action.type)).toEqual(['fetchTransactions', 'fetchUsers', 'fetchAccounts', 'fetchLoans'])
  })
})
