import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HandCoins, Receipt, Scale, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { StatGrid } from '../../components/ui/StatCard'
import { PageShell, Panel } from '../../components/layout/PageShell'
import LoanPaymentsTable from '../../components/tables/LoanPaymentsTable'
import { MONTHS } from '../../components/tables/MonthlyTimelineTable'
import { fetchLoanPaymentsReport } from '../../reducers/loanPaymentsReducer'
import { formatUGX } from '../../utils/currency'

const EMPTY_STATS = {
  totalRepaid: 0,
  paymentCount: 0,
  pendingRepaid: 0,
  pendingCount: 0,
  outstandingBalance: 0,
  loansCompleted: 0,
}

const LoanPayments = () => {
  const dispatch = useDispatch()
  const { report, status, error } = useSelector(state => state.loanPayments)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(null) // null = whole year

  useEffect(() => {
    dispatch(fetchLoanPaymentsReport({ year, month }))
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
      title: `Total Repaid · ${period}`,
      value: formatUGX(stats.totalRepaid),
      note: `Pending: ${formatUGX(stats.pendingRepaid)}`,
      icon: HandCoins,
      tone: 'green',
    },
    {
      title: 'Loan Payments',
      value: stats.paymentCount.toLocaleString(),
      note: `${stats.pendingCount} pending`,
      icon: Receipt,
      tone: 'blue',
    },
    {
      title: 'Outstanding Balance',
      value: formatUGX(stats.outstandingBalance),
      note: 'All open loans, as of today',
      icon: Scale,
      tone: 'red',
    },
    {
      title: 'Loans Completed',
      value: stats.loansCompleted.toLocaleString(),
      note: `Cleared in ${period}`,
      icon: CheckCircle2,
      tone: 'purple',
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
          <LoanPaymentsTable
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

export default LoanPayments
