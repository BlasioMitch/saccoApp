import React from 'react'
import { cn } from '../../lib/utils'

const TONES = {
  // "blue" was the old brand tone: it now follows the brand green
  blue: 'bg-custom-interactive-focus text-custom-brand-green',
  brand: 'bg-custom-interactive-focus text-custom-brand-green',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

const TREND = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
}

// Padding follows --card-padding (16-24px by screen width); value is 32px line height (+24 with a note line)
export const StatCard = ({ title, value, icon: Icon, tone = 'blue', meta, trend, note }) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-[var(--card-padding)] shadow-card">
    <div className="min-w-0">
      <p className="truncate text-xs font-medium uppercase leading-4 tracking-wide text-custom-text-secondary">
        {title}
      </p>
      <div className="mt-2 flex min-w-0 items-baseline gap-2">
        <p className="truncate text-xl font-bold leading-8 tabular-nums xl:text-2xl text-custom-text-primary">
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
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', TONES[tone])}>
        <Icon className="h-5 w-5" />
      </span>
    )}
  </div>
)

export const StatGrid = ({ stats = [], className }) => {
  if (!stats.length) return null
  return (
    <div className={cn('grid shrink-0 grid-cols-2 gap-[var(--card-gap)] lg:grid-cols-4', className)}>
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}

export default StatGrid
