// Transaction business rules shared by the New Transaction form and the CSV importer

export const TransactionType = {
  LOAN_PAYMENT: 'LOAN_PAYMENT',
  MEMBERSHIP_FEE: 'MEMBERSHIP_FEE',
  SAVINGS_DEPOSIT: 'SAVINGS_DEPOSIT',
  ACCOUNT_WITHDRAW: 'ACCOUNT_WITHDRAW',
  CLOSURE_WITHDRAW: 'CLOSURE_WITHDRAW'
}

export const TransactionStatus = {
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  FAILED: 'FAILED'
}

export const MEMBERSHIP_FEE_AMOUNT = 20_000

export const TYPE_OPTIONS = [
  { value: TransactionType.SAVINGS_DEPOSIT, label: 'Savings Deposit' },
  { value: TransactionType.MEMBERSHIP_FEE, label: 'Membership Fee' },
  { value: TransactionType.LOAN_PAYMENT, label: 'Loan Payment' },
  { value: TransactionType.ACCOUNT_WITHDRAW, label: 'Account Withdraw' },
  { value: TransactionType.CLOSURE_WITHDRAW, label: 'Closure Withdraw' },
]

export const typeLabel = (type) => TYPE_OPTIONS.find(option => option.value === type)?.label || type

export const openLoans = (account) => (account?.loans || []).filter(loan => loan.status === 'ACTIVE' || loan.status === 'DEFAULTED')

// Which accounts can take each transaction type
export const ELIGIBILITY = {
  [TransactionType.SAVINGS_DEPOSIT]: (account) => account.status === 'ACTIVE',
  [TransactionType.MEMBERSHIP_FEE]: (account) => !account.paidMembership,
  [TransactionType.LOAN_PAYMENT]: (account) => openLoans(account).length > 0,
  [TransactionType.ACCOUNT_WITHDRAW]: (account) => account.status === 'ACTIVE' && Number(account.balance) > 0,
  [TransactionType.CLOSURE_WITHDRAW]: (account) => account.status !== 'CLOSED' && openLoans(account).length === 0,
}

export const isWithdrawal = (type) => type === TransactionType.ACCOUNT_WITHDRAW || type === TransactionType.CLOSURE_WITHDRAW

// Suggested payment: one instalment, never more than what is still owed
export const loanPaymentDefault = (loan) => {
  const monthly = Number(loan?.summary?.monthlyPayment) || 0
  const remaining = Number(loan?.summary?.remainingBalance) || 0
  if (monthly && remaining) return Math.min(monthly, remaining)
  return monthly || remaining || ''
}

// Paying from savings defaults to clearing the loan, as far as the savings allow
export const savingsPaymentDefault = (loan, account) => {
  const remaining = Number(loan?.summary?.remainingBalance) || 0
  const balance = Number(account?.balance) || 0
  return Math.min(remaining, balance) || ''
}

export const defaultAmount = (type, loan, account) => {
  if (type === TransactionType.MEMBERSHIP_FEE) return MEMBERSHIP_FEE_AMOUNT
  if (type === TransactionType.LOAN_PAYMENT) return loanPaymentDefault(loan)
  // Closing an account pays out everything that is left
  if (type === TransactionType.CLOSURE_WITHDRAW) return Number(account?.balance) || ''
  return ''
}
