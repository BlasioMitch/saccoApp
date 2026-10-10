import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, HandCoins, Landmark, PiggyBank, RefreshCw, TrendingUp, Users,
} from 'lucide-react'
import { DASHBOARD_STATS } from '../../graphql/queries/dashboard'
import { PageShell } from '../../components/layout/PageShell'
import { PageSkeleton } from '../../components/ui/Skeleton'
import { StatCard } from '../../components/ui/StatCard'
import {
  axisProps, barProps, ChartCard, ChartLegend, ChartTooltip, DataTable, formatCompact, formatMoney, formatMoneyCompact,
  gridProps, periodLabel, SERIES, useHiddenSeries, yAxisProps,
} from '../../components/charts/ChartKit'
import { cn } from '../../lib/utils'
import { visibleError } from '../../offline/network'

const RANGES = [
  { key: 'THREE_MONTHS', label: '3M', name: '3 months' },
  { key: 'SIX_MONTHS', label: '6M', name: '6 months' },
  { key: 'ONE_YEAR', label: '1Y', name: '12 months' },
  { key: 'ALL', label: 'All', name: 'all time' },
]
const RANGE_KEY = 'dashboardRange'

const savedRange = () => {
  try {
    const saved = localStorage.getItem(RANGE_KEY)
    return RANGES.some(range => range.key === saved) ? saved : 'SIX_MONTHS'
  } catch {
    return 'SIX_MONTHS'
  }
}

