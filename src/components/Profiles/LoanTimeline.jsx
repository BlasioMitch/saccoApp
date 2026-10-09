import React, { useMemo } from 'react'
import moment from 'moment'
import { MONTHS, formatAmount } from '../tables/MonthlyTimelineTable'
import { loanTimelines } from '../../utils/memberTimeline'
import { formatUGX } from '../../utils/currency'
import StatusBadge from '../ui/StatusBadge'
import { cn } from '../../lib/utils'

const CELL = {
  paid: 'border-green-600/30 bg-green-500/10 text-green-800 dark:text-green-300',
  missed: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400',
  upcoming: 'border-dashed border-custom-bg-tertiary text-custom-text-secondary',
  due: 'border-custom-bg-tertiary text-custom-text-muted',
  none: 'border-transparent text-custom-text-muted',
}

const CELL_LABEL = { missed: 'Missed', upcoming: 'Due', due: 'No payment' }

const Fact = ({ label, children }) => (
  <div className="min-w-0">
    <p className="truncate text-xs text-custom-text-secondary">{label}</p>
    <p className="truncate text-sm font-semibold tabular-nums text-custom-text-primary">{children}</p>
  </div>
)

const Legend = () => (
  <div className="flex flex-wrap items-center gap-4 text-xs text-custom-text-secondary">
    {[['paid', 'Paid'], ['missed', 'Missed'], ['upcoming', 'Due']].map(([state, label]) => (
      <span key={state} className="flex items-center gap-1">
        <span className={cn('h-3 w-3 rounded border', CELL[state])} />
        {label}
      </span>
    ))}
  </div>
)

const LoanRow = ({ item, year }) => {
  const { loan } = item
  return (
    <article className="border-b border-custom-bg-tertiary px-[var(--card-padding)] py-4 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-base font-semibold tabular-nums text-custom-text-primary">{formatUGX(loan.amount)}</h3>
          <StatusBadge status={loan.status} />
          {item.isApplication && <span className="text-xs text-custom-text-secondary">application</span>}
        </div>
        <span className="text-sm text-custom-text-secondary">
          {item.isApplication
            ? `Applied ${moment(loan.startDate).format('DD MMM YYYY')}`
            : `${moment(loan.startDate).format('DD MMM YYYY')} → ${moment(loan.endDate).format('DD MMM YYYY')}`}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 xl:grid-cols-6">
        <Fact label="Rate · term">{loan.interestRate}% · {loan.term} mo</Fact>
        <Fact label="Monthly">{formatUGX(loan.summary?.monthlyPayment)}</Fact>
        <Fact label="Total owed">{formatUGX(item.owed)}</Fact>
        <Fact label={`Paid before ${year}`}>{formatUGX(item.paidBefore)}</Fact>
        <Fact label={`Paid in ${year}`}>{formatUGX(item.paidInYear)}</Fact>
        <Fact label="Remaining">{formatUGX(item.remaining)}</Fact>
      </div>

      {!item.isApplication && (
        <>
          {/* Overall progress */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-custom-bg-tertiary/60">
              <div className="h-full rounded-full bg-green-600 dark:bg-green-400" style={{ width: `${item.progress * 100}%` }} />
            </div>
            <span className="w-24 shrink-0 text-right text-xs font-medium tabular-nums text-custom-text-secondary">
              {Math.round(item.progress * 100)}% repaid
            </span>
          </div>

          {/* The year's repayments, month by month */}
          <div className="mt-3 grid grid-cols-6 gap-1 lg:grid-cols-12">
            {item.months.map(month => (
              <div
                key={month.index}
                className={cn('flex h-12 flex-col items-center justify-center rounded-md border px-1 text-center', CELL[month.state])}
                title={`${MONTHS[month.index]} ${year}: ${month.paid ? formatUGX(month.paid) : CELL_LABEL[month.state] || 'Outside the loan term'}`}
              >
                <span className="text-[11px] font-medium uppercase leading-4">{MONTHS[month.index]}</span>
                <span className="w-full truncate text-xs font-semibold tabular-nums leading-4">
                  {month.paid ? formatAmount(month.paid) : CELL_LABEL[month.state] ? CELL_LABEL[month.state] : '·'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {loan.decisionNote && (
        <p className="mt-3 text-sm text-custom-text-secondary">
          <span className="font-medium text-custom-text-primary">Manager's note:</span> {loan.decisionNote}
        </p>
      )}
    </article>
  )
}

// Every loan that ran (or was applied for) in the selected year, with its monthly repayment record
const LoanTimeline = ({ loans, transactions, year }) => {
  const items = useMemo(() => loanTimelines(loans, transactions, year), [loans, transactions, year])

  if (!items.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-custom-text-secondary">
        No loans ran in {year}.
      </div>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex items-center justify-between gap-4 border-b border-custom-bg-tertiary px-[var(--card-padding)] py-2">
        <span className="text-xs text-custom-text-secondary">{items.length} loan{items.length === 1 ? '' : 's'} in {year} · amounts in UGX</span>
        <Legend />
      </div>
      {items.map(item => <LoanRow key={item.loan.id} item={item} year={year} />)}
    </div>
  )
}

export default LoanTimeline
