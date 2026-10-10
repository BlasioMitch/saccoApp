import React, { useMemo } from 'react'
import { SortableHeader } from './TableShell'
import MonthlyTimelineTable, { formatAmount, MONTHS } from './MonthlyTimelineTable'

export { MONTHS }

const SavingsTable = ({ report, year, month, onYearChange, onMonthChange }) => {
  const totals = report?.totals

  const leadingColumns = useMemo(() => [
    { accessorKey: 'accountNumber', header: 'Account' },
  ], [])

  const trailingColumns = useMemo(() => [
    {
      accessorKey: 'total',
      meta: { label: 'Total', emphasis: 'amount' },
      header: ({ column }) => <SortableHeader column={column} label="Total" />,
      cell: ({ getValue }) => formatAmount(getValue()),
      footer: () => formatAmount(totals?.total),
    },
  ], [totals])

  return (
    <MonthlyTimelineTable
      rows={report?.members}
      totals={totals}
      availableYears={report?.availableYears}
      year={year}
      month={month}
      onYearChange={onYearChange}
      onMonthChange={onMonthChange}
      leadingColumns={leadingColumns}
      trailingColumns={trailingColumns}
      emptyTitle={`No savings recorded for ${year}`}
      emptyDescription="Member accounts will appear here once they are created."
    />
  )
}

export default SavingsTable
