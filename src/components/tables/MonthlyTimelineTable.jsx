import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Calendar } from 'lucide-react'
import { TableToolbar, ColumnMenu, DataTable, TableEmpty, TablePagination, SortableHeader } from './TableShell'
import OwnerCell from '../ui/OwnerCell'

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Timeline cells drop the currency prefix to save width; the toolbar states amounts are in UGX
export const formatAmount = (value) => Number(value || 0).toLocaleString('en-US')

export const AmountCell = ({ getValue }) => getValue()
  ? formatAmount(getValue())
  : <span className="text-custom-text-muted">–</span>

const selectClass = 'h-10 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'

// Shared by the Savings and Loan Payments pages:
// frozen Member column · leading columns · B/F · Jan..Dec (selected month highlighted) · trailing columns,
// with a pinned totals row and Year / Month filters in the toolbar
const MonthlyTimelineTable = ({
  rows = [],
  totals,
  availableYears = [],
  year,
  month,
  onYearChange,
  onMonthChange,
  leadingColumns = [],
  trailingColumns = [],
  searchPlaceholder = 'Search members or accounts...',
  emptyTitle,
  emptyDescription,
}) => {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const [columnVisibility, setColumnVisibility] = useState({})

  const years = useMemo(
    () => [...new Set([year, ...availableYears])].sort((a, b) => b - a),
    [year, availableYears]
  )

  const columns = useMemo(() => [
    {
      accessorKey: 'memberName',
      meta: { label: 'Member', emphasis: 'primary', sticky: 'left' },
      enableHiding: false,
      header: ({ column }) => <SortableHeader column={column} label="Member" />,
      cell: ({ row, getValue }) => <OwnerCell name={getValue()} avatar={row.original.memberAvatar} />,
      footer: 'Totals',
    },
    ...leadingColumns,
    {
      accessorKey: 'broughtForward',
      header: 'B/F',
      meta: { emphasis: 'amount' },
      cell: AmountCell,
      footer: () => formatAmount(totals?.broughtForward),
    },
    ...MONTHS.map((label, index) => ({
      id: `month${index + 1}`,
      accessorFn: (row) => row.months[index],
      header: label,
      meta: { align: 'right', highlight: month === index + 1 },
      cell: AmountCell,
      footer: () => formatAmount(totals?.months[index]),
    })),
    ...trailingColumns,
  ], [month, totals, leadingColumns, trailingColumns])

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Search by member name or account number only, not by amounts
    globalFilterFn: (row, _columnId, value) => {
      const query = String(value).toLowerCase()
      return row.original.memberName.toLowerCase().includes(query)
        || String(row.original.accountNumber || '').toLowerCase().includes(query)
    },
    state: {
      sorting,
      globalFilter: filtering,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setFiltering,
  })

  return (
    <>
      <TableToolbar search={filtering} onSearch={setFiltering} placeholder={searchPlaceholder}>
        <span className="hidden text-xs text-custom-text-secondary xl:inline">Amounts in UGX</span>
        <ColumnMenu table={table} />
        <Calendar className="h-4 w-4 text-custom-text-secondary" />
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          aria-label="Year"
          className={selectClass}
        >
          {years.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={month ?? ''}
          onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : null)}
          aria-label="Month"
          className={selectClass}
        >
          <option value="">All months</option>
          {MONTHS.map((label, index) => (
            <option key={label} value={index + 1}>{label}</option>
          ))}
        </select>
      </TableToolbar>

      <DataTable
        table={table}
        empty={<TableEmpty title={emptyTitle} description={emptyDescription} />}
      />

      <TablePagination table={table} />
    </>
  )
}

export default MonthlyTimelineTable
