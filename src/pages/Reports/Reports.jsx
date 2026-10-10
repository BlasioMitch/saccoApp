import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import { toast } from 'sonner'
import { AlertTriangle, CheckCircle2, FileDown, FileSpreadsheet, Loader2, RefreshCw } from 'lucide-react'
import { CASH_BOOK, INCOME_STATEMENT, TRIAL_BALANCE, BALANCE_SHEET, LOAN_PORTFOLIO } from '../../graphql/queries/reports'
import { GRAPHQL_URI } from '../../graphql/client'
import { PageShell, Panel } from '../../components/layout/PageShell'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import { TableRowsSkeleton } from '../../components/ui/Skeleton'
import { downloadCsv, toCsv } from '../../utils/csv'
import { cn } from '../../lib/utils'
import { visibleError } from '../../offline/network'

const REPORTS = [
  { key: 'cash-book', label: 'Cash book', period: 'range' },
  { key: 'income-statement', label: 'Income statement', period: 'range' },
  { key: 'trial-balance', label: 'Trial balance', period: 'asAt' },
  { key: 'balance-sheet', label: 'Balance sheet', period: 'asAt' },
  { key: 'loan-portfolio', label: 'Loan portfolio & arrears', period: 'asAt' },
]

const today = () => moment().format('YYYY-MM-DD')
const PRESETS = [
  { label: 'This month', from: () => moment().startOf('month'), to: () => moment() },
  { label: 'Last month', from: () => moment().subtract(1, 'month').startOf('month'), to: () => moment().subtract(1, 'month').endOf('month') },
  { label: 'This year', from: () => moment().startOf('year'), to: () => moment() },
  { label: 'Last year', from: () => moment().subtract(1, 'year').startOf('year'), to: () => moment().subtract(1, 'year').endOf('year') },
]

const money = (value) => Math.round(Number(value) || 0).toLocaleString('en-US')
const day = (value) => moment(value).format('DD MMM YYYY')
const inputClass = 'h-10 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-3 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'

const KINDS = [
  { value: '', label: 'All movements' },
  { value: 'SAVINGS_DEPOSIT', label: 'Savings deposits' },
  { value: 'ACCOUNT_WITHDRAW', label: 'Withdrawals' },
  { value: 'CLOSURE_WITHDRAW', label: 'Closure payouts' },
  { value: 'LOAN_PAYMENT', label: 'Loan repayments' },
  { value: 'LOAN_DISBURSEMENT', label: 'Loan disbursements' },
]

const Th = ({ children, numeric, className }) => (
  <th className={cn('sticky top-0 z-10 h-10 whitespace-nowrap border-b border-custom-bg-tertiary bg-custom-bg-table px-4 text-xs font-semibold uppercase tracking-wide text-custom-text-secondary', numeric ? 'text-right' : 'text-left', className)}>
    {children}
  </th>
)
const Td = ({ children, numeric, strong, muted, className, ...props }) => (
  <td {...props} className={cn('h-10 whitespace-nowrap border-b border-custom-bg-tertiary px-4 text-sm', numeric && 'text-right tabular-nums', strong ? 'font-semibold text-custom-text-primary' : muted ? 'text-custom-text-muted' : 'text-custom-text-primary', className)}>
    {children}
  </td>
)

const Figure = ({ label, value, tone }) => (
  <div className="rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 py-3">
    <p className="text-xs text-custom-text-secondary">{label}</p>
    <p className={cn('text-lg font-semibold text-custom-text-primary', tone === 'bad' && 'text-red-600 dark:text-red-400')}>{value}</p>
  </div>
)

