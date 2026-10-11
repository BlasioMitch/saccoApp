// The outbox keeps offline changes in this browser, in order, until they reach the server
import { beforeEach, describe, expect, it } from 'vitest'
import { offlineStore } from './storage'
import { enqueue, failItem, getOutbox, loadOutbox, removeItem, replaceDeep, replaceInOutbox, retryItem } from './outbox'

const settle = () => new Promise(resolve => setTimeout(resolve, 20))

beforeEach(async () => {
  for (const item of getOutbox()) removeItem(item.id)
  await settle()
})

describe('outbox', () => {
  it('keeps changes in the order they were made, each with its own key and time', () => {
    const first = enqueue({ userId: 'u1', operation: 'CREATE_TRANSACTION', label: 'First', variables: {} })
    const second = enqueue({ userId: 'u1', operation: 'UPDATE_USER', label: 'Second', variables: {} })
    expect(getOutbox().map(item => item.label)).toEqual(['First', 'Second'])
    expect(first.id).not.toBe(second.id)
    expect(new Date(first.queuedAt).getTime()).toBeLessThanOrEqual(Date.now())
  })

  it('survives a reload (saved in IndexedDB)', async () => {
    enqueue({ userId: 'u1', operation: 'CREATE_TRANSACTION', label: 'Saved', variables: { a: 1 } })
    await settle()
    expect((await offlineStore.getItem('outbox')).map(item => item.label)).toEqual(['Saved'])
    await loadOutbox()
    expect(getOutbox().map(item => item.label)).toEqual(['Saved'])
  })

  it('sets a refused change aside and lets it be retried or discarded', () => {
    const item = enqueue({ operation: 'APPROVE_LOAN', label: 'Approve', variables: {} })
    failItem(item.id, 'Already rejected')
    expect(getOutbox()[0].error).toBe('Already rejected')
    retryItem(item.id)
    expect(getOutbox()[0].error).toBeNull()
    removeItem(item.id)
    expect(getOutbox()).toEqual([])
  })

  it("points later changes at a new record's real id once it has synced", () => {
    enqueue({ operation: 'CREATE_ACCOUNT', label: 'Open', variables: { account: { userId: 'offline-1' } } })
    enqueue({ operation: 'CREATE_TRANSACTION', label: 'Deposit', variables: { transaction: { accountId: 'offline-2', notes: ['offline-1'] } } })
    replaceInOutbox('offline-1', 'real-user')
    expect(getOutbox()[0].variables.account.userId).toBe('real-user')
    expect(getOutbox()[1].variables.transaction).toEqual({ accountId: 'offline-2', notes: ['real-user'] })
  })

  it('replaceDeep leaves other values alone', () => {
    expect(replaceDeep({ a: 'x', b: [1, 'x', { c: 'y' }], d: null }, 'x', 'z')).toEqual({ a: 'z', b: [1, 'z', { c: 'y' }], d: null })
  })
})
