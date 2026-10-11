// Whether the server can be reached, and which errors are worth showing on a page
import { describe, expect, it } from 'vitest'
import { getNetwork, giveServerAnotherChance, isNetworkFailure, isOffline, markServerReachable, markServerUnreachable, setSyncing, visibleError } from './network'

describe('network state', () => {
  it('is offline when the browser is, or when the server stopped answering', () => {
    markServerReachable()
    expect(isOffline()).toBe(false)
    markServerUnreachable()
    expect(isOffline()).toBe(true)
    giveServerAnotherChance()
    expect(isOffline()).toBe(false)
    window.dispatchEvent(new Event('offline'))
    expect(isOffline()).toBe(true)
    window.dispatchEvent(new Event('online'))
    expect(isOffline()).toBe(false)
  })

  it('remembers when data last came back, and whether a sync is running', () => {
    markServerReachable()
    expect(getNetwork().lastSyncedAt).toBeGreaterThan(Date.now() - 1000)
    setSyncing(true)
    expect(getNetwork().syncing).toBe(true)
    setSyncing(false)
  })

  it('tells a request that never reached the server from one the server refused', () => {
    const offline = { networkError: new TypeError('Failed to fetch'), graphQLErrors: [] }
    const refused = { networkError: null, graphQLErrors: [{ message: 'Insufficient balance' }] }
    const serverDown = { networkError: { statusCode: 502 }, graphQLErrors: [] }
    expect(isNetworkFailure(offline)).toBe(true)
    expect(isNetworkFailure(refused)).toBe(false)
    expect(isNetworkFailure(serverDown)).toBe(false)
    // Pages keep their saved data and leave "offline" to the strip
    expect(visibleError(offline)).toBeNull()
    expect(visibleError(refused)).toBe(refused)
  })
})
