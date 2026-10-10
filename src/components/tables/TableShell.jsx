import React from 'react'
import { flexRender } from '@tanstack/react-table'
import { Search, Columns3, Eye, EyeOff, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { TableRowsSkeleton } from '../ui/Skeleton'
import Button from '../ui/Button'
import DropdownMenu from '../ui/DropdownMenu'

// Column meta drives presentation:
// { emphasis: 'primary' | 'amount', align: 'right', sticky: 'left', highlight: boolean }
const isRightAligned = (meta = {}) => meta.align === 'right' || meta.emphasis === 'amount'

// Divider on the frozen column's right edge so scrolled columns visibly pass underneath it
const FROZEN_EDGE = 'max-w-64 shadow-[inset_-1px_0_0_var(--custom-bg-tertiary)]'

const headerClass = (meta = {}) => cn(
  'sticky top-0 z-10 h-10 whitespace-nowrap border-b border-custom-bg-tertiary bg-custom-bg-table px-4',
  'text-xs font-semibold uppercase tracking-wide text-custom-text-secondary',
  isRightAligned(meta) ? 'text-right' : 'text-left',
  meta.sticky === 'left' && FROZEN_EDGE,
  meta.sticky === 'left' && 'left-0 z-20',
  meta.highlight && 'bg-custom-interactive-focus text-custom-brand-primary'
)

const cellClass = (meta = {}) => cn(
  'h-12 whitespace-nowrap border-b border-custom-bg-tertiary px-4 text-sm',
  isRightAligned(meta) && 'text-right tabular-nums',
  meta.emphasis === 'primary' && 'font-medium text-custom-text-primary',
  meta.emphasis === 'amount' && 'font-semibold tabular-nums text-custom-text-primary',
  !meta.emphasis && 'text-custom-text-secondary',
  // Frozen cells need a solid background so scrolled content passes underneath
  meta.sticky === 'left' && cn('sticky left-0 z-[5] bg-custom-bg-primary group-hover:bg-custom-interactive-hover', FROZEN_EDGE),
  meta.highlight && 'bg-custom-interactive-focus text-custom-text-primary'
)

const footerClass = (meta = {}) => cn(
  'sticky bottom-0 z-10 h-10 whitespace-nowrap border-t border-custom-bg-tertiary bg-custom-bg-table px-4',
  'text-sm font-semibold tabular-nums text-custom-text-primary',
  isRightAligned(meta) ? 'text-right' : 'text-left',
  meta.sticky === 'left' && cn('left-0 z-20', FROZEN_EDGE),
  meta.highlight && 'bg-custom-interactive-focus'
)

// 48px bar: search on the left, actions on the right
export const TableToolbar = ({ search, onSearch, placeholder = 'Search...', children }) => (
  <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary px-3">
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
// loading: first load with nothing to show yet; rows in the shape of the table instead of an empty message
export const DataTable = ({ table, onRowClick, empty, loading = false }) => {
  const rows = table.getRowModel().rows
  const hasData = table.getCoreRowModel().rows.length > 0
  // Totals row pinned to the bottom, rendered only when a column defines `footer`
  const hasFooter = table.getAllLeafColumns().some(column => column.columnDef.footer)

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
            {rows.map(row => {
              // Made offline and not sent yet: marked, and not opened (the server has no record of it yet)
              const pending = row.original?.syncStatus === 'pending'
              return (
                <tr
                  key={row.id}
                  onClick={onRowClick && !pending ? () => onRowClick(row.original) : undefined}
                  title={pending ? 'Saved in this browser; it will be sent when you are back online' : undefined}
                  className={cn('group transition-colors hover:bg-custom-interactive-hover', onRowClick && !pending && 'cursor-pointer', pending && 'bg-yellow-500/5')}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td key={cell.id} className={cellClass(cell.column.columnDef.meta)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {pending && index === 0 && (
                        <span className="ml-2 inline-flex h-5 items-center rounded-full bg-yellow-500/15 px-2 text-[11px] font-medium text-yellow-700 dark:text-yellow-400">Waiting to sync</span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
          {hasFooter && (
            <tfoot>
              {table.getFooterGroups().slice(0, 1).map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <td key={header.id} className={footerClass(header.column.columnDef.meta)}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      ) : loading && !hasData ? (
        <TableRowsSkeleton rows={10} columns={Math.min(7, Math.max(3, table.getVisibleLeafColumns().length))} />
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
