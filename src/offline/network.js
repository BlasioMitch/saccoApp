import { useSyncExternalStore } from 'react'

// Whether the server can be reached right now. "online" is the browser's view of the connection;
// "serverReachable" comes from our own requests (a connection doesn't mean the server answers).
let state = {
  online: typeof navigator === 'undefined' ? true : navigator.onLine,
  serverReachable: true,
  lastSyncedAt: null,
  // Changes made offline are being sent right now
  syncing: false,
}
const listeners = new Set()

const set = (patch) => {
  const next = { ...state, ...patch }
  if (Object.keys(patch).every(key => next[key] === state[key])) return
  state = next
  listeners.forEach(listener => listener())
}

export const getNetwork = () => state
export const subscribeNetwork = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const useNetwork = () => useSyncExternalStore(subscribeNetwork, getNetwork)

export const isOffline = () => !state.online || !state.serverReachable
export const markServerReachable = () => set({ serverReachable: true, lastSyncedAt: Date.now() })
export const markServerUnreachable = () => set({ serverReachable: false })
// Before a retry: let the next request find out whether the server is back
export const giveServerAnotherChance = () => set({ serverReachable: true })
export const setSyncing = (syncing) => set({ syncing })

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => set({ online: true, serverReachable: true }))
  window.addEventListener('offline', () => set({ online: false }))
}

// A request that never reached the server (as opposed to one the server refused)
export const isNetworkFailure = (error) =>
  Boolean(error?.networkError) && !error?.graphQLErrors?.length && !error?.networkError?.statusCode

// Errors worth showing on a page: a request that never reached the server is explained by the offline strip
// instead, and the page keeps showing its saved data
export const visibleError = (error) => (error && !isNetworkFailure(error) ? error : null)
