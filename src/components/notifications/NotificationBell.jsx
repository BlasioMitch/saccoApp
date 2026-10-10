import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Bell, CheckCheck, KeyRound, Landmark, ReceiptText, ShieldCheck, UserRound } from 'lucide-react'
import { MARK_NOTIFICATIONS_READ, MY_NOTIFICATIONS } from '../../graphql/queries/notifications'

const ICONS = {
  PASSWORD_RESET: KeyRound,
  TRANSACTION: ReceiptText,
  LOAN: Landmark,
  PROFILE: UserRound,
  SECURITY: ShieldCheck,
}

// Where a notification opens on the web (members see their own records on their profile)
const targetPath = ({ targetType, targetId }, isStaff) => {
  switch (targetType) {
    case 'PASSWORD_RESET': return `/home/password-resets${targetId ? `?request=${targetId}` : ''}`
    case 'TRANSACTION': return isStaff ? '/home/transactions' : '/home/profile'
    case 'LOAN': return isStaff ? '/home/loans' : '/home/profile'
    case 'PROFILE':
    case 'SECURITY': return '/home/settings'
    default: return null
  }
}

// TopBar bell: unread count, the latest notifications, and a tap opens what each one is about
const NotificationBell = () => {
  const navigate = useNavigate()
  const role = useSelector(state => state.auth.user?.role)
  const isStaff = ['ADMIN', 'MANAGER'].includes(String(role || '').toUpperCase())
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const buttonRef = useRef(null)

  const { data, refetch } = useQuery(MY_NOTIFICATIONS, {
    variables: { limit: 15 },
    pollInterval: 30_000,
    fetchPolicy: 'cache-and-network',
  })
  const [markRead] = useMutation(MARK_NOTIFICATIONS_READ, { onCompleted: () => refetch() })

  const items = data?.myNotifications?.items ?? []
  const unread = data?.myNotifications?.unreadCount ?? 0

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

  const openNotification = (item) => {
    if (!item.readAt) markRead({ variables: { ids: [item.id] } })
    setOpen(false)
    const path = targetPath(item, isStaff)
    if (path) navigate(path)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => { setOpen(value => !value); if (!open) refetch() }}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-custom-text-secondary transition-colors hover:bg-custom-interactive-hover hover:text-custom-text-primary"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-custom-bg-tertiary px-4 py-2">
            <span className="text-sm font-semibold text-custom-text-primary">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markRead({ variables: { ids: null } })}
                className="inline-flex items-center gap-1 text-xs font-medium text-custom-brand-primary hover:text-custom-brand-dark"
              >
                <CheckCheck className="h-4 w-4" /> Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-[min(28rem,70vh)] overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-custom-text-secondary">You're all caught up.</li>
            )}
            {items.map(item => {
              const Icon = ICONS[item.targetType] || Bell
              const isUnread = !item.readAt
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(item)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-custom-interactive-hover"
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.category === 'STAFF_REQUEST' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-custom-bg-secondary text-custom-brand-primary'}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm ${isUnread ? 'font-semibold text-custom-text-primary' : 'text-custom-text-secondary'}`}>{item.title}</span>
                      <span className="block text-xs text-custom-text-secondary line-clamp-2">{item.body}</span>
                      <span className="mt-1 block text-[11px] text-custom-text-muted">{moment(Number(item.createdAt) || item.createdAt).fromNow()}</span>
                    </span>
                    {isUnread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-custom-brand-primary" aria-label="Unread" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
