// Minimal RFC 4180 CSV support (no dependency): quoted fields, "" escapes, CRLF/LF, BOM, blank lines.

// Returns an array of rows, each an array of raw string cells
export const parseCsvRows = (text) => {
  const input = String(text ?? '').replace(/^﻿/, '')
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (inQuotes) {
      if (char === '"' && input[i + 1] === '"') {
        cell += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        cell += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  // Drop blank lines (a single empty cell)
  return rows.filter(cells => cells.some(value => value.trim() !== ''))
}

// "First Name", "first-name" and "FIRST_NAME" all become "first_name"
export const normalizeHeader = (header) => String(header).trim().toLowerCase().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '')

/**
 * Parses CSV text into objects keyed by canonical column keys.
 * columns: [{ key, aliases?: [] }]. Unknown headers are ignored; `line` is the 1-based CSV line number.
 */
export const parseCsv = (text, columns) => {
  const [headerRow, ...dataRows] = parseCsvRows(text)
  if (!headerRow) return { rows: [], missingHeaders: columns.map(column => column.key), unknownHeaders: [] }

  const lookup = new Map()
  for (const column of columns) {
    for (const name of [column.key, ...(column.aliases || [])]) lookup.set(normalizeHeader(name), column.key)
  }
  const keys = headerRow.map(header => lookup.get(normalizeHeader(header)) || null)
  const present = new Set(keys.filter(Boolean))

  return {
    rows: dataRows.map((cells, index) => {
      const values = {}
      keys.forEach((key, column) => {
        if (key) values[key] = (cells[column] ?? '').trim()
      })
      return { line: index + 2, values }
    }),
    missingHeaders: columns.filter(column => column.required && !present.has(column.key)).map(column => column.key),
    unknownHeaders: headerRow.filter((_, column) => !keys[column]),
  }
}

const escapeCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

// rows: array of objects; columns: [{ key }] (header = key)
export const toCsv = (rows, columns) => [
  columns.map(column => escapeCell(column.key)).join(','),
  ...rows.map(row => columns.map(column => escapeCell(row[column.key])).join(',')),
].join('\r\n') + '\r\n'

// Browser download of CSV text
export const downloadCsv = (filename, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
