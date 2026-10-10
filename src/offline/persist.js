import { offlineStore } from './storage'
import { loadOutbox } from './outbox'
import { apolloPersistor } from '../graphql/client'

// What the pages show offline: the Redux lists (members, transactions, loans, accounts, reports) and the
// Apollo cache (dashboard, reports, applications, audit), saved in IndexedDB for the signed-in user only.
const SLICES = ['users', 'transactions', 'loans', 'accounts', 'savings', 'loanPayments', 'profile']
const REDUX_KEY = 'redux'

export const REHYDRATE = 'offline/rehydrate'

export async function restoreOfflineData(store) {
  await loadOutbox()
  const user = store.getState().auth.user
  try {
    const saved = await offlineStore.getItem(REDUX_KEY)
    if (saved && user && saved.userId === user.id) store.dispatch({ type: REHYDRATE, payload: saved.slices })
  } catch {
    // nothing saved, or unreadable: start empty
  }
  if (user) await apolloPersistor.restore().catch(() => apolloPersistor.purge())
}

export function saveOfflineData(store) {
  let timer = null
  const save = () => {
    const state = store.getState()
    if (!state.auth.isAuthenticated || !state.auth.user) return
    // A list caught mid-load is saved as loaded, so it shows straight away next time
    const slices = Object.fromEntries(SLICES.map(name => [name, { ...state[name], status: state[name]?.status === 'loading' ? 'succeeded' : state[name]?.status }]))
    offlineStore.setItem(REDUX_KEY, { userId: state.auth.user.id, slices }).catch(() => {})
  }
  return store.subscribe(() => {
    clearTimeout(timer)
    timer = setTimeout(save, 1000)
  })
}

// Signing out: the saved data belongs to that user (changes still waiting are kept, scoped to them)
export async function clearOfflineData() {
  await offlineStore.removeItem(REDUX_KEY).catch(() => {})
  await apolloPersistor.purge().catch(() => {})
}
