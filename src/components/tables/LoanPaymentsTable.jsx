import React, { useMemo } from 'react'
import moment from 'moment'
import { SortableHeader } from './TableShell'
import MonthlyTimelineTable, { formatAmount } from './MonthlyTimelineTable'
import StatusBadge from '../ui/StatusBadge'

const LoanPaymentsTable = ({ report, year, month, onYearChange, onMonthChange }) => {
  const totals = report?.totals

  const leadingColumns = useMemo(() => [
    { accessorKey: 'accountNumber', header: 'Account' },
    {
      accessorKey: 'loanAmount',
      header: 'Loan Amount',
      meta: { align: 'right' },
      cell: ({ getValue }) => formatAmount(getValue()),
      footer: () => formatAmount(totals?.loanAmount),
    },
  ], [totals])

  const trailingColumns = useMemo(() => [
    {
      accessorKey: 'totalPaid',
      header: 'Total Paid',
      meta: { emphasis: 'amount' },
      cell: ({ getValue }) => formatAmount(getValue()),
      footer: () => formatAmount(totals?.totalPaid),
    },
    {
      accessorKey: 'remainingBalance',
      meta: { label: 'Remaining', emphasis: 'amount' },
      header: ({ column }) => <SortableHeader column={column} label="Remaining" />,
      cell: ({ getValue }) => formatAmount(getValue()),
      footer: () => formatAmount(totals?.remainingBalance),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    },
    {
      accessorKey: 'completedOn',
      header: 'Completed On',
      cell: ({ getValue }) => getValue()
        ? moment(getValue()).format('DD/MMM/YYYY')
        : <span className="text-custom-text-muted">–</span>,
    },
  ], [totals])

  return (
    <MonthlyTimelineTable
      rows={report?.loans}
      totals={totals}
      availableYears={report?.availableYears}
      year={year}
      month={month}
      onYearChange={onYearChange}
      onMonthChange={onMonthChange}
      leadingColumns={leadingColumns}
      trailingColumns={trailingColumns}
      emptyTitle={`No loans to show for ${year}`}
      emptyDescription="Loans that are open during the year, or completed in it, appear here."
    />
  )
}

export default LoanPaymentsTable
