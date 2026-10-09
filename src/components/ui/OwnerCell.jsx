import React from 'react'
import Avatar from './Avatar'
import { ownerName } from '../../utils/names'

// Report rows carry only a display name: split it so the avatar can show initials
const userFromName = (name = '') => {
  const [first_name = '', last_name = ''] = name.split(' ').filter(Boolean)
  return { first_name, last_name }
}

// Owner column: photo (or initials) with the name, used as the frozen first column of member tables
const OwnerCell = ({ owner, name, avatar }) => {
  const label = name ?? ownerName(owner)
  const user = owner || userFromName(label)
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar user={user} src={avatar ?? owner?.avatar ?? null} className="h-7 w-7" textClassName="text-[10px]" />
      <span className="truncate">{label}</span>
    </span>
  )
}

export default OwnerCell
