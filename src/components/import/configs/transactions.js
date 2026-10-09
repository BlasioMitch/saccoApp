import moment from 'moment'
import { parseAmount, parseDate, parseEnum, rowIssues } from './common'
import { DATE_FORMAT } from '../../../utils/loanTerms'
import { openLoans, TransactionType, TransactionStatus, TYPE_OPTIONS, typeLabel } from '../../../utils/transactionRules'

const TYPES = [
  ...TYPE_OPTIONS.map(option => ({
    ...option,
    aliases: {
      [TransactionType.SAVINGS_DEPOSIT]: ['Deposit', 'Savings'],
      [TransactionType.MEMBERSHIP_FEE]: ['Membership'],
      [TransactionType.LOAN_PAYMENT]: ['Loan Repayment', 'Repayment'],
      [TransactionType.ACCOUNT_WITHDRAW]: ['Withdraw', 'Withdrawal'],
      [TransactionType.CLOSURE_WITHDRAW]: ['Closure'],
    }[option.value],
  })),
]

const normalizeAccountNumber = (value) => String(value || '').trim().toUpperCase()

// A dated row is recorded mid-morning Kampala time, so it lands in the right month of the timelines
const toCreatedAt = (date) => `${date}T09:00:00+03:00`

export default {
  key: 'transactions',
  title: 'Import Transactions',
  noun: 'transaction',
  templateName: 'transactions-import-template.csv',
  columns: [
    { key: 'account_number', label: 'Account Number', required: true, aliases: ['account', 'account_no'], example: 'JD-1234567' },
    { key: 'type', label: 'Type', required: true, example: 'Savings Deposit', hint: TYPE_OPTIONS.map(option => option.label).join(' / ') },
    { key: 'amount', label: 'Amount', required: true, example: '50000', hint: 'Whole shillings, e.g. 50000 or "UGX 50,000"' },
    { key: 'date', label: 'Date', aliases: ['transaction_date'], example: '2026-01-15', hint: 'Optional, YYYY-MM-DD, not in the future (blank = today)' },
  ],

  // ctx: { accounts } (with loans and their summaries). Rows are checked in date order so balances,
  // membership and loan repayments build up exactly as they will when saved.
  validate(rows, { accounts = [] } = {}) {
    const byNumber = new Map(accounts.map(account => [normalizeAccountNumber(account.accountNumber), account]))
    const today = moment().format(DATE_FORMAT)

    const parsed = rows.map(row => {
      const v = row.values
      const issues = rowIssues()
      const account = byNumber.get(normalizeAccountNumber(v.account_number))
      if (!v.account_number) issues.error('account_number', 'Account Number is required')
      else if (!account) issues.error('account_number', `Account ${v.account_number} was not found`)

      const type = issues.parse('type', 'Type', (text) => parseEnum(text, TYPES), v.type, true)
      const amount = issues.parse('amount', 'Amount', parseAmount, v.amount, true)
      if (amount === 0) issues.error('amount', 'Amount must be greater than 0')
      const date = issues.parse('date', 'Date', parseDate, v.date) || today
      if (date > today) issues.error('date', 'Date cannot be in the future')

      return { row, issues, account, type, amount, date }
    })

    // Running state per account, starting from what is saved today
    const state = new Map()
    const stateOf = (account) => {
      if (!state.has(account.id)) {
        const loan = openLoans(account)[0]
        state.set(account.id, {
          balance: Number(account.balance) || 0,
          paidMembership: Boolean(account.paidMembership),
          loan,
          loanRemaining: Number(loan?.summary?.remainingBalance) || 0,
        })
      }
      return state.get(account.id)
    }

    const loanIds = new Map()
    const inDateOrder = parsed
      .map((item, index) => ({ item, index }))
      .sort((a, b) => (a.item.date < b.item.date ? -1 : a.item.date > b.item.date ? 1 : a.index - b.index))

    for (const { item } of inDateOrder) {
      const { issues, account, type, amount } = item
      if (issues.errors.length || !account) continue
      const current = stateOf(account)

      if (type === TransactionType.SAVINGS_DEPOSIT) {
        if (account.status !== 'ACTIVE') issues.error('account_number', 'Deposits need an active account')
        else current.balance += amount
      } else if (type === TransactionType.MEMBERSHIP_FEE) {
        if (current.paidMembership) issues.error('type', 'Membership fee is already paid for this account')
        else {
          current.paidMembership = true
          current.balance -= amount
        }
      } else if (type === TransactionType.LOAN_PAYMENT) {
        if (!current.loan) issues.error('type', 'This account has no open loan to repay')
        else {
          loanIds.set(item, current.loan.id)
          if (amount > current.loanRemaining) issues.warn('amount', `More than the ${current.loanRemaining.toLocaleString()} still owed`)
          current.loanRemaining = Math.max(0, current.loanRemaining - amount)
        }
      } else {
        if (type === TransactionType.ACCOUNT_WITHDRAW && account.status !== 'ACTIVE') {
          issues.error('account_number', 'Withdrawals need an active account')
        } else if (type === TransactionType.CLOSURE_WITHDRAW && current.loan) {
          issues.error('type', 'Close the open loan before a closure withdrawal')
        } else if (amount > current.balance) {
          issues.error('amount', `${typeLabel(type)} exceeds the ${current.balance.toLocaleString()} available at that date`)
        } else {
          current.balance -= amount
        }
      }
    }

    return parsed.map(item => ({
      ...item.row,
      errors: item.issues.errors,
      warnings: item.issues.warnings,
      sortKey: item.date,
      payload: {
        accountId: item.account?.id,
        type: item.type,
        amount: item.amount,
        status: TransactionStatus.COMPLETED,
        ...(loanIds.has(item) && { loanId: loanIds.get(item) }),
        ...(item.date !== today && { createdAt: toCreatedAt(item.date) }),
      },
    }))
  },
}
