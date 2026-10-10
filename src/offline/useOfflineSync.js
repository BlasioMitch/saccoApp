import { useEffect } from 'react'
import { useSelector, useStore } from 'react-redux'
import { giveServerAnotherChance, useNetwork, getNetwork } from './network'
import { useOutbox } from './outbox'
import { syncOutbox } from './sync'

const RETRY_MS = 30_000

// Sends changes made offline: when the connection comes back, when the window is focused, after signing in,
// and every 30 seconds while some are waiting (the server may be back before the browser notices)
export function useOfflineSync() {
  const store = useStore()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { online, serverReachable } = useNetwork()
  const { pending } = useOutbox(user?.id)
  const waiting = pending.length

  useEffect(() => {
    if (isAuthenticated && waiting && online && serverReachable) syncOutbox(store)
  }, [isAuthenticated, waiting, online, serverReachable, store])

  useEffect(() => {
    const onFocus = () => syncOutbox(store)
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [store])

  useEffect(() => {
    if (!waiting || !isAuthenticated) return
    const timer = setInterval(() => {
      // Give the server another chance; the request itself tells whether it is back
      if (!getNetwork().online) return
      giveServerAnotherChance()
      syncOutbox(store)
    }, RETRY_MS)
    return () => clearInterval(timer)
  }, [waiting, isAuthenticated, store])
}
