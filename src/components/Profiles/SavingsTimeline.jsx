import React, { useMemo } from 'react'
import moment from 'moment'
import { MONTHS, formatAmount } from '../tables/MonthlyTimelineTable'
import { savingsTimeline, currentYear } from '../../utils/memberTimeline'
import { formatUGX } from '../../utils/currency'
import { cn } from '../../lib/utils'

// Same month-box language as the loan timeline: green = money in, red = money out, dashed = still to come
const CELL = {
  saved: 'border-green-600/30 bg-green-500/10 text-green-800 dark:text-green-300',
  out: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400',
  quiet: 'border-custom-bg-tertiary text-custom-text-muted',
  upcoming: 'border-dashed border-custom-bg-tertiary text-custom-text-secondary',
}

const Fact = ({ label, children, tone }) => (
  <div className="min-w-0">
    <p className="truncate text-xs text-custom-text-secondary">{label}</p>
    <p className={cn('truncate text-sm font-semibold tabular-nums text-custom-text-primary', tone)}>{children}</p>
  </div>
)

const Legend = () => (
  <div className="flex flex-wrap items-center gap-4 text-xs text-custom-text-secondary">
    {[['saved', 'Deposits'], ['out', 'Withdrawals & fees'], ['upcoming', 'Still to come']].map(([state, label]) => (
      <span key={state} className="flex items-center gap-1">
        <span className={cn('h-3 w-3 rounded border', CELL[state])} />
        {label}
      </span>
    ))}
  </div>
)

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

// The member's savings for the selected year, month by month
const SavingsTimeline = ({ transactions, year }) => {
  const timeline = useMemo(() => savingsTimeline(transactions, year), [transactions, year])
  const thisYear = currentYear()
  const thisMonth = year === thisYear ? moment().utcOffset(180).month() : -1
  const isFuture = (index) => year > thisYear || (year === thisYear && index > thisMonth)
  const activeMonths = timeline.months.filter(month => month.deposits > 0).length
  const elapsedMonths = year < thisYear ? 12 : year === thisYear ? thisMonth + 1 : 0
  const growth = timeline.closingBalance - timeline.broughtForward

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex items-center justify-between gap-4 border-b border-custom-bg-tertiary px-[var(--card-padding)] py-2">
        <span className="text-xs text-custom-text-secondary">Savings in {year} · completed transactions · amounts in UGX</span>
        <Legend />
      </div>

      <article className="px-[var(--card-padding)] py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <h3 className="truncate text-base font-semibold tabular-nums text-custom-text-primary">{formatUGX(timeline.closingBalance)}</h3>
            <span className="text-sm text-custom-text-secondary">{year === thisYear ? 'balance so far' : `closing balance ${year}`}</span>
          </div>
          <span className={cn('text-sm font-medium tabular-nums', growth >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
            {growth >= 0 ? '+' : '−'}{formatUGX(Math.abs(growth))} this year
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 xl:grid-cols-6">
          <Fact label={`Brought forward from ${year - 1}`}>{formatUGX(timeline.broughtForward)}</Fact>
          <Fact label="Deposited" tone="text-green-700 dark:text-green-400">{formatUGX(timeline.deposits)}</Fact>
          <Fact label="Withdrawn & fees" tone={timeline.withdrawals ? 'text-red-600 dark:text-red-400' : undefined}>{formatUGX(timeline.withdrawals)}</Fact>
          <Fact label="Number of deposits">{plural(timeline.depositCount, 'deposit')}</Fact>
          <Fact label="Months saved">{elapsedMonths ? `${activeMonths} of ${elapsedMonths}` : '–'}</Fact>
          <Fact label="Best month">{timeline.peakDeposit ? formatUGX(timeline.peakDeposit) : '–'}</Fact>
        </div>

        {/* Months with a deposit, out of the months elapsed */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-custom-bg-tertiary/60">
            <div
              className="h-full rounded-full bg-green-600 dark:bg-green-400"
              style={{ width: `${elapsedMonths ? (activeMonths / elapsedMonths) * 100 : 0}%` }}
            />
          </div>
          <span className="w-32 shrink-0 text-right text-xs font-medium tabular-nums text-custom-text-secondary">
            {elapsedMonths ? `${Math.round((activeMonths / elapsedMonths) * 100)}% of months saved` : 'Not started'}
          </span>
        </div>

        {/* The year month by month: deposits, money out, and the balance at month end */}
        <div className="mt-3 grid grid-cols-6 gap-1 lg:grid-cols-12">
          {timeline.months.map(month => {
            const future = isFuture(month.index)
            const state = future ? 'upcoming' : month.deposits ? 'saved' : month.withdrawals ? 'out' : 'quiet'
            return (
              <div
                key={month.index}
                className={cn(
                  'flex h-16 flex-col items-center justify-center rounded-md border px-1 text-center',
                  CELL[state],
                  month.index === thisMonth && 'ring-2 ring-custom-brand-primary/40'
                )}
                title={[
                  `${MONTHS[month.index]} ${year}`,
                  `Deposits ${formatUGX(month.deposits)}`,
                  month.withdrawals ? `Withdrawn & fees ${formatUGX(month.withdrawals)}` : null,
                  future ? null : `Balance ${formatUGX(month.balance)}`,
                ].filter(Boolean).join(' · ')}
              >
                <span className="text-[11px] font-medium uppercase leading-4">{MONTHS[month.index]}</span>
                <span className="w-full truncate text-xs font-semibold tabular-nums leading-4">
                  {month.deposits ? `+${formatAmount(month.deposits)}` : future ? '' : '·'}
                </span>
                {month.withdrawals > 0 && (
                  <span className="w-full truncate text-[11px] font-medium tabular-nums leading-4 text-red-700 dark:text-red-400">
                    −{formatAmount(month.withdrawals)}
                  </span>
                )}
                {!future && !month.withdrawals && (
                  <span className="w-full truncate text-[11px] tabular-nums leading-4 opacity-70">{formatAmount(month.balance)}</span>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-custom-text-secondary">
          Each box shows the month's deposits, any withdrawals or fees, and otherwise the balance at month end. Hover for details.
        </p>
      </article>
    </div>
  )
}

export default SavingsTimeline
