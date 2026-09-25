import React from 'react'
import { cn } from '../../lib/utils'

const TONES = {
  green: 'bg-green-500/10 text-green-700 dark:text-green-400',
  amber: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  red: 'bg-red-500/10 text-red-700 dark:text-red-400',
  neutral: 'bg-custom-bg-tertiary text-custom-text-secondary',
}

const TONE_BY_STATUS = {
  ACTIVE: 'green',
  COMPLETED: 'green',
  PAID: 'green',
  PENDING: 'amber',
  FAILED: 'red',
  DEFAULTED: 'red',
  INACTIVE: 'neutral',
  CLOSED: 'neutral',
}

const StatusBadge = ({ status, className }) => {
  if (!status) return null
  const tone = TONE_BY_STATUS[String(status).toUpperCase()] || 'neutral'
  return (
    <span className={cn('inline-flex h-6 items-center rounded-full px-2 text-xs font-medium capitalize', TONES[tone], className)}>
      {String(status).toLowerCase().replace(/_/g, ' ')}
    </span>
  )
}

export default StatusBadge
