import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AlertTriangle, CheckCircle2, Download, FileUp, Loader2, Trash2, X, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import client from '../../graphql/client'
import { BULK_CREATE_LOANS, BULK_CREATE_TRANSACTIONS, BULK_CREATE_USERS } from '../../graphql/mutations'
import { fetchUsers } from '../../reducers/userReducer'
import { fetchAccounts } from '../../reducers/accountsReducer'
import { downloadCsv, parseCsv, toCsv } from '../../utils/csv'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'

const BULK_MUTATIONS = {
  users: { mutation: BULK_CREATE_USERS, variable: 'users', field: 'bulkCreateUsers' },
  transactions: { mutation: BULK_CREATE_TRANSACTIONS, variable: 'transactions', field: 'bulkCreateTransactions' },
  loans: { mutation: BULK_CREATE_LOANS, variable: 'loans', field: 'bulkCreateLoans' },
}

const MAX_ROWS = 1000

const Count = ({ icon: Icon, tone, children }) => (
  <span className={cn('inline-flex items-center gap-1 text-sm font-medium', tone)}>
    <Icon className="h-4 w-4" />
    {children}
  </span>
)

/**
 * CSV import wizard: choose file -> review (validated in the browser; remove rows that can't be fixed)
 * -> submit valid rows -> per-row results from the server.
 * `config` is one of ./configs (columns, validate); `onImported` refreshes the page's list.
 */
