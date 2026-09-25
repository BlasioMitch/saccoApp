import React from 'react'
import { cn } from '../../lib/utils'

const TONES = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

const TREND = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
}

// 88px tall: 16 padding + 16 label + 8 gap + 32 value + 16 padding (+24 with a note line)
export const StatCard = ({ title, value, icon: Icon, tone = 'blue', meta, trend, note }) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-4">
    <div className="min-w-0">
      <p className="truncate text-xs font-medium uppercase leading-4 tracking-wide text-custom-text-secondary">
        {title}
      </p>
      <div className="mt-2 flex min-w-0 items-baseline gap-2">
        <p className="truncate text-2xl font-bold leading-8 tabular-nums text-custom-text-primary">
          {value}
        </p>
        {meta && (
          <p className={cn('truncate text-xs font-medium leading-4', TREND[trend] || 'text-custom-text-secondary')}>
            {meta}
          </p>
        )}
      </div>
      {note && (
        <p className="mt-2 truncate text-xs leading-4 text-custom-text-secondary">{note}</p>
      )}
    </div>
    {Icon && (
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', TONES[tone])}>
        <Icon className="h-5 w-5" />
      </span>
    )}
  </div>
)

export const StatGrid = ({ stats = [], className }) => {
  if (!stats.length) return null
  return (
    <div className={cn('grid shrink-0 grid-cols-2 gap-4 lg:grid-cols-4', className)}>
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}

export default StatGrid
