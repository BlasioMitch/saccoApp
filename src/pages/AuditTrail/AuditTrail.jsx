import React, { useEffect, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import moment from 'moment'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, FileSpreadsheet, Globe, Loader2, RefreshCw, Search, Server, Smartphone, X } from 'lucide-react'
import { AUDIT_FACETS, AUDIT_LOGS } from '../../graphql/queries/audit'
import { PageShell, Panel } from '../../components/layout/PageShell'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Button from '../../components/ui/Button'
import { TableRowsSkeleton } from '../../components/ui/Skeleton'
import { downloadCsv, toCsv } from '../../utils/csv'
import { cn } from '../../lib/utils'
import { visibleError } from '../../offline/network'

const PAGE_SIZE = 50
const EXPORT_LIMIT = 5000
const inputClass = 'h-9 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-3 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'

const SOURCES = [
  { value: '', label: 'All' },
  { value: 'WEB', label: 'Web' },
  { value: 'MOBILE', label: 'Phone' },
  { value: 'SYSTEM', label: 'System' },
]
const SOURCE_ICONS = { WEB: Globe, MOBILE: Smartphone, SYSTEM: Server }
const SOURCE_LABELS = { WEB: 'Web app', MOBILE: 'Phone app', SYSTEM: 'System' }

// LOAN_APPROVE -> "Loan approve"
const humanize = (value) => value ? value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' ') : ''

// What staff call each action; anything not listed is humanized from its code
const ACTION_LABELS = {
  PASSWORD_RESET_ISSUED: 'Password reset approved',
  PASSWORD_RESET_DISMISSED: 'Password reset dismissed',
  PASSWORD_RESET_REQUESTED: 'Password reset requested',
  LOGIN_CODE_REQUESTED: 'Sign-in code asked',
  TWO_FACTOR_FAILED: 'Wrong 2-step code',
  LOGIN_SUCCESS: 'Signed in',
  LOGIN_FAILED: 'Sign-in failed',
  LOGOUT: 'Signed out',
  OFFLINE_LOGIN: 'Signed in offline',
  OFFLINE_LOGIN_FAILED: 'Offline sign-in failed',
  BIOMETRIC_ENROLLED: 'Fingerprint turned on',
  BIOMETRIC_LOGIN: 'Fingerprint sign-in',
  BIOMETRIC_REVOKED: 'Fingerprint turned off',
  PASSKEY_ADDED: 'Passkey added',
  PASSKEY_LOGIN: 'Passkey sign-in',
  PASSKEY_REMOVED: 'Passkey removed',
  LOAN_APPROVE: 'Loan approved',
  LOAN_REJECT: 'Loan declined',
  LOAN_APPLY: 'Loan application',
}
const actionLabel = (action) => ACTION_LABELS[action] ?? humanize(action)
// Failures and security changes stand out in the list
const actionTone = (action) => {
  if (/FAILED|REFUSED/.test(action)) return 'bg-red-500/10 text-red-700 dark:text-red-400'
  if (/PASSWORD|TWO_FACTOR|BIOMETRIC|PASSKEY|DELETE/.test(action)) return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
  if (/LOGIN|LOGOUT|CODE/.test(action)) return 'bg-custom-bg-tertiary text-custom-text-secondary'
  return 'bg-green-500/10 text-green-700 dark:text-green-400'
}

const useDebounced = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const Detail = ({ label, children }) => (
  <>
    <dt className="text-custom-text-secondary">{label}</dt>
    <dd className="min-w-0 break-words text-custom-text-primary">{children || '–'}</dd>
  </>
)

