import React from 'react'
import { flexRender } from '@tanstack/react-table'
import { Search, Columns3, Eye, EyeOff, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import DropdownMenu from '../ui/DropdownMenu'

// Column meta drives emphasis: { emphasis: 'primary' | 'amount', align: 'right' }
const isRightAligned = (meta = {}) => meta.align === 'right' || meta.emphasis === 'amount'

const headerClass = (meta) => cn(
  'sticky top-0 z-10 h-10 whitespace-nowrap border-b border-custom-bg-tertiary bg-custom-bg-secondary px-4',
  'text-xs font-medium uppercase tracking-wide text-custom-text-secondary',
  isRightAligned(meta) ? 'text-right' : 'text-left'
)

const cellClass = (meta = {}) => cn(
  'h-12 whitespace-nowrap border-b border-custom-bg-tertiary px-4 text-sm',
  isRightAligned(meta) && 'text-right',
  meta.emphasis === 'primary' && 'font-medium text-custom-text-primary',
  meta.emphasis === 'amount' && 'font-semibold tabular-nums text-custom-text-primary',
  !meta.emphasis && 'text-custom-text-secondary'
)

// 56px bar: search on the left, actions on the right
export const TableToolbar = ({ search, onSearch, placeholder = 'Search...', children }) => (
  <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary px-4">
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-text-secondary" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary pl-10 pr-4 text-sm text-custom-text-primary placeholder:text-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
      />
    </div>
    <div className="flex items-center gap-2">{children}</div>
  </div>
)

// Label used in the column menu: meta.label for columns whose header is a component
const columnLabel = (column) => column.columnDef.meta?.label
  || (typeof column.columnDef.header === 'string' ? column.columnDef.header : '')

export const SortableHeader = ({ column, label }) => {
  const sorted = column.getIsSorted()
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-custom-text-primary"
    >
      {label}
      <Icon className="h-4 w-4" />
    </button>
  )
}

export const ColumnMenu = ({ table }) => {
  const columns = table.getAllLeafColumns().filter(column => column.getCanHide() && columnLabel(column))
  return (
    <DropdownMenu
      variant="secondary"
      size="md"
      keepOpen
      width={224}
      label={<><Columns3 className="h-4 w-4" />Columns</>}
      items={columns.map(column => ({
        key: column.id,
        label: columnLabel(column),
        icon: column.getIsVisible() ? Eye : EyeOff,
        onClick: () => column.toggleVisibility(),
      }))}
    />
  )
}

// The only scrolling area of a page: sticky header, rows scroll in both axes inside the card
export const DataTable = ({ table, onRowClick, empty }) => {
  const rows = table.getRowModel().rows
  const hasData = table.getCoreRowModel().rows.length > 0

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      {rows.length > 0 ? (
        <table className="w-full border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={headerClass(header.column.columnDef.meta)}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn('transition-colors hover:bg-custom-interactive-hover', onRowClick && 'cursor-pointer')}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={cellClass(cell.column.columnDef.meta)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          {hasData ? (
            <p className="text-sm text-custom-text-secondary">No results match your search.</p>
          ) : empty}
        </div>
      )}
    </div>
  )
}

export const TableEmpty = ({ title, description, action }) => (
  <>
    <div className="space-y-2">
      <p className="text-base font-semibold leading-6 text-custom-text-primary">{title}</p>
      {description && <p className="text-sm text-custom-text-secondary">{description}</p>}
    </div>
    {action}
  </>
)

// 56px bar: range + page size on the left, paging on the right
export const TablePagination = ({ table, pageSizes = [5, 10, 20, 30, 40, 50] }) => {
  const total = table.getFilteredRowModel().rows.length
  if (!table.getCoreRowModel().rows.length) return null

  const { pageIndex, pageSize } = table.getState().pagination
  const from = total ? pageIndex * pageSize + 1 : 0
  const to = Math.min(total, (pageIndex + 1) * pageSize)

  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-t border-custom-bg-tertiary px-4 text-sm text-custom-text-secondary">
      <div className="flex items-center gap-4">
        <span>
          Showing <span className="font-medium tabular-nums text-custom-text-primary">{from}–{to}</span> of{' '}
          <span className="font-medium tabular-nums text-custom-text-primary">{total}</span>
        </span>
        <select
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          aria-label="Rows per page"
          className="h-8 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-2 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
        >
          {pageSizes.map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="tabular-nums">Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
        <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
