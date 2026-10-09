import { linesByKey, otherLines, parseAmount, parseDate, parseNumber, rowIssues } from './common'
import { addMonths, termInMonths } from '../../../utils/loanTerms'
import { openLoans } from '../../../utils/transactionRules'

const normalizeAccountNumber = (value) => String(value || '').trim().toUpperCase()

export default {
  key: 'loans',
  title: 'Import Loans',
  noun: 'loan',
  templateName: 'loans-import-template.csv',
  columns: [
    { key: 'account_number', label: 'Account Number', required: true, aliases: ['account', 'account_no'], example: 'JD-1234567' },
    { key: 'amount', label: 'Amount', required: true, aliases: ['principal'], example: '1000000', hint: 'Whole shillings' },
    { key: 'interest_rate', label: 'Interest Rate (%)', required: true, aliases: ['interest', 'rate'], example: '12.5' },
    { key: 'start_date', label: 'Start Date', required: true, example: '2026-01-10', hint: 'YYYY-MM-DD' },
    { key: 'end_date', label: 'End Date', example: '2026-07-10', hint: 'End date or term months' },
    { key: 'term_months', label: 'Term (months)', aliases: ['term', 'months'], example: '', hint: 'Whole months, if no end date' },
  ],

  // ctx: { accounts } (with loans). One loan per account: an account with an open loan, or repeated in the file, is flagged.
  validate(rows, { accounts = [] } = {}) {
    const byNumber = new Map(accounts.map(account => [normalizeAccountNumber(account.accountNumber), account]))
    const accountLines = linesByKey(rows, row => normalizeAccountNumber(row.values.account_number))

    return rows.map(row => {
      const v = row.values
      const issues = rowIssues()

      const number = normalizeAccountNumber(v.account_number)
      const account = byNumber.get(number)
      if (!number) issues.error('account_number', 'Account Number is required')
      else if (!account) issues.error('account_number', `Account ${v.account_number} was not found`)
      else if (account.hasLoan || openLoans(account).length) issues.error('account_number', 'This account already has an open loan')
      else if (accountLines.get(number).length > 1) issues.error('account_number', `Only one loan per account (also on line ${otherLines(accountLines.get(number), row.line)})`)

      const amount = issues.parse('amount', 'Amount', parseAmount, v.amount, true)
      if (amount === 0) issues.error('amount', 'Amount must be greater than 0')
      const interestRate = issues.parse('interest_rate', 'Interest Rate', parseNumber, v.interest_rate, true)
      if (interestRate !== '' && !(interestRate > 0 && interestRate <= 100)) issues.error('interest_rate', 'Interest Rate must be between 0 and 100')

      const startDate = issues.parse('start_date', 'Start Date', parseDate, v.start_date, true)
      let endDate = issues.parse('end_date', 'End Date', parseDate, v.end_date)
      const termText = String(v.term_months || '').trim()
      const typedTerm = termText === '' ? null : Number(termText)
      if (typedTerm !== null && !(Number.isInteger(typedTerm) && typedTerm >= 1)) {
        issues.error('term_months', 'Term must be a whole number of months, at least 1')
      }

      let term = 0
      if (startDate) {
        if (endDate) {
          term = termInMonths(startDate, endDate)
          if (term < 1) issues.error('end_date', 'End Date must be after Start Date')
          else if (typedTerm && typedTerm !== term) issues.error('term_months', `Term (${typedTerm}) disagrees with the dates (${term} months)`)
        } else if (typedTerm && Number.isInteger(typedTerm) && typedTerm >= 1) {
          term = typedTerm
          endDate = addMonths(startDate, term)
        } else if (typedTerm === null) {
          issues.error('end_date', 'Give an End Date or a Term in months')
        }
      }

      return {
        ...row,
        errors: issues.errors,
        warnings: issues.warnings,
        payload: {
          accountId: account?.id,
          amount,
          interestRate,
          term,
          status: 'ACTIVE',
          startDate,
          endDate,
        },
      }
    })
  },
}