const EntryDialog = ({ entry, onClose }) => (
  <Dialog open={Boolean(entry)} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 shadow-2xl">
      {entry && (
        <>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-custom-text-primary">{entry.summary || actionLabel(entry.action)}</DialogTitle>
            <DialogDescription className="text-sm text-custom-text-secondary">
              {entry.clientCreatedAt
                ? `Made offline ${moment(entry.clientCreatedAt).format('D MMM YYYY, HH:mm:ss')} · synced ${moment(entry.createdAt).format('D MMM YYYY, HH:mm:ss')}`
                : moment(entry.createdAt).format('dddd D MMMM YYYY, HH:mm:ss')}
            </DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-2 text-sm">
            <Detail label="Action">{actionLabel(entry.action)} <code className="text-xs text-custom-text-muted">{entry.action}</code></Detail>
            <Detail label="About">{entry.subjectName}</Detail>
            <Detail label="By">{entry.actorEmail ? `${entry.actorEmail}${entry.actorRole ? ` (${entry.actorRole.toLowerCase()})` : ''}` : 'Not signed in'}</Detail>
            <Detail label="From">{SOURCE_LABELS[entry.source]}</Detail>
            <Detail label="Record">{entry.entityType ? `${humanize(entry.entityType)} ${entry.entityId ?? ''}` : null}</Detail>
            <Detail label="Request">{entry.method ? `${entry.method} ${entry.path} → ${entry.statusCode ?? ''}` : null}</Detail>
            <Detail label="IP address">{entry.ip}</Detail>
            <Detail label="Device">{entry.userAgent}</Detail>
          </dl>
          <div>
            <p className="mb-1 text-sm font-medium text-custom-text-primary">Details</p>
            {entry.changes ? (
              <pre className="max-h-64 overflow-auto rounded-lg bg-custom-bg-secondary p-3 text-xs text-custom-text-primary">{JSON.stringify(entry.changes, null, 2)}</pre>
            ) : (
              <p className="text-sm text-custom-text-secondary">No details recorded.</p>
            )}
            <p className="mt-1 text-xs text-custom-text-muted">Passwords, codes and images are never stored.</p>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
)

const csvRows = (items) => items.map(entry => ({
  Time: moment(entry.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  Actor: entry.actorEmail ?? '',
  Role: entry.actorRole ?? '',
  Source: entry.source,
  Action: entry.action,
  'Member affected': entry.subjectName ?? '',
  Summary: entry.summary ?? '',
  'Made offline at': entry.clientCreatedAt ? moment(entry.clientCreatedAt).format('YYYY-MM-DD HH:mm:ss') : '',
  Record: entry.entityType ?? '',
  'Record id': entry.entityId ?? '',
  IP: entry.ip ?? '',
  Details: entry.changes ? JSON.stringify(entry.changes) : '',
}))

// ADMIN only: every change and sign-in, from the web app, the phone app and the system
const AuditTrail = () => {
  const client = useApolloClient()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [actorId, setActorId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [action, setAction] = useState('')
  const [entityType, setEntityType] = useState('')
  const [source, setSource] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const [exporting, setExporting] = useState(false)
  const q = useDebounced(search.trim())

  const filter = Object.fromEntries(Object.entries({ from, to, actorId, subjectId, action, entityType, source, q }).filter(([, value]) => value))
  const filterKey = JSON.stringify(filter)
  useEffect(() => setPage(0), [filterKey])

  const { data: facets } = useQuery(AUDIT_FACETS, { fetchPolicy: 'cache-and-network' })
  const { data, previousData, loading, error, refetch } = useQuery(AUDIT_LOGS, {
    variables: { filter, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
    fetchPolicy: 'cache-and-network',
  })
  const result = (data ?? previousData)?.auditLogs
  const items = result?.items ?? []
  const total = result?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const filtered = Object.keys(filter).length > 0

  const clear = () => {
    setFrom(''); setTo(''); setActorId(''); setSubjectId(''); setAction(''); setEntityType(''); setSource(''); setSearch('')
  }

  // The whole filtered trail (up to 5,000 rows), 200 at a time
  const exportCsv = async () => {
    setExporting(true)
    try {
      const rows = []
      for (let offset = 0; offset < Math.min(total, EXPORT_LIMIT); offset += 200) {
        const { data: chunk } = await client.query({ query: AUDIT_LOGS, variables: { filter, limit: 200, offset }, fetchPolicy: 'network-only' })
        rows.push(...chunk.auditLogs.items)
      }
      if (!rows.length) return toast.error('Nothing to export')
      const csv = csvRows(rows)
      downloadCsv(`audit-trail_${moment().format('YYYY-MM-DD_HHmm')}.csv`, toCsv(csv, Object.keys(csv[0]).map(key => ({ key }))))
      if (total > EXPORT_LIMIT) toast.info(`Exported the newest ${EXPORT_LIMIT.toLocaleString('en-US')} entries; narrow the filters for the rest`)
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <PageShell>
      <Panel>
        <div className="flex shrink-0 flex-wrap items-end gap-2 border-b border-custom-bg-tertiary px-3 py-3">
          <div className="relative min-w-48 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-text-secondary" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search summary, member, email, record id or IP…"
              className={cn(inputClass, 'w-full pl-9')}
              aria-label="Search the audit trail"
            />
          </div>
          <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className={inputClass} aria-label="From date" />
          <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={inputClass} aria-label="To date" />
          <select value={actorId} onChange={(e) => setActorId(e.target.value)} className={cn(inputClass, 'max-w-48')} aria-label="Who">
            <option value="">Everyone</option>
            {facets?.auditFacets.actors.map(actor => <option key={actor.actorId} value={actor.actorId}>{actor.actorEmail || actor.actorId}</option>)}
          </select>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={cn(inputClass, 'max-w-48')} aria-label="Member affected">
            <option value="">Any member</option>
            {facets?.auditFacets.subjects.map(subject => <option key={subject.subjectId} value={subject.subjectId}>{subject.subjectName || subject.subjectId}</option>)}
          </select>
          <select value={action} onChange={(e) => setAction(e.target.value)} className={cn(inputClass, 'max-w-48')} aria-label="Action">
            <option value="">All actions</option>
            {facets?.auditFacets.actions.map(value => <option key={value} value={value}>{actionLabel(value)}</option>)}
          </select>
          <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className={inputClass} aria-label="Record type">
            <option value="">All records</option>
            {facets?.auditFacets.entityTypes.map(value => <option key={value} value={value}>{humanize(value)}</option>)}
          </select>
          <div className="flex rounded-lg border border-custom-bg-tertiary p-0.5" role="radiogroup" aria-label="Source">
            {SOURCES.map(option => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={source === option.value}
                onClick={() => setSource(option.value)}
                className={cn('h-8 rounded-md px-3 text-sm font-medium', source === option.value ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text' : 'text-custom-text-secondary hover:bg-custom-interactive-hover')}
              >
                {option.label}
              </button>
            ))}
          </div>
          {filtered && <Button variant="ghost" size="sm" className="px-2" onClick={clear}><X className="h-4 w-4" /> Clear</Button>}
          <div className="ml-auto flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => refetch()} aria-label="Refresh" title="Refresh">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
            <Button variant="secondary" className="px-3" onClick={exportCsv} disabled={!total || exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />} CSV
            </Button>
          </div>
        </div>

        {visibleError(error) && <p className="px-4 py-2 text-sm text-red-600">{error.message}</p>}

        <div className={cn('min-h-0 flex-1 overflow-auto transition-opacity', loading && result && 'opacity-60')}>
          {!result && loading ? <TableRowsSkeleton rows={12} columns={7} /> : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Time', 'Who', 'From', 'Action', 'What happened', 'Member affected', 'IP'].map(label => (
                  <th key={label} className="sticky top-0 z-10 h-10 whitespace-nowrap border-b border-custom-bg-tertiary bg-custom-bg-table px-4 text-left text-xs font-semibold uppercase tracking-wide text-custom-text-secondary">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(entry => {
                const SourceIcon = SOURCE_ICONS[entry.source] || Server
                return (
                  <tr
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(entry)}
                    tabIndex={0}
                    className="cursor-pointer border-b border-custom-bg-tertiary hover:bg-custom-interactive-hover focus:bg-custom-interactive-hover focus:outline-none"
                  >
                    {/* Made offline: when it really happened, marked, with the sync time on hover */}
                    <td
                      className="h-11 whitespace-nowrap px-4 tabular-nums text-custom-text-secondary"
                      title={entry.clientCreatedAt
                        ? `Made offline ${moment(entry.clientCreatedAt).format('YYYY-MM-DD HH:mm:ss')} · synced ${moment(entry.createdAt).format('YYYY-MM-DD HH:mm:ss')}`
                        : moment(entry.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    >
                      {moment(entry.clientCreatedAt || entry.createdAt).format('DD MMM, HH:mm')}
                      {entry.clientCreatedAt && <span className="ml-2 rounded-full bg-custom-bg-tertiary px-2 py-0.5 text-[11px] text-custom-text-secondary">offline</span>}
                    </td>
                    <td className="max-w-56 truncate px-4 text-custom-text-primary">
                      {entry.actorEmail || <span className="text-custom-text-muted">Not signed in</span>}
                      {entry.actorRole && <span className="ml-1 text-xs capitalize text-custom-text-muted">{entry.actorRole.toLowerCase()}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 text-custom-text-secondary">
                      <span className="inline-flex items-center gap-1"><SourceIcon className="h-4 w-4" aria-hidden="true" />{SOURCE_LABELS[entry.source]}</span>
                    </td>
                    <td className="whitespace-nowrap px-4">
                      <span className={cn('inline-flex h-6 items-center rounded-full px-2 text-xs font-medium', actionTone(entry.action))}>{actionLabel(entry.action)}</span>
                    </td>
                    <td className="max-w-md truncate px-4 text-custom-text-primary" title={entry.summary || ''}>
                      {entry.summary}
                    </td>
                    <td className="max-w-56 truncate px-4 text-xs text-custom-text-secondary" title={entry.subjectName || ''}>
                      {entry.subjectId
                        ? <button type="button" onClick={(e) => { e.stopPropagation(); setSubjectId(entry.subjectId) }} className="hover:text-custom-text-primary hover:underline">{entry.subjectName || 'Member'}</button>
                        : <span className="text-custom-text-muted">{entry.subjectName || '–'}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 text-xs text-custom-text-muted">{entry.ip || '–'}</td>
                  </tr>
                )
              })}
              {!items.length && !loading && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-custom-text-secondary">{filtered ? 'Nothing matches these filters.' : 'No activity recorded yet.'}</td></tr>
              )}
            </tbody>
          </table>
          )}
        </div>

        <div className="flex h-12 shrink-0 items-center justify-between border-t border-custom-bg-tertiary px-4 text-sm text-custom-text-secondary">
          <span>{total.toLocaleString('en-US')} {total === 1 ? 'entry' : 'entries'}</span>
          <span className="flex items-center gap-2">
            Page {page + 1} of {pages}
            <Button size="icon" variant="ghost" onClick={() => setPage(value => Math.max(0, value - 1))} disabled={page === 0} aria-label="Newer entries"><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => setPage(value => Math.min(pages - 1, value + 1))} disabled={page >= pages - 1} aria-label="Older entries"><ChevronRight className="h-4 w-4" /></Button>
          </span>
        </div>
      </Panel>
      <EntryDialog entry={selected} onClose={() => setSelected(null)} />
    </PageShell>
  )
}

export default AuditTrail