const Balanced = ({ ok, okText, badText }) => (
  <p className={cn('flex items-center gap-2 text-sm', ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
    {ok ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <AlertTriangle className="h-4 w-4" aria-hidden="true" />}
    {ok ? okText : badText}
  </p>
)

const Note = ({ children }) => <p className="text-xs text-custom-text-muted">{children}</p>

// ----- Each report: its on-screen layout and the rows its CSV export holds -----

const PAGE_SIZE = 200

const CashBookView = ({ data }) => {
  const [shown, setShown] = useState(PAGE_SIZE)
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Figure label="Opening balance" value={`UGX ${money(data.opening)}`} tone={data.opening < 0 ? 'bad' : null} />
        <Figure label="Money in" value={`UGX ${money(data.totalIn)}`} />
        <Figure label="Money out" value={`UGX ${money(data.totalOut)}`} />
        <Figure label="Closing balance" value={`UGX ${money(data.closing)}`} tone={data.closing < 0 ? 'bad' : null} />
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-custom-bg-tertiary">
        <table className="w-full">
          <thead><tr><Th>Date</Th><Th>Description</Th><Th>Member</Th><Th>Account</Th><Th numeric>In</Th><Th numeric>Out</Th><Th numeric>Balance</Th></tr></thead>
          <tbody>
            <tr><Td muted>{day(data.from)}</Td><Td strong>Opening balance</Td><Td /><Td /><Td /><Td /><Td numeric strong>{money(data.opening)}</Td></tr>
            {data.lines.slice(0, shown).map(line => (
              <tr key={`${line.kind}-${line.id}`} className="hover:bg-custom-interactive-hover">
                <Td muted>{moment(line.date).format('DD MMM YYYY HH:mm')}</Td>
                <Td>{line.description}</Td>
                <Td>{line.member || '–'}</Td>
                <Td muted>{line.accountNumber || '–'}</Td>
                <Td numeric>{line.inflow ? money(line.inflow) : ''}</Td>
                <Td numeric>{line.outflow ? money(line.outflow) : ''}</Td>
                <Td numeric>{money(line.balance)}</Td>
              </tr>
            ))}
            {data.lines.length === 0 && <tr><Td muted colSpan={7}>No cash movements in this period</Td></tr>}
          </tbody>
        </table>
        {data.lines.length > shown && (
          <div className="p-3 text-center">
            <Button variant="secondary" className="px-4" onClick={() => setShown(count => count + PAGE_SIZE)}>
              Show more ({(data.lines.length - shown).toLocaleString('en-US')} left)
            </Button>
          </div>
        )}
      </div>
      <Note>
        Membership fees are taken from members' savings and move no cash, so they are in the income statement, not here.
        Loan disbursements are dated on each loan's start date.
        {data.filtered && ' Filtered: the balance column still shows the whole cash position.'}
        {data.truncated && ' Only the first 10,000 lines are included; narrow the dates for the rest.'}
      </Note>
    </div>
  )
}
const cashBookCsv = (data) => data.lines.map(line => ({
  Date: moment(line.date).format('YYYY-MM-DD HH:mm'), Description: line.description, Member: line.member ?? '', Account: line.accountNumber ?? '',
  In: line.inflow || '', Out: line.outflow || '', Balance: line.balance,
}))

const StatementTable = ({ sections, footer }) => (
  <table className="w-full max-w-3xl">
    <tbody>
      {sections.map(section => (
        <React.Fragment key={section.title}>
          <tr><td colSpan={2} className="pb-1 pt-4 text-sm font-semibold text-custom-brand-green">{section.title}</td></tr>
          {section.lines.map(line => (
            <tr key={line.code ?? line.name}>
              <Td><span className="mr-3 text-custom-text-muted">{line.code}</span>{line.name}</Td>
              <Td numeric>{line.amount === null ? '–' : money(line.amount)}</Td>
            </tr>
          ))}
          {section.total && (
            <tr><Td strong>{section.total.label}</Td><Td numeric strong>{money(section.total.amount)}</Td></tr>
          )}
        </React.Fragment>
      ))}
      {footer && <tr><Td strong className="border-b-2">{footer.label}</Td><Td numeric strong className="border-b-2">{money(footer.amount)}</Td></tr>}
    </tbody>
  </table>
)

const IncomeStatementView = ({ data }) => (
  <div className="min-h-0 flex-1 space-y-6 overflow-auto">
    <StatementTable
      sections={[
        { title: 'Income', lines: data.income, total: { label: 'Total income', amount: data.totals.income } },
        { title: 'Expenses', lines: [{ code: '', name: 'Operating expenses (not recorded in the system yet)', amount: null }] },
      ]}
      footer={{ label: 'Surplus for the period', amount: data.totals.surplus }}
    />
    <div className="max-w-3xl overflow-auto rounded-lg border border-custom-bg-tertiary">
      <table className="w-full">
        <thead><tr><Th>Month</Th><Th numeric>Membership fees</Th><Th numeric>Loan interest</Th><Th numeric>Total</Th></tr></thead>
        <tbody>
          {data.months.map(month => (
            <tr key={month.month}>
              <Td>{moment(`${month.month}-01`).format('MMMM YYYY')}</Td>
              <Td numeric>{money(month.feeIncome)}</Td><Td numeric>{money(month.interestIncome)}</Td><Td numeric strong>{money(month.total)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Note>Interest income is the interest part of each repayment, in the loan's own proportion of interest to total owed. Running costs are not recorded in the system, so the surplus is before expenses.</Note>
  </div>
)
const incomeCsv = (data) => data.months.map(month => ({ Month: month.month, 'Membership fees': month.feeIncome, 'Loan interest': month.interestIncome, Total: month.total }))

const TrialBalanceView = ({ data }) => (
  <div className="min-h-0 flex-1 space-y-4 overflow-auto">
    <div className="max-w-3xl overflow-auto rounded-lg border border-custom-bg-tertiary">
      <table className="w-full">
        <thead><tr><Th>Code</Th><Th>Account</Th><Th>Type</Th><Th numeric>Debit</Th><Th numeric>Credit</Th></tr></thead>
        <tbody>
          {data.rows.map(row => (
            <tr key={row.code}>
              <Td muted>{row.code}</Td><Td>{row.name}</Td><Td muted className="capitalize">{row.type.toLowerCase()}</Td>
              <Td numeric>{row.debit ? money(row.debit) : ''}</Td><Td numeric>{row.credit ? money(row.credit) : ''}</Td>
            </tr>
          ))}
          <tr><Td /><Td strong>Totals</Td><Td /><Td numeric strong>{money(data.totals.debit)}</Td><Td numeric strong>{money(data.totals.credit)}</Td></tr>
        </tbody>
      </table>
    </div>
    <Balanced ok={data.balanced} okText="Debits equal credits." badText="Debits and credits differ: check recent edits to transactions." />
  </div>
)
const trialBalanceCsv = (data) => [
  ...data.rows.map(row => ({ Code: row.code, Account: row.name, Type: row.type, Debit: row.debit || '', Credit: row.credit || '' })),
  { Code: '', Account: 'Totals', Type: '', Debit: data.totals.debit, Credit: data.totals.credit },
]

const BalanceSheetView = ({ data }) => (
  <div className="min-h-0 flex-1 space-y-4 overflow-auto">
    <StatementTable
      sections={[
        { title: 'Assets', lines: data.assets, total: { label: 'Total assets', amount: data.totals.assets } },
        { title: 'Liabilities', lines: data.liabilities, total: { label: 'Total liabilities', amount: data.totals.liabilities } },
        { title: 'Equity', lines: data.equity, total: { label: 'Total equity', amount: data.totals.equity } },
      ]}
      footer={{ label: 'Liabilities and equity', amount: data.totals.liabilities + data.totals.equity }}
    />
    <Balanced ok={data.balanced} okText="Assets equal liabilities plus equity." badText="The balance sheet does not balance." />
    {data.savingsCheck && (
      <Balanced
        ok={data.savingsCheck.difference === 0}
        okText={`Member savings agree with the account balances (UGX ${money(data.savingsCheck.accounts)}).`}
        badText={`Member savings in the ledger (UGX ${money(data.savingsCheck.ledger)}) differ from the account balances (UGX ${money(data.savingsCheck.accounts)}) by UGX ${money(data.savingsCheck.difference)}: pending or failed transactions may have changed balances.`}
      />
    )}
  </div>
)
const balanceSheetCsv = (data) => [
  ...data.assets.map(line => ({ Section: 'Assets', Code: line.code, Account: line.name, Amount: line.amount })),
  { Section: 'Assets', Code: '', Account: 'Total assets', Amount: data.totals.assets },
  ...data.liabilities.map(line => ({ Section: 'Liabilities', Code: line.code, Account: line.name, Amount: line.amount })),
  ...data.equity.map(line => ({ Section: 'Equity', Code: line.code, Account: line.name, Amount: line.amount })),
  { Section: '', Code: '', Account: 'Liabilities and equity', Amount: data.totals.liabilities + data.totals.equity },
]

const LoanPortfolioView = ({ data }) => {
  const [onlyLate, setOnlyLate] = useState(false)
  const loans = onlyLate ? data.loans.filter(loan => loan.arrears > 0) : data.loans
  const { summary } = data
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Figure label={`Disbursed (${summary.loans} loans)`} value={`UGX ${money(summary.disbursed)}`} />
        <Figure label={`Outstanding (${summary.openLoans} open)`} value={`UGX ${money(summary.outstanding)}`} />
        <Figure label={`In arrears (${summary.loansInArrears} loans)`} value={`UGX ${money(summary.arrears)}`} tone={summary.arrears ? 'bad' : null} />
        <Figure label="Portfolio at risk (over 30 days)" value={`${(summary.portfolioAtRisk30 * 100).toFixed(1)}%`} tone={summary.portfolioAtRisk30 > 0.1 ? 'bad' : null} />
      </div>
      <div className="flex flex-wrap gap-2">
        {data.aging.map(bucket => (
          <span key={bucket.key} className="rounded-full border border-custom-bg-tertiary px-3 py-1 text-xs text-custom-text-secondary">
            <strong className="text-custom-text-primary">{bucket.label}</strong> · {bucket.count} loans · UGX {money(bucket.outstanding)}
          </span>
        ))}
        <label className="ml-auto inline-flex items-center gap-2 text-sm text-custom-text-secondary">
          <input type="checkbox" checked={onlyLate} onChange={(e) => setOnlyLate(e.target.checked)} className="h-4 w-4 accent-[var(--custom-brand-green)]" />
          Only loans in arrears
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-custom-bg-tertiary">
        <table className="w-full">
          <thead><tr>
            <Th>Member</Th><Th>Account</Th><Th>Start</Th><Th numeric>Principal</Th><Th numeric>Rate</Th><Th numeric>Monthly</Th>
            <Th numeric>Paid</Th><Th numeric>Outstanding</Th><Th numeric>Arrears</Th><Th numeric>Days late</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id} className="hover:bg-custom-interactive-hover">
                <Td strong>{loan.member || '–'}</Td><Td muted>{loan.accountNumber}</Td><Td muted>{day(loan.startDate)}</Td>
                <Td numeric>{money(loan.principal)}</Td><Td numeric>{loan.interestRate}%</Td><Td numeric>{money(loan.monthlyPayment)}</Td>
                <Td numeric>{money(loan.paid)}</Td><Td numeric strong>{money(loan.outstanding)}</Td>
                <Td numeric className={loan.arrears ? 'text-red-600 dark:text-red-400' : ''}>{loan.arrears ? money(loan.arrears) : ''}</Td>
                <Td numeric>{loan.daysOverdue || ''}</Td>
                <Td><StatusBadge status={loan.status} /></Td>
              </tr>
            ))}
            {loans.length === 0 && <tr><Td muted colSpan={11}>No loans to show</Td></tr>}
          </tbody>
        </table>
      </div>
      <Note>Arrears are the instalments due by the report date (one a month from each loan's start) less the repayments made by then.</Note>
    </div>
  )
}
const portfolioCsv = (data) => data.loans.map(loan => ({
  Member: loan.member ?? '', Account: loan.accountNumber ?? '', Start: loan.startDate.slice(0, 10), Principal: loan.principal, 'Interest rate %': loan.interestRate,
  'Term (months)': loan.term, 'Monthly payment': loan.monthlyPayment, Paid: loan.paid, Outstanding: loan.outstanding, Arrears: loan.arrears,
  'Days overdue': loan.daysOverdue, Status: loan.status,
}))

const VIEWS = {
  'cash-book': { query: CASH_BOOK, field: 'cashBook', View: CashBookView, csv: cashBookCsv },
  'income-statement': { query: INCOME_STATEMENT, field: 'incomeStatement', View: IncomeStatementView, csv: incomeCsv },
  'trial-balance': { query: TRIAL_BALANCE, field: 'trialBalance', View: TrialBalanceView, csv: trialBalanceCsv },
  'balance-sheet': { query: BALANCE_SHEET, field: 'balanceSheet', View: BalanceSheetView, csv: balanceSheetCsv },
  'loan-portfolio': { query: LOAN_PORTFOLIO, field: 'loanPortfolio', View: LoanPortfolioView, csv: portfolioCsv },
}

// PDFs come from the gateway with the session cookie, so the download keeps the server's file name
async function downloadPdf(type, params) {
  const url = new URL(`/export/reports/${type}.pdf`, GRAPHQL_URI)
  Object.entries(params).forEach(([key, value]) => value && url.searchParams.set(key, value))
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'Could not create the PDF')
  }
  const name = /filename="([^"]+)"/.exec(response.headers.get('content-disposition') || '')?.[1] || `${type}.pdf`
  const link = document.createElement('a')
  link.href = URL.createObjectURL(await response.blob())
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

