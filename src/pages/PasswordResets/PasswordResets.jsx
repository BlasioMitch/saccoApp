import React, { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { toast } from 'sonner'
import {
  AlertTriangle, CheckCircle2, Copy, Eye, EyeOff, KeyRound, Loader2, MonitorSmartphone, RefreshCw, ShieldCheck, Smartphone, X,
} from 'lucide-react'
import { COMPLETE_PASSWORD_RESET, DISMISS_PASSWORD_RESET, GET_PASSWORD_RESETS } from '../../graphql/queries/passwordResets'
import { PageShell, Panel } from '../../components/layout/PageShell'
import StatusBadge from '../../components/ui/StatusBadge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { TableRowsSkeleton } from '../../components/ui/Skeleton'
import { passwordProblem } from '../../components/auth/authStyles'
import { cn } from '../../lib/utils'
import { visibleError } from '../../offline/network'

const TABS = [
  { key: 'PENDING', label: 'Pending', empty: 'No password reset requests waiting', hint: 'When a member uses "Forgot password?" on the web or phone, the request appears here.' },
  { key: null, label: 'All', empty: 'No password reset requests yet' },
]

const NO_REQUESTS = []
const inputClass = 'h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'
const labelClass = 'mb-2 block text-sm font-medium text-custom-text-primary'

// 12 characters without look-alikes (0/O, 1/l/I), always with letters and digits
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
const generatePassword = () => {
  const bytes = crypto.getRandomValues(new Uint32Array(12))
  const password = Array.from(bytes, value => ALPHABET[value % ALPHABET.length]).join('')
  return passwordProblem(password) ? generatePassword() : password
}

const formatDate = (value) => value ? moment(Number(value) || value).format('DD MMM YYYY, HH:mm') : '–'
const fromNow = (value) => value ? moment(Number(value) || value).fromNow() : '–'
const nameOf = (request) => request.user?.fullName || request.email
const splitName = (request) => {
  const [first_name = '', ...rest] = String(nameOf(request)).split(' ')
  return { first_name, last_name: rest.at(-1) || '', avatar: request.user?.avatar }
}

const SourceLabel = ({ source }) => {
  const Icon = source === 'MOBILE' ? Smartphone : MonitorSmartphone
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="h-4 w-4" aria-hidden="true" /> {source === 'MOBILE' ? 'Phone app' : source === 'WEB' ? 'Web app' : 'Unknown'}
    </span>
  )
}

const RequestRow = ({ request, selected, onSelect }) => (
  <li>
    <button
      type="button"
      onClick={() => onSelect(request.id)}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-3 border-b border-custom-bg-tertiary px-4 py-3 text-left transition-colors',
        selected ? 'bg-custom-interactive-focus' : 'hover:bg-custom-interactive-hover'
      )}
    >
      <Avatar user={splitName(request)} className="h-9 w-9" textClassName="text-xs" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-custom-text-primary">{nameOf(request)}</span>
        <span className="block truncate text-xs text-custom-text-secondary">{request.email}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <StatusBadge status={request.status} />
        <span className="text-[11px] text-custom-text-muted">{fromNow(request.lastRequestedAt)}</span>
      </span>
    </button>
  </li>
)

const Fact = ({ label, children }) => (
  <>
    <dt className="text-custom-text-secondary">{label}</dt>
    <dd className="min-w-0 text-custom-text-primary">{children}</dd>
  </>
)

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied')
  } catch {
    toast.error('Could not copy; select the password and copy it instead')
  }
}

// Every list of requests (this page and the sidebar count) refreshes after a decision
const REFETCH = { refetchQueries: [GET_PASSWORD_RESETS] }

