import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PiggyBank, Receipt, Trophy, BarChart3, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { StatGrid } from '../../components/ui/StatCard'
import { PageShell, Panel } from '../../components/layout/PageShell'
import SavingsTable, { MONTHS } from '../../components/tables/SavingsTable'
import { fetchSavingsReport } from '../../reducers/savingsReducer'
import { formatUGX } from '../../utils/currency'

const EMPTY_STATS = {
  totalSavings: 0,
  transactionCount: 0,
  pendingSavings: 0,
  pendingCount: 0,
  highestTotalSaved: 0,
  meanAmount: 0,
  medianAmount: 0,
}

const Savings = () => {
  const dispatch = useDispatch()
  const { report, status, error } = useSelector(state => state.savings)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(null) // null = whole year

  useEffect(() => {
    dispatch(fetchSavingsReport({ year, month }))
  }, [dispatch, year, month])

  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error)
    }
  }, [status, error])

  const stats = report?.stats || EMPTY_STATS
  const period = month ? `${MONTHS[month - 1]} ${year}` : `${year}`

  const statCards = [
    {
      title: `Total Savings · ${period}`,
      value: formatUGX(stats.totalSavings),
      note: `Pending: ${formatUGX(stats.pendingSavings)}`,
      icon: PiggyBank,
      tone: 'green',
    },
    {
      title: 'Savings Transactions',
      value: stats.transactionCount.toLocaleString(),
      note: `${stats.pendingCount} pending`,
      icon: Receipt,
      tone: 'blue',
    },
    {
      title: 'Highest Total Saved',
      value: formatUGX(stats.highestTotalSaved),
      icon: Trophy,
      tone: 'purple',
    },
    {
      title: 'Mean Saving',
      value: formatUGX(stats.meanAmount),
      note: `Median: ${formatUGX(stats.medianAmount)}`,
      icon: BarChart3,
      tone: 'yellow',
    },
  ]

  return (
    <PageShell>
      <StatGrid stats={statCards} />
      <Panel>
        {status === 'loading' && !report ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-custom-brand-primary" />
          </div>
        ) : (
          <SavingsTable
            report={report}
            year={year}
            month={month}
            onYearChange={setYear}
            onMonthChange={setMonth}
          />
        )}
      </Panel>
    </PageShell>
  )
}

export default Savings
