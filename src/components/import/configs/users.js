import moment from 'moment'
import { linesByKey, otherLines, parseDate, parseEnum, rowIssues } from './common'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONTACT_PATTERN = /^\+?\d{9,15}$/
const MIN_AGE = 18

const GENDERS = [
  { value: 'MALE', label: 'Male', aliases: ['M'] },
  { value: 'FEMALE', label: 'Female', aliases: ['F'] },
]
const ROLES = [
  { value: 'USER', label: 'User', aliases: ['Member'] },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'ADMIN', label: 'Admin' },
]
const STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()
const normalizeContact = (contact) => String(contact || '').replace(/[\s()-]/g, '')

export default {
  key: 'users',
  title: 'Import Members',
  noun: 'member',
  templateName: 'members-import-template.csv',
  columns: [
    { key: 'first_name', label: 'First Name', required: true, example: 'Jane' },
    { key: 'last_name', label: 'Last Name', required: true, aliases: ['surname'], example: 'Doe' },
    { key: 'other_name', label: 'Other Name', aliases: ['middle_name'], example: '' },
    { key: 'email', label: 'Email', required: true, example: 'jane.doe@example.com', hint: 'Must be unique' },
    { key: 'contact', label: 'Contact', required: true, aliases: ['phone', 'phone_number'], example: '+256700123456', hint: '9–15 digits' },
    { key: 'dob', label: 'Date of Birth', required: true, aliases: ['date_of_birth'], example: '1990-05-20', hint: 'YYYY-MM-DD, 18+' },
    { key: 'gender', label: 'Gender', required: true, example: 'Female', hint: 'Male / Female' },
    { key: 'role', label: 'Role', example: 'User', hint: 'User (default), Manager, Admin' },
    { key: 'status', label: 'Status', example: 'Active', hint: 'Active (default) / Inactive' },
  ],

  // ctx: { users, currentUser }. Validates the whole file so duplicates are flagged before submission.
  validate(rows, { users = [], currentUser } = {}) {
    const registered = new Set(users.map(user => normalizeEmail(user.email)))
    const emailLines = linesByKey(rows, row => normalizeEmail(row.values.email))
    const contactLines = linesByKey(rows, row => normalizeContact(row.values.contact))
    const isAdmin = currentUser?.role === 'ADMIN'

    return rows.map(row => {
      const v = row.values
      const issues = rowIssues()

      for (const [field, label] of [['first_name', 'First Name'], ['last_name', 'Last Name']]) {
        if (!v[field]) issues.error(field, `${label} is required`)
      }

      const email = normalizeEmail(v.email)
      if (!email) issues.error('email', 'Email is required')
      else if (!EMAIL_PATTERN.test(email)) issues.error('email', 'Email is not valid')
      else if (registered.has(email)) issues.error('email', 'Email is already registered')
      else if (emailLines.get(email).length > 1) issues.error('email', `Email repeated on line ${otherLines(emailLines.get(email), row.line)}`)

      const contact = normalizeContact(v.contact)
      if (!contact) issues.error('contact', 'Contact is required')
      else if (!CONTACT_PATTERN.test(contact)) issues.error('contact', 'Contact must be 9–15 digits')
      else if (contactLines.get(contact).length > 1) issues.warn('contact', `Same contact as line ${otherLines(contactLines.get(contact), row.line)}`)

      const dob = issues.parse('dob', 'Date of Birth', parseDate, v.dob, true)
      if (dob) {
        const age = moment().diff(moment(dob), 'years')
        if (age < MIN_AGE) issues.error('dob', `Member must be at least ${MIN_AGE} years old`)
      }

      const gender = issues.parse('gender', 'Gender', (text) => parseEnum(text, GENDERS), v.gender, true)
      const role = issues.parse('role', 'Role', (text) => parseEnum(text, ROLES), v.role) || 'USER'
      if (role !== 'USER' && !isAdmin) issues.error('role', 'Only an admin can import managers or admins')
      const status = issues.parse('status', 'Status', (text) => parseEnum(text, STATUSES), v.status) || 'ACTIVE'

      return {
        ...row,
        errors: issues.errors,
        warnings: issues.warnings,
        payload: {
          first_name: v.first_name,
          last_name: v.last_name,
          ...(v.other_name && { other_name: v.other_name }),
          email,
          contact,
          dob,
          gender,
          role,
          status,
        },
      }
    })
  },
}
