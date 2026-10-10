import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Check, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { GET_LOAN_APPLICATIONS } from '../../graphql/queries'
import { APPROVE_LOAN, REJECT_LOAN } from '../../graphql/mutations'
import { fetchLoans } from '../../reducers/loansReducer'
import { fetchAccounts } from '../../reducers/accountsReducer'
import { PageShell, Panel } from '../../components/layout/PageShell'
import { TableToolbar, ColumnMenu, DataTable, TableEmpty, TablePagination, SortableHeader } from '../../components/tables/TableShell'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import { formatUGX } from '../../utils/currency'
import { ownerName } from '../../utils/names'
import { DATE_FORMAT, addMonths, summarize } from '../../utils/loanTerms'
import { cn } from '../../lib/utils'
import OwnerCell from '../../components/ui/OwnerCell'

const TABS = [
  { key: 'PENDING', label: 'Pending', empty: 'No applications waiting', hint: 'Loan applications made from the member app appear here.' },
  { key: 'APPROVED', label: 'Approved', empty: 'No approved applications', hint: 'Applications you approve become loans and are listed here.' },
  { key: 'REJECTED', label: 'Rejected', empty: 'No rejected applications' },
  { key: 'ALL', label: 'All', empty: 'No applications yet', hint: 'Loan applications made from the member app appear here.' },
]

// Stable empty list: a new [] on every render while loading makes the table reset its paging,
// which re-renders the page in an endless loop (the page froze when switching tabs)
const NO_APPLICATIONS = []

const inputClass = 'h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'
const labelClass = 'mb-2 block text-sm font-medium text-custom-text-primary'

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
    <div className="max-h-full w-full max-w-md overflow-y-auto rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold leading-6 text-custom-text-primary">{title}</h2>
        <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
)

const Summary = ({ application }) => (
  <dl className="mb-4 grid grid-cols-[96px_1fr] gap-x-4 gap-y-2 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary p-4 text-sm">
    <dt className="text-custom-text-secondary">Member</dt>
    <dd className="font-medium text-custom-text-primary">{ownerName(application.account?.owner)}</dd>
    <dt className="text-custom-text-secondary">Requested</dt>
    <dd className="font-semibold tabular-nums text-custom-text-primary">{formatUGX(application.amount)} over {application.term} months</dd>
    {application.purpose && (
      <>
        <dt className="text-custom-text-secondary">Purpose</dt>
        <dd className="text-custom-text-primary">{application.purpose}</dd>
      </>
    )}
  </dl>
)

