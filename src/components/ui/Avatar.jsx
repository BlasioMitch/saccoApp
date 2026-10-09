import React from 'react'
import { cn } from '../../lib/utils'

export const initialsOf = (user) => {
  const first = user?.first_name || user?.firstName || ''
  const last = user?.last_name || user?.lastName || ''
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'U'
}

// Profile picture, or initials on the brand colour when there is none
const Avatar = ({ user, src, className, textClassName }) => {
  const image = src ?? user?.avatar
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-custom-brand-primary', className)}>
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className={cn('font-semibold text-custom-interactive-active-text', textClassName)}>{initialsOf(user)}</span>
      )}
    </span>
  )
}

export default Avatar
