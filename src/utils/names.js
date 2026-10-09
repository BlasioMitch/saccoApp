// Display name for a member/owner object; tolerates partial selections and missing data
export const ownerName = (owner) => {
  if (!owner) return 'N/A'
  const name = [owner.first_name, owner.last_name, owner.other_name].filter(Boolean).join(' ')
  return name || owner.fullName || 'N/A'
}