const ImportDialog = ({ isOpen, onClose, config, onImported }) => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.users)
  const accounts = useSelector(state => state.accounts.accounts)
  const currentUser = useSelector(state => state.auth.user)
  const fileInput = useRef(null)

  const [step, setStep] = useState('choose') // choose | review | submitting | results
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState([])
  const [headerProblems, setHeaderProblems] = useState({ missing: [], unknown: [] })
  const [showProblemsOnly, setShowProblemsOnly] = useState(false)
  const [results, setResults] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Uniqueness and eligibility are checked against current server data
  useEffect(() => {
    if (!isOpen) return
    setStep('choose')
    setRows([])
    setResults(null)
    setFileName('')
    setShowProblemsOnly(false)
    dispatch(fetchUsers())
    dispatch(fetchAccounts())
  }, [isOpen, dispatch])

  // Re-validated whenever rows are removed, so "duplicate on line N" clears once one copy is gone
  const validated = useMemo(
    () => config.validate(rows, { users, accounts, currentUser: { ...currentUser, role: currentUser?.role?.toUpperCase() } }),
    [config, rows, users, accounts, currentUser]
  )
  const invalidCount = validated.filter(row => row.errors.length).length
  const warningCount = validated.filter(row => !row.errors.length && row.warnings.length).length
  const visibleRows = showProblemsOnly ? validated.filter(row => row.errors.length || row.warnings.length) : validated
  const canSubmit = validated.length > 0 && invalidCount === 0 && headerProblems.missing.length === 0

  const loadFile = async (file) => {
    if (!file) return
    if (!/\.csv$/i.test(file.name)) {
      toast.error('Please choose a .csv file')
      return
    }
    const text = await file.text()
    const parsed = parseCsv(text, config.columns)
    if (parsed.rows.length > MAX_ROWS) {
      toast.error(`At most ${MAX_ROWS} rows per import; this file has ${parsed.rows.length}`)
      return
    }
    setFileName(file.name)
    setRows(parsed.rows)
    setHeaderProblems({ missing: parsed.missingHeaders, unknown: parsed.unknownHeaders })
    setShowProblemsOnly(false)
    setStep('review')
  }

  const removeRow = (line) => setRows(current => current.filter(row => row.line !== line))
  const removeInvalidRows = () => {
    const invalid = new Set(validated.filter(row => row.errors.length).map(row => row.line))
    setRows(current => current.filter(row => !invalid.has(row.line)))
    setShowProblemsOnly(false)
  }

  const downloadTemplate = () => {
    const example = Object.fromEntries(config.columns.map(column => [column.key, column.example ?? '']))
    downloadCsv(config.templateName, toCsv([example], config.columns))
  }

  const submit = async () => {
    // Transactions are saved in date order so balances build up as validated
    const ordered = [...validated].sort((a, b) => (a.sortKey ?? '').localeCompare(b.sortKey ?? '') || a.line - b.line)
    const { mutation, variable, field } = BULK_MUTATIONS[config.key]
    setStep('submitting')
    try {
      const { data } = await client.mutate({ mutation, variables: { [variable]: ordered.map(row => row.payload) } })
      const outcome = data[field].map(result => ({ ...result, source: ordered[result.row] }))
      setResults(outcome)
      setStep('results')
      const created = outcome.filter(result => result.ok).length
      if (created) onImported?.()
      toast[created === outcome.length ? 'success' : 'warning'](`${created} of ${outcome.length} ${config.noun}s imported`)
    } catch (error) {
      toast.error(error?.message || 'Import failed')
      setStep('review')
    }
  }

  const downloadFailedRows = () => {
    const failed = results.filter(result => !result.ok)
    const columns = [...config.columns, { key: 'error' }]
    downloadCsv(`failed-${config.templateName}`, toCsv(failed.map(result => ({ ...result.source.values, error: result.error })), columns))
  }

  if (!isOpen) return null

  const createdCount = results?.filter(result => result.ok).length ?? 0
  const failedResults = results?.filter(result => !result.ok) ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="flex h-full max-h-[calc(100vh-48px)] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary shadow-2xl">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-6 text-custom-text-primary">{config.title}</h2>
            {fileName && <p className="truncate text-xs text-custom-text-secondary">{fileName}</p>}
          </div>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Choose file */}
        {step === 'choose' && (
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
            <label
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); loadFile(e.dataTransfer.files?.[0]) }}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                isDragging ? 'border-custom-brand-primary bg-custom-interactive-focus' : 'border-custom-bg-tertiary hover:bg-custom-interactive-hover'
              )}
            >
              <FileUp className="h-8 w-8 text-custom-brand-primary" />
              <span className="text-base font-semibold text-custom-text-primary">Drop a CSV file here, or click to choose</span>
              <span className="text-sm text-custom-text-secondary">Up to {MAX_ROWS} rows. Every row is checked before anything is saved.</span>
              <input ref={fileInput} type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = '' }} />
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-custom-text-primary">Columns</h3>
                <Button variant="secondary" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4" />
                  Download template
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-custom-bg-tertiary">
                <table className="w-full text-left text-sm">
                  <thead className="bg-custom-bg-secondary text-xs uppercase tracking-wide text-custom-text-secondary">
                    <tr>
                      <th className="h-10 px-4">Column</th>
                      <th className="h-10 px-4">Required</th>
                      <th className="h-10 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.columns.map(column => (
                      <tr key={column.key} className="border-t border-custom-bg-tertiary">
                        <td className="h-10 px-4 font-mono text-custom-text-primary">{column.key}</td>
                        <td className="h-10 px-4 text-custom-text-secondary">{column.required ? 'Yes' : 'No'}</td>
                        <td className="h-10 px-4 text-custom-text-secondary">{column.hint || column.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Review */}
        {step === 'review' && (
          <>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-custom-bg-tertiary px-6 py-2">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-custom-text-secondary">{validated.length} rows</span>
                <Count icon={CheckCircle2} tone="text-green-600 dark:text-green-400">{validated.length - invalidCount} valid</Count>
                <Count icon={XCircle} tone="text-red-600 dark:text-red-400">{invalidCount} with problems</Count>
                {warningCount > 0 && <Count icon={AlertTriangle} tone="text-yellow-700 dark:text-yellow-400">{warningCount} warnings</Count>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowProblemsOnly(!showProblemsOnly)}>
                  {showProblemsOnly ? 'Show all rows' : 'Show problems only'}
                </Button>
                <Button variant="secondary" size="sm" onClick={removeInvalidRows} disabled={invalidCount === 0}>
                  <Trash2 className="h-4 w-4" />
                  Remove all invalid rows
                </Button>
                <Button variant="ghost" size="sm" onClick={() => fileInput.current?.click()}>Choose another file</Button>
                <input ref={fileInput} type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = '' }} />
              </div>
            </div>

            {headerProblems.missing.length > 0 && (
              <p className="shrink-0 border-b border-custom-bg-tertiary bg-red-500/10 px-6 py-2 text-sm text-red-700 dark:text-red-400">
                Missing required column{headerProblems.missing.length > 1 ? 's' : ''}: <span className="font-mono">{headerProblems.missing.join(', ')}</span>. Fix the header row and choose the file again.
              </p>
            )}
            {headerProblems.unknown.length > 0 && (
              <p className="shrink-0 border-b border-custom-bg-tertiary px-6 py-2 text-xs text-custom-text-secondary">
                Ignored columns: <span className="font-mono">{headerProblems.unknown.join(', ')}</span>
              </p>
            )}

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    {['Line', 'Status', ...config.columns.map(column => column.label), ''].map((label, index) => (
                      <th key={index} className="sticky top-0 z-10 h-10 whitespace-nowrap border-b border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-left text-xs font-medium uppercase tracking-wide text-custom-text-secondary">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map(row => {
                    const badFields = new Set(row.errors.map(issue => issue.field))
                    const warnFields = new Set(row.warnings.map(issue => issue.field))
                    return (
                      <tr key={row.line} className={row.errors.length ? 'bg-red-500/5' : ''}>
                        <td className="whitespace-nowrap border-b border-custom-bg-tertiary px-4 py-2 align-top tabular-nums text-custom-text-secondary">{row.line}</td>
                        <td className="min-w-64 border-b border-custom-bg-tertiary px-4 py-2 align-top">
                          {row.errors.length === 0 && row.warnings.length === 0 && (
                            <Count icon={CheckCircle2} tone="text-green-600 dark:text-green-400">Ready</Count>
                          )}
                          <ul className="space-y-1">
                            {row.errors.map((issue, index) => (
                              <li key={`e${index}`} className="text-xs text-red-700 dark:text-red-400">{issue.message}</li>
                            ))}
                            {row.warnings.map((issue, index) => (
                              <li key={`w${index}`} className="text-xs text-yellow-700 dark:text-yellow-400">{issue.message}</li>
                            ))}
                          </ul>
                        </td>
                        {config.columns.map(column => (
                          <td
                            key={column.key}
                            className={cn(
                              'whitespace-nowrap border-b border-custom-bg-tertiary px-4 py-2 align-top text-custom-text-primary',
                              badFields.has(column.key) && 'bg-red-500/10 font-medium text-red-700 dark:text-red-400',
                              !badFields.has(column.key) && warnFields.has(column.key) && 'bg-yellow-500/10'
                            )}
                          >
                            {row.values[column.key] || <span className="text-custom-text-muted">–</span>}
                          </td>
                        ))}
                        <td className="border-b border-custom-bg-tertiary px-2 py-1 align-top">
                          <Button variant="ghost" size="icon" onClick={() => removeRow(row.line)} aria-label={`Remove line ${row.line}`} title="Remove row">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {visibleRows.length === 0 && (
                <p className="p-8 text-center text-sm text-custom-text-secondary">
                  {validated.length ? 'No problems left.' : 'No rows left to import.'}
                </p>
              )}
            </div>

            <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-t border-custom-bg-tertiary px-6">
              <p className="text-sm text-custom-text-secondary">
                {invalidCount
                  ? `Fix or remove the ${invalidCount} row${invalidCount === 1 ? '' : 's'} with problems to continue.`
                  : 'All rows passed validation.'}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={submit} disabled={!canSubmit}>
                  Import {validated.length} {config.noun}{validated.length === 1 ? '' : 's'}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'submitting' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-custom-brand-primary" />
            <p className="text-sm text-custom-text-secondary">Saving {validated.length} {config.noun}s…</p>
          </div>
        )}

        {/* Results */}
        {step === 'results' && results && (
          <>
            <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-custom-bg-tertiary px-6 py-4">
              <Count icon={CheckCircle2} tone="text-green-600 dark:text-green-400">{createdCount} created</Count>
              <Count icon={XCircle} tone="text-red-600 dark:text-red-400">{failedResults.length} failed</Count>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-6">
              {failedResults.length === 0 ? (
                <p className="text-sm text-custom-text-secondary">Every row was imported.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-custom-text-secondary">
                    <tr>
                      <th className="h-10 px-4">Line</th>
                      <th className="h-10 px-4">Row</th>
                      <th className="h-10 px-4">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedResults.map(result => (
                      <tr key={result.source.line} className="border-t border-custom-bg-tertiary">
                        <td className="h-10 px-4 tabular-nums text-custom-text-secondary">{result.source.line}</td>
                        <td className="h-10 px-4 text-custom-text-primary">
                          {config.columns.slice(0, 3).map(column => result.source.values[column.key]).filter(Boolean).join(' · ')}
                        </td>
                        <td className="h-10 px-4 text-red-700 dark:text-red-400">{result.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex h-16 shrink-0 items-center justify-end gap-2 border-t border-custom-bg-tertiary px-6">
              {failedResults.length > 0 && (
                <Button variant="secondary" onClick={downloadFailedRows}>
                  <Download className="h-4 w-4" />
                  Download failed rows
                </Button>
              )}
              <Button onClick={onClose}>Done</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ImportDialog