const percent = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`

// "+12.5% vs previous 3 months"; whether up is good decides the colour (withdrawals and lending stay neutral)
const delta = (kpi, rangeName, upIsGood = true) => {
  if (!kpi || kpi.change === null || kpi.change === undefined) return {}
  const sign = kpi.change > 0 ? '+' : ''
  const direction = kpi.change > 0 ? 'up' : kpi.change < 0 ? 'down' : null
  const trend = upIsGood === null || !direction ? undefined : (direction === 'up') === upIsGood ? 'up' : 'down'
  return { meta: `${sign}${(kpi.change * 100).toFixed(1)}%`, trend, note: `vs previous ${rangeName}` }
}

// Arrears aging carries status meaning (and a text label on every bar), so it uses the status colours
const AGING_COLORS = {
  CURRENT: 'var(--chart-good)',
  D1_30: 'var(--chart-warning)',
  D31_60: 'var(--chart-serious)',
  D61_90: 'var(--chart-serious)',
  D90_PLUS: 'var(--chart-critical)',
}
const STATUS_LABELS = { ACTIVE: 'Being repaid', DEFAULTED: 'Defaulted', PAID: 'Paid off', PENDING: 'Applications waiting' }

const RangeControl = ({ value, onChange }) => (
  <div className="flex rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-1" role="radiogroup" aria-label="Period">
    {RANGES.map(range => (
      <button
        key={range.key}
        type="button"
        role="radio"
        aria-checked={value === range.key}
        title={`Last ${range.name}`}
        onClick={() => onChange(range.key)}
        className={cn(
          'h-8 min-w-12 rounded-md px-3 text-sm font-medium transition-colors',
          value === range.key ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text' : 'text-custom-text-secondary hover:bg-custom-interactive-hover'
        )}
      >
        {range.label}
      </button>
    ))}
  </div>
)

// Grouped columns for two flows that are compared period by period (no second axis)
const FlowChart = ({ data, grain, keys, hidden }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} barGap={2} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
      <CartesianGrid {...gridProps} />
      <XAxis dataKey="period" {...axisProps} tickFormatter={(value) => periodLabel(value, grain)} minTickGap={12} />
      <YAxis {...yAxisProps} />
      <Tooltip content={<ChartTooltip grain={grain} />} cursor={{ fill: 'var(--custom-interactive-hover)' }} />
      {keys.map(key => (
        <Bar key={key} dataKey={key} name={SERIES[key].label} fill={SERIES[key].color} hide={hidden.has(key)} {...barProps} />
      ))}
    </BarChart>
  </ResponsiveContainer>
)

// One balance over time: a 2px line over a 10% wash
const BalanceChart = ({ data, grain, dataKey }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
      <CartesianGrid {...gridProps} />
      <XAxis dataKey="period" {...axisProps} tickFormatter={(value) => periodLabel(value, grain)} minTickGap={12} />
      <YAxis {...yAxisProps} />
      <Tooltip content={<ChartTooltip grain={grain} />} cursor={{ stroke: 'var(--chart-axis)', strokeWidth: 1 }} />
      <Area
        type="monotone"
        dataKey={dataKey}
        name={SERIES[dataKey].label}
        stroke={SERIES[dataKey].color}
        strokeWidth={2}
        fill={SERIES[dataKey].color}
        fillOpacity={0.1}
        dot={false}
        activeDot={{ r: 4, stroke: 'var(--custom-bg-primary)', strokeWidth: 2 }}
        isAnimationActive={false}
      />
    </AreaChart>
  </ResponsiveContainer>
)

const periodTable = (data, grain, keys) => (
  <DataTable
    columns={[
      { key: 'period', label: 'Period', format: (value) => periodLabel(value, grain, { long: true }) },
      ...keys.map(key => ({ key, label: SERIES[key].label, numeric: true, format: (value) => formatMoney(value) })),
    ]}
    rows={data}
  />
)

// Staff dashboard: balances, flows for the chosen period (vs the period before), and trends by week/month/quarter
function Dashboard() {
  const [range, setRange] = useState(savedRange)
  const [hiddenFlows, toggleFlow] = useHiddenSeries()
  const [hiddenLending, toggleLending] = useHiddenSeries()
  const [hiddenIncome, toggleIncome] = useHiddenSeries()

  const { data, previousData, loading, error, refetch } = useQuery(DASHBOARD_STATS, {
    variables: { range },
    fetchPolicy: 'cache-and-network',
    pollInterval: 5 * 60_000,
  })
  // While another range loads, the previous one stays on screen (dimmed) instead of flashing empty
  const stats = (data ?? previousData)?.dashboardStats
  const refreshing = loading && Boolean(stats)
  const rangeName = RANGES.find(option => option.key === range)?.name

  const chooseRange = (key) => {
    setRange(key)
    try { localStorage.setItem(RANGE_KEY, key) } catch { /* storage unavailable */ }
  }

  const series = stats?.series ?? []
  const grain = stats?.grain ?? 'month'
  const incomeTotal = series.reduce((total, point) => total + point.feeIncome + point.interestIncome, 0)
  const maxAging = useMemo(() => Math.max(1, ...(stats?.loans.aging ?? []).map(bucket => bucket.outstanding)), [stats])

  if (!stats) {
    if (!error) return <PageSkeleton variant="dashboard" />
    return (
      <PageShell className="items-center justify-center">
        {visibleError(error)
          ? <p className="text-sm text-red-600">Could not load the dashboard: {error.message}</p>
          : <p className="text-sm text-custom-text-secondary">The dashboard hasn't been opened in this browser yet, so nothing is saved offline. It appears when you're back online.</p>}
      </PageShell>
    )
  }

  const { kpis } = stats
  const par = kpis.portfolioAtRisk.value
  const parTone = par > 0.1 ? 'red' : par > 0.05 ? 'yellow' : 'green'
  const ParIcon = par > 0.05 ? AlertTriangle : CheckCircle2

  return (
    <PageShell className="overflow-y-auto">
      {/* One filter row scopes every figure and chart below */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <RangeControl value={range} onChange={chooseRange} />
        <div className="flex items-center gap-2 text-xs text-custom-text-secondary">
          <span>
            {moment(stats.from).format('D MMM YYYY')} – {moment(stats.to).format('D MMM YYYY')} · by {grain} · updated {moment(stats.generatedAt).format('HH:mm')}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-custom-interactive-hover"
            aria-label="Refresh dashboard"
            title="Refresh"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
        </div>
      </div>
      {visibleError(error) && <p className="shrink-0 text-sm text-red-600">Could not refresh: {error.message}</p>}

      <div className={cn('flex flex-col gap-[var(--section-gap)] transition-opacity', refreshing && 'opacity-60')}>
        {/* Where the SACCO stands today */}
        <div className="grid shrink-0 grid-cols-2 gap-[var(--card-gap)] lg:grid-cols-4">
          <StatCard title="Member savings" value={formatMoneyCompact(kpis.totalSavings.value)} icon={PiggyBank} tone="brand" note={formatMoney(kpis.totalSavings.value)} />
          <StatCard title="Owed on loans" value={formatMoneyCompact(kpis.outstandingLoans.value)} icon={Landmark} tone="purple" note={`${formatMoney(stats.loans.arrears)} in arrears`} />
          <StatCard title="Portfolio at risk" value={percent(par)} icon={ParIcon} tone={parTone} note={`Over 30 days late · ${stats.loans.loansInArrears} loans in arrears`} />
          <StatCard
            title="Active members"
            value={stats.members.active.toLocaleString('en-US')}
            icon={Users}
            tone="brand"
            meta={kpis.newMembers.value ? `+${kpis.newMembers.value} new` : undefined}
            trend={kpis.newMembers.value ? 'up' : undefined}
            note={`${stats.members.total.toLocaleString('en-US')} members in total`}
          />
        </div>

        {/* What moved in the chosen period */}
        <div className="grid shrink-0 grid-cols-2 gap-[var(--card-gap)] lg:grid-cols-4">
          <StatCard title={`Deposits · ${rangeName}`} value={formatMoneyCompact(kpis.deposits.value)} icon={ArrowDownRight} tone="green" {...delta(kpis.deposits, rangeName)} />
          <StatCard title={`Withdrawals · ${rangeName}`} value={formatMoneyCompact(kpis.withdrawals.value)} icon={ArrowUpRight} tone="red" {...delta(kpis.withdrawals, rangeName, null)} />
          <StatCard title={`Loan repayments · ${rangeName}`} value={formatMoneyCompact(kpis.repayments.value)} icon={HandCoins} tone="blue" {...delta(kpis.repayments, rangeName)} />
          <StatCard title={`Income · ${rangeName}`} value={formatMoneyCompact(kpis.income.value)} icon={TrendingUp} tone="yellow" {...delta(kpis.income, rangeName)} />
        </div>

        <div className="grid gap-[var(--card-gap)] lg:grid-cols-2">
          <ChartCard
            title="Savings in and out"
            subtitle={`Deposits and withdrawals by ${grain}`}
            legend={<ChartLegend keys={['deposits', 'withdrawals']} hidden={hiddenFlows} onToggle={toggleFlow} />}
            table={periodTable(series, grain, ['deposits', 'withdrawals'])}
          >
            <FlowChart data={series} grain={grain} keys={['deposits', 'withdrawals']} hidden={hiddenFlows} />
          </ChartCard>

          <ChartCard
            title="Member savings balance"
            subtitle={`At the end of each ${grain}`}
            headline={formatMoney(kpis.totalSavings.value)}
            table={periodTable(series, grain, ['savingsBalance'])}
          >
            <BalanceChart data={series} grain={grain} dataKey="savingsBalance" />
          </ChartCard>

          <ChartCard
            title="Lending"
            subtitle={`Loans disbursed and repayments received by ${grain}`}
            legend={<ChartLegend keys={['disbursed', 'repayments']} hidden={hiddenLending} onToggle={toggleLending} />}
            table={periodTable(series, grain, ['disbursed', 'repayments'])}
          >
            <FlowChart data={series} grain={grain} keys={['disbursed', 'repayments']} hidden={hiddenLending} />
          </ChartCard>

          <ChartCard
            title="Loan book"
            subtitle="Principal still out with members, at the end of each period"
            headline={formatMoney(series.at(-1)?.loanBook ?? 0)}
            table={periodTable(series, grain, ['loanBook'])}
          >
            <BalanceChart data={series} grain={grain} dataKey="loanBook" />
          </ChartCard>

          <ChartCard
            title="Income"
            subtitle={`Membership fees and loan interest by ${grain}`}
            headline={formatMoney(incomeTotal)}
            legend={<ChartLegend keys={['feeIncome', 'interestIncome']} hidden={hiddenIncome} onToggle={toggleIncome} />}
            table={periodTable(series, grain, ['feeIncome', 'interestIncome'])}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="period" {...axisProps} tickFormatter={(value) => periodLabel(value, grain)} minTickGap={12} />
                <YAxis {...yAxisProps} />
                <Tooltip content={<ChartTooltip grain={grain} />} cursor={{ fill: 'var(--custom-interactive-hover)' }} />
                {/* Stacked: a 2px surface stroke is the gap between segments; only the top end is rounded */}
                <Bar dataKey="feeIncome" name={SERIES.feeIncome.label} stackId="income" fill={SERIES.feeIncome.color} stroke="var(--custom-bg-primary)" strokeWidth={2} maxBarSize={24} hide={hiddenIncome.has('feeIncome')} />
                <Bar dataKey="interestIncome" name={SERIES.interestIncome.label} stackId="income" fill={SERIES.interestIncome.color} stroke="var(--custom-bg-primary)" strokeWidth={2} maxBarSize={24} radius={[4, 4, 0, 0]} hide={hiddenIncome.has('interestIncome')} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Arrears by days overdue"
            subtitle="Outstanding on open loans, today"
            table={(
              <DataTable
                columns={[
                  { key: 'label', label: 'Days overdue' },
                  { key: 'count', label: 'Loans', numeric: true },
                  { key: 'outstanding', label: 'Outstanding', numeric: true, format: formatMoney },
                ]}
                rows={stats.loans.aging}
              />
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.loans.aging} layout="vertical" margin={{ top: 0, right: 88, bottom: 0, left: 0 }} barCategoryGap={8}>
                <XAxis type="number" hide domain={[0, maxAging]} />
                <YAxis type="category" dataKey="label" {...axisProps} axisLine={{ stroke: 'var(--chart-axis)' }} width={92} />
                <Tooltip
                  cursor={{ fill: 'var(--custom-interactive-hover)' }}
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-custom-text-primary">{formatMoney(payload[0].payload.outstanding)}</p>
                      <p className="text-custom-text-secondary">{payload[0].payload.label} · {payload[0].payload.count} loans</p>
                    </div>
                  ) : null}
                />
                <Bar dataKey="outstanding" maxBarSize={24} radius={[0, 4, 4, 0]} isAnimationActive={false}>
                  {stats.loans.aging.map(bucket => <Cell key={bucket.key} fill={AGING_COLORS[bucket.key]} />)}
                  <LabelList
                    dataKey="outstanding"
                    position="right"
                    fill="var(--custom-text-secondary)"
                    fontSize={11}
                    formatter={(value) => (value ? formatMoneyCompact(value) : '–')}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Loans by status: counts are the story, so they are numbers, not a chart */}
        <section className="shrink-0 rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-[var(--card-padding)] shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-custom-text-primary">Loans by status</h3>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.loans.byStatus.map(entry => (
              <div key={entry.status}>
                <dt className="text-xs text-custom-text-secondary">{STATUS_LABELS[entry.status] ?? entry.status}</dt>
                <dd className="text-lg font-semibold text-custom-text-primary">{entry.count.toLocaleString('en-US')}</dd>
                {entry.amount > 0 && <dd className="text-xs text-custom-text-secondary">{formatMoneyCompact(entry.amount)} lent</dd>}
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-custom-text-muted">
            {kpis.transactions.value.toLocaleString('en-US')} transactions in the last {rangeName}
            {kpis.disbursed.value ? ` · ${formatCompact(kpis.disbursed.value)} UGX lent` : ''}.
          </p>
        </section>
      </div>
    </PageShell>
  )
}

export default Dashboard
