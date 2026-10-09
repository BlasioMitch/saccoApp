import moment from 'moment'
import { DATE_FORMAT } from '../../../utils/loanTerms'

// Field parsers return { value } or { error }; empty input returns { value: '' } so callers decide "required"

// "UGX 20,000", "20000" and "20,000.00" -> 20000; fractions of a shilling are rejected
export const parseAmount = (text) => {
  const cleaned = String(text ?? '').replace(/ugx/i, '').replace(/[\s,]/g, '')
  if (cleaned === '') return { value: '' }
  if (!/^\d+(\.0+)?$/.test(cleaned)) return { error: 'must be a whole number of shillings' }
  const value = Number(cleaned)
  if (!Number.isSafeInteger(value)) return { error: 'is too large' }
  return { value }
}

const DATE_INPUT_FORMATS = ['YYYY-MM-DD', 'DD/MM/YYYY', 'D/M/YYYY', 'DD-MM-YYYY']

// Accepts ISO or day-first dates; returns YYYY-MM-DD
export const parseDate = (text) => {
  const raw = String(text ?? '').trim()
  if (raw === '') return { value: '' }
  const date = moment(raw, DATE_INPUT_FORMATS, true)
  if (!date.isValid()) return { error: 'must be a date like 2026-03-15' }
  return { value: date.format(DATE_FORMAT) }
}

// Matches an enum value or label ignoring case, spaces, dashes and underscores
export const parseEnum = (text, options) => {
  const raw = String(text ?? '').trim()
  if (raw === '') return { value: '' }
  const squash = (value) => String(value).toLowerCase().replace(/[\s_-]+/g, '')
  const match = options.find(option => [option.value, option.label, ...(option.aliases || [])].some(name => squash(name) === squash(raw)))
  return match ? { value: match.value } : { error: `must be one of ${options.map(option => option.label || option.value).join(', ')}` }
}

export const parseNumber = (text) => {
  const raw = String(text ?? '').trim().replace(/%$/, '')
  if (raw === '') return { value: '' }
  const value = Number(raw)
  return Number.isFinite(value) ? { value } : { error: 'must be a number' }
}

// Collects field errors/warnings for one row
export const rowIssues = () => {
  const errors = []
  const warnings = []
  return {
    errors,
    warnings,
    error: (field, message) => errors.push({ field, message }),
    warn: (field, message) => warnings.push({ field, message }),
    // Runs a parser, records "<Label> <message>" on failure, returns the value (or '' on error)
    parse: (field, label, parser, text, required = false) => {
      const result = parser(text)
      if (result.error) {
        errors.push({ field, message: `${label} ${result.error}` })
        return ''
      }
      if (required && result.value === '') errors.push({ field, message: `${label} is required` })
      return result.value
    },
  }
}

// Lines on which each key appears, for "duplicate in this file" messages
export const linesByKey = (rows, keyOf) => {
  const lines = new Map()
  for (const row of rows) {
    const key = keyOf(row)
    if (!key) continue
    lines.set(key, [...(lines.get(key) || []), row.line])
  }
  return lines
}

export const otherLines = (lines, line) => lines.filter(other => other !== line).join(', ')