// Bookkeeping reports for staff, built from the ledger the system keeps behind every transaction and loan
const Reports = () => {
  const [type, setType] = useState('cash-book')
  const [from, setFrom] = useState(() => moment().startOf('month').format('YYYY-MM-DD'))
  const [to, setTo] = useState(today)
  const [asAt, setAsAt] = useState(today)
  const [kind, setKind] = useState('')
  const [exporting, setExporting] = useState(false)

  const report = REPORTS.find(entry => entry.key === type)
  const { query, field, View, csv } = VIEWS[type]
  const variables = useMemo(() => (
    report.period === 'range' ? { from, to, ...(type === 'cash-book' && kind && { kind }) } : { asAt }
  ), [report.period, from, to, asAt, kind, type])
  const invalid = report.period === 'range' ? !from || !to || from > to : !asAt

  const { data, previousData, loading, error, refetch } = useQuery(query, { variables, skip: invalid, fetchPolicy: 'cache-and-network' })
  const result = (data ?? previousData)?.[field]
  const periodName = report.period === 'range' ? `${from}_${to}` : asAt

  const exportCsv = () => {
    const rows = csv(result)
    if (!rows.length) return toast.error('Nothing to export')
    downloadCsv(`${type}_${periodName}.csv`, toCsv(rows, Object.keys(rows[0]).map(key => ({ key }))))
  }

  const exportPdf = async () => {
    setExporting(true)
    try {
      await downloadPdf(type, variables)
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <PageShell>
      <Panel>
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-custom-bg-tertiary px-3 py-2" role="tablist" aria-label="Report">
          {REPORTS.map(entry => (
            <button
              key={entry.key}
              role="tab"
              aria-selected={type === entry.key}
              onClick={() => setType(entry.key)}
              className={cn(
                'h-8 rounded-md px-3 text-sm font-medium transition-colors',
                type === entry.key ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text' : 'text-custom-text-secondary hover:bg-custom-interactive-hover'
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {/* One filter row scopes the report, its CSV and its PDF */}
        <div className="flex shrink-0 flex-wrap items-end gap-3 border-b border-custom-bg-tertiary px-3 py-3">
          {report.period === 'range' ? (
            <>
              <label className="text-xs text-custom-text-secondary">From
                <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={cn(inputClass, 'mt-1 block')} />
              </label>
              <label className="text-xs text-custom-text-secondary">To
                <input type="date" value={to} min={from} max={today()} onChange={(e) => setTo(e.target.value)} className={cn(inputClass, 'mt-1 block')} />
              </label>
              <div className="flex flex-wrap gap-1">
                {PRESETS.map(preset => (
                  <Button key={preset.label} size="sm" variant="ghost" className="px-2" onClick={() => { setFrom(preset.from().format('YYYY-MM-DD')); setTo(preset.to().format('YYYY-MM-DD')) }}>
                    {preset.label}
                  </Button>
                ))}
              </div>
              {type === 'cash-book' && (
                <label className="text-xs text-custom-text-secondary">Show
                  <select value={kind} onChange={(e) => setKind(e.target.value)} className={cn(inputClass, 'mt-1 block')}>
                    {KINDS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
              )}
            </>
          ) : (
            <>
              <label className="text-xs text-custom-text-secondary">As at
                <input type="date" value={asAt} max={today()} onChange={(e) => setAsAt(e.target.value)} className={cn(inputClass, 'mt-1 block')} />
              </label>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="px-2" onClick={() => setAsAt(today())}>Today</Button>
                <Button size="sm" variant="ghost" className="px-2" onClick={() => setAsAt(moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'))}>End of last month</Button>
                <Button size="sm" variant="ghost" className="px-2" onClick={() => setAsAt(moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'))}>End of last year</Button>
              </div>
            </>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => refetch()} aria-label="Refresh" title="Refresh" disabled={invalid}>
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
            <Button variant="secondary" className="px-3" onClick={exportCsv} disabled={!result || invalid}>
              <FileSpreadsheet className="h-4 w-4" /> CSV
            </Button>
            <Button variant="secondary" className="px-3" onClick={exportPdf} disabled={!result || invalid || exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} PDF
            </Button>
          </div>
        </div>

        <div className={cn('flex min-h-0 flex-1 flex-col gap-3 p-4 transition-opacity', loading && result && 'opacity-60')}>
          <div className="shrink-0">
            <h2 className="text-lg font-semibold text-custom-text-primary">{report.label}</h2>
            <p className="text-sm text-custom-text-secondary">
              {report.period === 'range' ? `${day(from)} to ${day(to)}` : `As at ${day(asAt)}`} · amounts in UGX
            </p>
          </div>
          {invalid && <p className="text-sm text-red-600">Choose a valid period.</p>}
          {visibleError(error) && <p className="text-sm text-red-600">{error.message}</p>}
          {!result && loading && <TableRowsSkeleton rows={8} columns={6} />}
          {result && !invalid && <View data={result} />}
        </div>
      </Panel>
    </PageShell>
  )
}

export default Reports