const ResetResult = ({ request, result }) => result.emailSent ? (
  <div className="flex items-start gap-3 rounded-lg bg-green-500/10 p-4 text-sm text-green-800 dark:text-green-300">
    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
    <p>The temporary password was emailed to <strong>{request.email}</strong>. It works until {formatDate(result.expiresAt)}; the member must choose a new password after signing in.</p>
  </div>
) : (
  <div className="space-y-3 rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-800 dark:text-yellow-300">
    <p className="flex items-start gap-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span>The password was reset, but the email could not be sent. Give the member this temporary password another way (it works until {formatDate(result.expiresAt)}):</span>
    </p>
    <div className="flex items-center gap-2">
      <code className="flex-1 rounded-md bg-custom-bg-primary px-3 py-2 font-mono text-base text-custom-text-primary">{result.password}</code>
      <Button size="icon" variant="secondary" onClick={() => copy(result.password)} aria-label="Copy password"><Copy className="h-4 w-4" /></Button>
    </div>
  </div>
)

// Set a temporary password for the selected request; it is emailed to the member
const ResetForm = ({ request, onResult }) => {
  const [password, setPassword] = useState(generatePassword)
  const [visible, setVisible] = useState(true)
  const [dismissing, setDismissing] = useState(false)
  const [note, setNote] = useState('')
  const [complete, { loading }] = useMutation(COMPLETE_PASSWORD_RESET, REFETCH)
  const [dismiss, { loading: dismissLoading }] = useMutation(DISMISS_PASSWORD_RESET, REFETCH)
  const problem = passwordProblem(password)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await complete({ variables: { id: request.id, password } })
      onResult({ ...data.completePasswordReset, password })
      toast.success(data.completePasswordReset.emailSent ? 'Temporary password emailed' : 'Password reset; the email could not be sent')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitDismiss = async (e) => {
    e.preventDefault()
    try {
      await dismiss({ variables: { id: request.id, note: note.trim() || null } })
      toast.success('Request dismissed')
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (dismissing) {
    return (
      <form onSubmit={submitDismiss} className="space-y-4">
        <div>
          <label htmlFor="dismiss-note" className={labelClass}>Why are you dismissing this request? (optional)</label>
          <input id="dismiss-note" value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} placeholder="e.g. Member remembered their password" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" className="px-4" onClick={() => setDismissing(false)}>Back</Button>
          <Button variant="danger" type="submit" className="px-4" disabled={dismissLoading}>
            {dismissLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Dismiss request
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="temp-password" className={labelClass}>Temporary password</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="temp-password"
              type={visible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className={cn(inputClass, 'pr-10 font-mono')}
              aria-describedby="temp-password-hint"
            />
            <button
              type="button"
              onClick={() => setVisible(value => !value)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-custom-text-secondary hover:text-custom-text-primary"
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button size="icon" variant="secondary" className="h-10 w-10" onClick={() => setPassword(generatePassword())} aria-label="Generate another password" title="Generate another">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-10 w-10" onClick={() => copy(password)} aria-label="Copy password" title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p id="temp-password-hint" className={cn('mt-1 text-xs', problem ? 'text-red-500' : 'text-custom-text-muted')}>
          {problem || 'Emailed to the member. Valid for 24 hours; they must replace it after signing in.'}
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" className="px-4" onClick={() => setDismissing(true)}>Dismiss</Button>
        <Button type="submit" className="px-4" disabled={loading || Boolean(problem)}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Reset password
        </Button>
      </div>
    </form>
  )
}

const RequestDetails = ({ request, onClose }) => {
  // Kept here (not in the form) so it stays visible once the request is marked completed
  const [result, setResult] = useState(null)
  return (
  <div className="flex h-full min-h-0 flex-col">
    <div className="flex items-center gap-3 border-b border-custom-bg-tertiary px-6 py-4">
      <Avatar user={splitName(request)} className="h-11 w-11" textClassName="text-sm" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-custom-text-primary">{nameOf(request)}</h2>
        <p className="truncate text-sm text-custom-text-secondary">{request.email}</p>
      </div>
      <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close details" className="lg:hidden"><X className="h-4 w-4" /></Button>
    </div>
    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-4">
      <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
        <Fact label="Status"><StatusBadge status={request.status} /></Fact>
        <Fact label="Requested">{formatDate(request.lastRequestedAt)}{request.requestCount > 1 && <span className="text-custom-text-secondary"> · {request.requestCount} times</span>}</Fact>
        <Fact label="From"><SourceLabel source={request.source} /></Fact>
        <Fact label="Role"><span className="capitalize">{String(request.user?.role || '–').toLowerCase()}</span></Fact>
        <Fact label="Last sign-in">{formatDate(request.user?.lastLogin)}</Fact>
        {request.handledAt && <Fact label="Handled">{formatDate(request.handledAt)}{request.handledBy && ` by ${request.handledBy.fullName}`}</Fact>}
        {request.note && <Fact label="Note">{request.note}</Fact>}
      </dl>

      {request.user?.twoFactorEnabled && (
        <p className="flex items-start gap-2 rounded-lg bg-custom-bg-secondary p-3 text-sm text-custom-text-secondary">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-custom-brand-primary" aria-hidden="true" />
          2-step verification stays on: the member will still need their code after signing in with the temporary password.
        </p>
      )}

      {result
        ? <ResetResult request={request} result={result} />
        : request.status === 'PENDING'
          ? <ResetForm request={request} onResult={setResult} />
          : <p className="text-sm text-custom-text-secondary">This request has been {request.status.toLowerCase()}.</p>}
    </div>
  </div>
  )
}

// Staff handle "Forgot password?" requests: set a temporary password that is emailed to the member
const PasswordResets = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('request')
  const [tab, setTab] = useState('PENDING')

  const { data, previousData, loading, error, refetch } = useQuery(GET_PASSWORD_RESETS, {
    variables: { status: tab },
    fetchPolicy: 'cache-and-network',
    pollInterval: 60_000,
  })
  const requests = (data ?? previousData)?.passwordResets ?? NO_REQUESTS

  // A notification can point at a request outside the current tab
  const { data: allData } = useQuery(GET_PASSWORD_RESETS, { variables: { status: null }, skip: !selectedId, fetchPolicy: 'cache-and-network' })
  const selected = useMemo(
    () => requests.find(request => request.id === selectedId) ?? allData?.passwordResets?.find(request => request.id === selectedId) ?? null,
    [requests, allData, selectedId]
  )
  const current = TABS.find(option => option.key === tab)

  const select = (id) => setSearchParams(id ? { request: id } : {})

  return (
    <PageShell>
      <div className="grid min-h-0 flex-1 gap-[var(--section-gap)] lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <Panel className={cn(selected && 'hidden lg:flex')}>
          <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary px-3">
            <div className="flex rounded-lg border border-custom-bg-tertiary p-1" role="tablist">
              {TABS.map(option => (
                <button
                  key={option.label}
                  role="tab"
                  aria-selected={tab === option.key}
                  onClick={() => setTab(option.key)}
                  className={cn(
                    'h-8 rounded-md px-4 text-sm font-medium transition-colors',
                    tab === option.key ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text' : 'text-custom-text-secondary hover:bg-custom-interactive-hover'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Button size="icon" variant="ghost" onClick={() => refetch()} aria-label="Refresh" title="Refresh">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
          </div>
          {visibleError(error) && <p className="px-4 py-3 text-sm text-red-600">{error.message}</p>}
          {requests.length === 0 && loading && !data && !previousData ? (
            <TableRowsSkeleton rows={6} columns={3} />
          ) : requests.length === 0 && !loading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
              <KeyRound className="h-8 w-8 text-custom-text-muted" aria-hidden="true" />
              <p className="text-sm font-medium text-custom-text-primary">{current.empty}</p>
              {current.hint && <p className="max-w-sm text-sm text-custom-text-secondary">{current.hint}</p>}
            </div>
          ) : (
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {requests.map(request => (
                <RequestRow key={request.id} request={request} selected={request.id === selectedId} onSelect={select} />
              ))}
            </ul>
          )}
        </Panel>

        <Panel className={cn(!selected && 'hidden lg:flex')}>
          {selected ? (
            // key: a fresh form (new generated password, no previous result) for each request
            <RequestDetails key={selected.id} request={selected} onClose={() => select(null)} />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
              <KeyRound className="h-8 w-8 text-custom-text-muted" aria-hidden="true" />
              <p className="text-sm text-custom-text-secondary">Select a request to set a temporary password.</p>
            </div>
          )}
        </Panel>
      </div>
    </PageShell>
  )
}

export default PasswordResets
