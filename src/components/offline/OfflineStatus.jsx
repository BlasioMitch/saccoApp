import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useStore } from 'react-redux'
import moment from 'moment'
import { AlertCircle, Cloud, CloudOff, Loader2, RefreshCw, Trash2, UploadCloud } from 'lucide-react'
import { useNetwork } from '../../offline/network'
import { removeItem, retryItem, useOutbox } from '../../offline/outbox'
import { syncOutbox } from '../../offline/sync'
import Button from '../ui/Button'
import { cn } from '../../lib/utils'

// Top bar, always shown: "Synced", "Syncing 2…", "Offline", "2 waiting" or "1 not sent", with the list of
// changes made offline (Retry / Discard)
const OfflineStatus = () => {
  const store = useStore()
  const userId = useSelector(state => state.auth.user?.id)
  const { online, serverReachable, lastSyncedAt, syncing: sending } = useNetwork()
  const { all, pending, failed } = useOutbox(userId)
  const [open, setOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const panelRef = useRef(null)
  const buttonRef = useRef(null)
  const connected = online && serverReachable

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!panelRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const sendNow = async () => {
    setSyncing(true)
    await syncOutbox(store)
    setSyncing(false)
  }

  const busy = connected && (sending || syncing)
  const synced = connected && !all.length && !busy
  const Icon = failed.length ? AlertCircle : !connected ? CloudOff : busy ? Loader2 : pending.length ? UploadCloud : Cloud
  const label = failed.length
    ? `${failed.length} not sent`
    : !connected ? (pending.length ? `Offline · ${pending.length} waiting` : 'Offline')
      : busy ? `Syncing${pending.length ? ` ${pending.length}` : ''}…`
        : pending.length ? `${pending.length} waiting` : 'Synced'
  const syncedAt = lastSyncedAt ? ` · up to date at ${moment(lastSyncedAt).format('HH:mm')}` : ''

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-label={synced ? `Synced${syncedAt}` : label}
        title={synced ? `All changes sent${syncedAt}` : label}
        aria-haspopup="dialog"
        className={cn(
          'flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium',
          failed.length ? 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400'
            : !connected ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300'
              : 'border-custom-bg-tertiary text-custom-text-secondary'
        )}
      >
        <Icon className={cn('h-4 w-4', busy && 'animate-spin motion-reduce:animate-none', synced && 'text-custom-brand-green')} aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </button>

      {open && (
        <div ref={panelRef} role="dialog" aria-label="Changes made offline" className="absolute right-0 top-11 z-50 w-[min(26rem,calc(100vw-2rem))] rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary shadow-lg">
          <div className="border-b border-custom-bg-tertiary px-4 py-3">
            <p className="text-sm font-semibold text-custom-text-primary">{!connected ? 'You are offline' : synced ? 'All changes sent' : busy ? 'Syncing' : 'Back online'}</p>
            <p className="text-xs text-custom-text-secondary">
              {connected
                ? (synced ? `Everything made in this browser has reached the server${syncedAt}.` : 'Changes made offline are sent in the order they were made.')
                : `Pages show the data saved ${lastSyncedAt ? `at ${moment(lastSyncedAt).format('HH:mm')}` : 'in this browser'}. Recording transactions, members, accounts, loans, edits and loan decisions still works; they are sent when you are back online.`}
            </p>
          </div>
          {all.length > 0 ? (
            <ul className="max-h-80 divide-y divide-custom-bg-tertiary overflow-y-auto">
              {all.map(item => (
                <li key={item.id} className="flex items-start gap-3 px-4 py-3">
                  {item.error
                    ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                    : <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-custom-text-muted" aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-custom-text-primary">{item.label}</p>
                    <p className="text-xs text-custom-text-muted">Made {moment(item.queuedAt).format('D MMM, HH:mm')}</p>
                    {item.error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{item.error}</p>}
                  </div>
                  {item.error && (
                    <div className="flex shrink-0 gap-1">
                      <Button size="icon" variant="ghost" title="Retry" aria-label={`Retry: ${item.label}`} onClick={() => retryItem(item.id)}><RefreshCw className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Discard" aria-label={`Discard: ${item.label}`} onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-custom-text-secondary">No changes waiting.</p>
          )}
          {connected && pending.length > 0 && (
            <div className="flex justify-end border-t border-custom-bg-tertiary px-4 py-2">
              <Button size="sm" onClick={sendNow} disabled={syncing}>
                {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Send now
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// A thin strip over the pages while offline
export const OfflineStrip = () => {
  const { online, serverReachable } = useNetwork()
  if (online && serverReachable) return null
  return (
    <div className="shrink-0 bg-yellow-500/15 px-4 py-1 text-center text-xs font-medium text-yellow-800 dark:text-yellow-300" role="status">
      {online ? 'The SACCO server cannot be reached.' : 'You are offline.'} Showing saved data; changes are sent when you are back online.
    </div>
  )
}

export default OfflineStatus
