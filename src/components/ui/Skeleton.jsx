import React from 'react'
import { cn } from '../../lib/utils'

// Placeholders in the shape of what is loading, so pages don't jump when data arrives.
// The pulse stops for people who ask their system for reduced motion.
export const Skeleton = ({ className, style }) => (
  <div className={cn('animate-pulse rounded-md bg-custom-bg-tertiary motion-reduce:animate-none', className)} style={style} aria-hidden="true" />
)

const Surface = ({ className, children }) => (
  <div className={cn('rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-[var(--card-padding)] shadow-card', className)}>
    {children}
  </div>
)

export const StatGridSkeleton = ({ count = 4 }) => (
  <div className="grid shrink-0 grid-cols-2 gap-[var(--card-gap)] lg:grid-cols-4">
    {Array.from({ length: count }, (_, index) => (
      <Surface key={index} className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </Surface>
    ))}
  </div>
)

// Table body only (for use inside an existing table frame) or a whole panel with toolbar
export const TableRowsSkeleton = ({ rows = 8, columns = 6 }) => (
  <div className="divide-y divide-custom-bg-tertiary" role="status" aria-label="Loading">
    <div className="flex h-10 items-center gap-6 bg-custom-bg-table px-4">
      {Array.from({ length: columns }, (_, index) => <Skeleton key={index} className="h-3 flex-1" />)}
    </div>
    {Array.from({ length: rows }, (_, row) => (
      <div key={row} className="flex h-12 items-center gap-6 px-4">
        {Array.from({ length: columns }, (_, column) => (
          <Skeleton key={column} className={cn('h-3 flex-1', column === 0 && 'max-w-48', (row + column) % 3 === 0 && 'opacity-70')} />
        ))}
      </div>
    ))}
  </div>
)

export const TablePanelSkeleton = ({ rows = 10, columns = 6 }) => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary shadow-card">
    <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary px-3">
      <Skeleton className="h-9 w-64" />
      <div className="flex gap-2"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-8" /></div>
    </div>
    <div className="min-h-0 flex-1 overflow-hidden"><TableRowsSkeleton rows={rows} columns={columns} /></div>
  </div>
)

export const ChartCardSkeleton = ({ height = 240 }) => (
  <Surface>
    <Skeleton className="h-4 w-40" />
    <Skeleton className="mt-2 h-3 w-56" />
    <div className="mt-4 flex items-end gap-3" style={{ height }}>
      {[55, 70, 40, 85, 65, 90, 50, 75].map((value, index) => (
        <Skeleton key={index} className="flex-1 rounded-b-none" style={{ height: `${value}%` }} />
      ))}
    </div>
  </Surface>
)

const DashboardSkeleton = () => (
  <>
    <Skeleton className="h-10 w-56 shrink-0" />
    <StatGridSkeleton />
    <StatGridSkeleton />
    <div className="grid gap-[var(--card-gap)] lg:grid-cols-2">
      <ChartCardSkeleton /><ChartCardSkeleton />
    </div>
  </>
)

const ReportSkeleton = () => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary shadow-card">
    <div className="flex gap-2 border-b border-custom-bg-tertiary px-3 py-2">
      {[80, 110, 90, 90, 150].map((width, index) => <Skeleton key={index} className="h-8" style={{ width }} />)}
    </div>
    <div className="flex gap-3 border-b border-custom-bg-tertiary px-3 py-3"><Skeleton className="h-10 w-36" /><Skeleton className="h-10 w-36" /></div>
    <div className="space-y-3 p-4">
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-16" />)}</div>
      <TableRowsSkeleton rows={8} columns={7} />
    </div>
  </div>
)

const SplitSkeleton = () => (
  <div className="grid min-h-0 flex-1 gap-[var(--section-gap)] lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
    <TablePanelSkeleton rows={8} columns={3} />
    <Surface className="hidden space-y-4 lg:block">
      <div className="flex items-center gap-3"><Skeleton className="h-11 w-11 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-52" /></div></div>
      {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-4" />)}
      <Skeleton className="h-10" />
    </Surface>
  </div>
)

const ProfileSkeleton = () => (
  <div className="grid min-h-0 flex-1 gap-[var(--section-gap)] lg:grid-cols-3">
    <Surface className="space-y-4">
      <Skeleton className="mx-auto h-24 w-24 rounded-full" />
      <Skeleton className="mx-auto h-5 w-40" />
      {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-4" />)}
    </Surface>
    <Surface className="space-y-4 lg:col-span-2">
      <Skeleton className="h-5 w-48" />
      <div className="grid grid-cols-2 gap-4">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-10" />)}</div>
      <TableRowsSkeleton rows={5} columns={4} />
    </Surface>
  </div>
)

const TablePageSkeleton = () => (
  <>
    <StatGridSkeleton />
    <TablePanelSkeleton />
  </>
)

const VARIANTS = {
  dashboard: DashboardSkeleton,
  table: TablePageSkeleton,
  tableOnly: TablePanelSkeleton,
  report: ReportSkeleton,
  split: SplitSkeleton,
  profile: ProfileSkeleton,
}

// A whole page's placeholder, filling the page area like the page itself does
export const PageSkeleton = ({ variant = 'table' }) => {
  const Variant = VARIANTS[variant] ?? TablePageSkeleton
  return (
    <div className="flex h-full min-h-0 flex-col gap-[var(--section-gap)] overflow-hidden" role="status" aria-label="Loading page">
      <Variant />
    </div>
  )
}

// Which placeholder each page gets while it loads after navigation
const ROUTE_VARIANTS = [
  [/^\/home\/?$/, 'dashboard'],
  [/^\/home\/(reports)/, 'report'],
  [/^\/home\/(password-resets)/, 'split'],
  [/^\/home\/(profile|settings)/, 'profile'],
  [/^\/home\/(audit|loan-applications)/, 'tableOnly'],
]
export const RouteSkeleton = ({ pathname }) => {
  const variant = ROUTE_VARIANTS.find(([pattern]) => pattern.test(pathname))?.[1] ?? 'table'
  return <PageSkeleton variant={variant} />
}

export default Skeleton
