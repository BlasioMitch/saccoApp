import React, { useState } from 'react'
import { BarChart3, Table2 } from 'lucide-react'
import { cn } from '../../lib/utils'

// Shared chart chrome for the dashboard: recessive hairline grid and axes, muted tick text,
// compact money ticks, a values-first tooltip, a legend that toggles series, and a table view twin.

export const SERIES = {
  deposits: { label: 'Deposits', color: 'var(--chart-deposits)' },
  withdrawals: { label: 'Withdrawals', color: 'var(--chart-withdrawals)' },
  repayments: { label: 'Repaid', color: 'var(--chart-repayments)' },
  disbursed: { label: 'Disbursed', color: 'var(--chart-disbursed)' },
  feeIncome: { label: 'Membership fees', color: 'var(--chart-fees)' },
  interestIncome: { label: 'Loan interest', color: 'var(--chart-interest)' },
  savingsBalance: { label: 'Member savings', color: 'var(--chart-deposits)' },
  loanBook: { label: 'Loan book', color: 'var(--chart-disbursed)' },
}

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
export const formatCompact = (value) => compact.format(Number(value) || 0)
export const formatMoney = (value) => `UGX ${whole.format(Math.round(Number(value) || 0))}`
export const formatMoneyCompact = (value) => `UGX ${compact.format(Number(value) || 0)}`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// Bucket start (YYYY-MM-DD) as a short axis label for its grain
export const periodLabel = (period, grain, { long = false } = {}) => {
  const [year, month, day] = String(period).split('-').map(Number)
  if (grain === 'week') return long ? `Week of ${day} ${MONTHS[month - 1]} ${year}` : `${day} ${MONTHS[month - 1]}`
  if (grain === 'quarter') return `Q${Math.floor((month - 1) / 3) + 1} ${long ? year : String(year).slice(2)}`
  return long ? `${MONTHS[month - 1]} ${year}` : `${MONTHS[month - 1]} ${String(year).slice(2)}`
}

export const axisProps = {
  tick: { fill: 'var(--custom-text-muted)', fontSize: 11 },
  tickLine: false,
  axisLine: { stroke: 'var(--chart-axis)' },
}
export const yAxisProps = {
  ...axisProps,
  axisLine: false,
  width: 48,
  tickFormatter: formatCompact,
}
export const gridProps = { vertical: false, stroke: 'var(--chart-grid)', strokeDasharray: undefined }
// Columns: at most 24px, 4px rounded top, a 2px gap between neighbours
export const barProps = { maxBarSize: 24, radius: [4, 4, 0, 0] }

// Values lead, series names follow, each keyed by a short stroke of its colour
export const ChartTooltip = ({ active, payload, label, grain, format = formatMoney }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-44 rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-custom-text-secondary">{grain ? periodLabel(label, grain, { long: true }) : label}</p>
      <ul className="space-y-1">
        {payload.map(entry => (
          <li key={entry.dataKey} className="flex items-center gap-2">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: entry.color }} aria-hidden="true" />
            <span className="font-semibold tabular-nums text-custom-text-primary">{format(entry.value)}</span>
            <span className="text-custom-text-secondary">{SERIES[entry.dataKey]?.label ?? entry.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Clicking a legend entry hides or shows that series (identity never depends on colour alone: it has a label)
export const useHiddenSeries = () => {
  const [hidden, setHidden] = useState(() => new Set())
  const toggle = (key) => setHidden(previous => {
    const next = new Set(previous)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })
  return [hidden, toggle]
}

export const ChartLegend = ({ keys, hidden, onToggle, shape = 'rect' }) => (
  <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
    {keys.map(key => {
      const off = hidden?.has(key)
      return (
        <li key={key}>
          <button
            type="button"
            onClick={() => onToggle?.(key)}
            aria-pressed={!off}
            className={cn('inline-flex items-center gap-2 rounded px-1 text-xs text-custom-text-secondary transition-opacity hover:text-custom-text-primary', off && 'opacity-40 line-through')}
          >
            <span
              className={shape === 'line' ? 'h-0.5 w-4 rounded-full' : 'h-2.5 w-2.5 rounded-sm'}
              style={{ background: SERIES[key]?.color }}
              aria-hidden="true"
            />
            {SERIES[key]?.label ?? key}
          </button>
        </li>
      )
    })}
  </ul>
)

// A card with a title, an optional headline value, the chart, and a table view of the same numbers
export const ChartCard = ({ title, subtitle, headline, legend, table, height = 240, className, children }) => {
  const [asTable, setAsTable] = useState(false)
  return (
    <section className={cn('flex min-w-0 flex-col rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-[var(--card-padding)] shadow-card', className)}>
      <header className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-5 text-custom-text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-custom-text-secondary">{subtitle}</p>}
          {headline && <p className="mt-1 text-xl font-semibold text-custom-text-primary">{headline}</p>}
        </div>
        {table && (
          <button
            type="button"
            onClick={() => setAsTable(value => !value)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-custom-text-secondary hover:bg-custom-interactive-hover hover:text-custom-text-primary"
            aria-label={asTable ? `Show ${title} as a chart` : `Show ${title} as a table`}
            title={asTable ? 'Chart view' : 'Table view'}
          >
            {asTable ? <BarChart3 className="h-4 w-4" /> : <Table2 className="h-4 w-4" />}
          </button>
        )}
      </header>
      {asTable && table ? (
        <div className="overflow-auto" style={{ maxHeight: height + 32 }}>{table}</div>
      ) : (
        <>
          {legend && <div className="mb-2">{legend}</div>}
          <div style={{ height }}>{children}</div>
        </>
      )}
    </section>
  )
}

// The table twin of a chart: one row per period (or category), one column per series
export const DataTable = ({ columns, rows }) => (
  <table className="w-full text-xs">
    <thead>
      <tr>
        {columns.map(column => (
          <th key={column.key} className={cn('sticky top-0 bg-custom-bg-table px-2 py-1.5 font-semibold text-custom-text-secondary', column.numeric ? 'text-right' : 'text-left')}>
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr key={index} className="border-b border-custom-bg-tertiary">
          {columns.map(column => (
            <td key={column.key} className={cn('px-2 py-1.5 text-custom-text-primary', column.numeric && 'text-right tabular-nums')}>
              {column.format ? column.format(row[column.key], row) : row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