const ApproveDialog = ({ application, onClose, onDone }) => {
  const [interestRate, setInterestRate] = useState(String(application.interestRate ?? ''))
  // Starts from the member's proposed date (today if that has already passed)
  const [startDate, setStartDate] = useState(() => {
    const proposed = application.startDate ? moment(application.startDate) : null
    return proposed && proposed.isSameOrAfter(moment(), 'day') ? proposed.format(DATE_FORMAT) : moment().format(DATE_FORMAT)
  })
  const [note, setNote] = useState('')
  const [approve, { loading }] = useMutation(APPROVE_LOAN)

  const rate = Number(interestRate)
  const rateValid = rate > 0 && rate <= 100
  const preview = summarize(Number(application.amount), rateValid ? rate : 0, application.term)

  const submit = async (e) => {
    e.preventDefault()
    if (!rateValid || !startDate) return
    try {
      await approve({ variables: { id: application.id, interestRate: rate, startDate, note: note.trim() || null } })
      toast.success(`Loan approved for ${ownerName(application.account?.owner)}`)
      onDone()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Modal title="Approve loan" onClose={onClose}>
      <Summary application={application} />
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Interest rate (%)</label>
            <input type="number" step="0.01" min="0" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className={inputClass} />
            {!rateValid && <p className="mt-1 text-xs text-red-600 dark:text-red-400">Between 0 and 100</p>}
          </div>
          <div>
            <label className={labelClass}>Start date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary p-4 text-sm">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-custom-text-secondary">Monthly</p>
              <p className="font-semibold tabular-nums text-custom-brand-primary">{formatUGX(preview.monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-custom-text-secondary">Interest</p>
              <p className="font-semibold tabular-nums text-custom-text-primary">{formatUGX(preview.totalInterest)}</p>
            </div>
            <div>
              <p className="text-custom-text-secondary">Total due</p>
              <p className="font-semibold tabular-nums text-custom-text-primary">{formatUGX(preview.totalDue)}</p>
            </div>
          </div>
          {startDate && <p className="mt-2 text-xs text-custom-text-secondary">Ends {moment(addMonths(startDate, application.term)).format('DD MMM YYYY')}</p>}
        </div>
        <div>
          <label className={labelClass}>Note (optional)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} placeholder="Internal note" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading || !rateValid || !startDate}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Approve
          </Button>
        </div>
      </form>
    </Modal>
  )
}

const RejectDialog = ({ application, onClose, onDone }) => {
  const [reason, setReason] = useState('')
  const [reject, { loading }] = useMutation(REJECT_LOAN)

  const submit = async (e) => {
    e.preventDefault()
    if (!reason.trim()) return
    try {
      await reject({ variables: { id: application.id, reason: reason.trim() } })
      toast.success('Application rejected')
      onDone()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Modal title="Reject application" onClose={onClose}>
      <Summary application={application} />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelClass}>Reason (shown to the member)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 py-2 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
            placeholder="e.g. Savings history is too short; please apply again after 3 months"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" type="submit" disabled={loading || !reason.trim()}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Reject
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Staff review of member loan applications made from the phone app
const LoanApplications = () => {
  const dispatch = useDispatch()
  const [tab, setTab] = useState('PENDING')
  const [filtering, setFiltering] = useState('')
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [approving, setApproving] = useState(null)
  const [rejecting, setRejecting] = useState(null)

  const { data, previousData, loading, error, refetch } = useQuery(GET_LOAN_APPLICATIONS, {
    variables: { view: tab },
    fetchPolicy: 'cache-and-network',
  })
  // Keep showing the last list while another tab loads
  const applications = (data ?? previousData)?.getLoanApplications ?? NO_APPLICATIONS
  const current = TABS.find(option => option.key === tab)

  const decided = () => {
    setApproving(null)
    setRejecting(null)
    refetch()
    // The loan book, accounts and sidebar count change with each decision
    dispatch(fetchLoans())
    dispatch(fetchAccounts())
  }

  const columns = useMemo(() => [
    {
      id: 'member',
      meta: { label: 'Member', emphasis: 'primary', sticky: 'left' },
      enableHiding: false,
      header: ({ column }) => <SortableHeader column={column} label="Member" />,
      accessorFn: (row) => ownerName(row.account?.owner),
      cell: ({ row, getValue }) => <OwnerCell owner={row.original.account?.owner} name={getValue()} />,
    },
    { id: 'accountNumber', header: 'Account', accessorFn: (row) => row.account?.accountNumber },
    {
      accessorKey: 'amount',
      meta: { label: 'Amount', emphasis: 'amount' },
      header: ({ column }) => <SortableHeader column={column} label="Amount" />,
      cell: ({ getValue }) => formatUGX(getValue()),
    },
    { accessorKey: 'term', header: 'Months', meta: { align: 'right' } },
    {
      accessorKey: 'purpose',
      header: 'Purpose',
      cell: ({ getValue }) => <span className="block max-w-xs truncate" title={getValue() || ''}>{getValue() || '–'}</span>,
    },
    {
      accessorKey: 'startDate',
      meta: { label: 'Proposed start' },
      header: ({ column }) => <SortableHeader column={column} label="Proposed start" />,
      cell: ({ getValue }) => getValue() ? moment(getValue()).format('DD MMM YYYY') : '–',
    },
    {
      accessorKey: 'createdAt',
      meta: { label: 'Applied' },
      header: ({ column }) => <SortableHeader column={column} label="Applied" />,
      cell: ({ getValue }) => getValue() ? moment(getValue()).format('DD MMM YYYY') : '–',
    },
    {
      id: 'standing',
      header: 'Account standing',
      accessorFn: (row) => Number(row.account?.balance || 0),
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <span className="tabular-nums">{formatUGX(row.original.account?.balance)}</span>
          {!row.original.account?.paidMembership && <StatusBadge status="Unpaid fee" className="bg-red-500/10 text-red-700 dark:text-red-400" />}
          {row.original.account?.hasLoan && <StatusBadge status="Open loan" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" />}
        </span>
      ),
    },
    ...(tab === 'PENDING'
      ? [{
          id: 'actions',
          header: '',
          enableHiding: false,
          meta: { align: 'right' },
          cell: ({ row }) => (
            <span className="inline-flex gap-2">
              <Button size="sm" onClick={() => setApproving(row.original)}>
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setRejecting(row.original)}>Reject</Button>
            </span>
          ),
        }]
      : [
          ...(tab === 'REJECTED' ? [] : [{
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => <StatusBadge status={getValue()} />,
          }]),
          ...(tab === 'APPROVED' ? [{
            id: 'remaining',
            meta: { label: 'Remaining', emphasis: 'amount' },
            header: 'Remaining',
            accessorFn: (row) => Number(row.summary?.remainingBalance ?? 0),
            cell: ({ getValue }) => formatUGX(getValue()),
          }] : []),
          {
            accessorKey: 'decidedAt',
            header: 'Decided',
            cell: ({ getValue }) => getValue() ? moment(getValue()).format('DD MMM YYYY') : '–',
          },
          {
            accessorKey: 'decisionNote',
            header: tab === 'REJECTED' ? 'Reason' : 'Note',
            cell: ({ getValue }) => <span className="block max-w-sm truncate" title={getValue() || ''}>{getValue() || '–'}</span>,
          },
        ]),
  ], [tab])

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter: filtering, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnVisibilityChange: setColumnVisibility,
  })

  return (
    <PageShell>
      <Panel>
        <TableToolbar search={filtering} onSearch={setFiltering} placeholder="Search members or purpose...">
          <div className="flex rounded-lg border border-custom-bg-tertiary p-1" role="tablist">
            {TABS.map(option => (
              <button
                key={option.key}
                role="tab"
                aria-selected={tab === option.key}
                onClick={() => {
                  setTab(option.key)
                  table.setPageIndex(0)
                }}
                className={cn(
                  'h-8 rounded-md px-4 text-sm font-medium transition-colors',
                  tab === option.key ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text' : 'text-custom-text-secondary hover:bg-custom-interactive-hover'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <ColumnMenu table={table} />
        </TableToolbar>

        {loading && !data && !previousData ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-custom-brand-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-red-600 dark:text-red-400">{error.message}</div>
        ) : (
          <DataTable
            table={table}
            empty={
              <TableEmpty title={current.empty} description={current.hint} />
            }
          />
        )}
        <TablePagination table={table} />
      </Panel>

      {approving && <ApproveDialog application={approving} onClose={() => setApproving(null)} onDone={decided} />}
      {rejecting && <RejectDialog application={rejecting} onClose={() => setRejecting(null)} onDone={decided} />}
    </PageShell>
  )
}

export default LoanApplications
