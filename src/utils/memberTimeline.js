import moment from 'moment'

// Month buckets use Kampala time (UTC+3, no daylight saving), like the Savings and Repayments reports
const local = (timestamp) => moment(timestamp).utcOffset(180)
const yearOf = (timestamp) => local(timestamp).year()
const monthIndexOf = (timestamp) => local(timestamp).month()

export const SAVINGS_IN = ['SAVINGS_DEPOSIT']
export const SAVINGS_OUT = ['ACCOUNT_WITHDRAW', 'CLOSURE_WITHDRAW', 'MEMBERSHIP_FEE']
export const APPLICATION_STATUSES = ['PENDING', 'REJECTED']
export const OPEN_LOAN_STATUSES = ['ACTIVE', 'DEFAULTED']

const completed = (transactions = []) => transactions.filter(tx => tx.status === 'COMPLETED')
const amountOf = (tx) => Number(tx.amount) || 0
const total = (transactions) => transactions.reduce((sum, tx) => sum + amountOf(tx), 0)

export const currentYear = () => local(new Date()).year()

// Years with any activity, plus the current year; newest first
export const activityYears = (transactions = [], loans = []) => {
  const years = new Set([currentYear()])
  transactions.forEach(tx => tx.createdAt && years.add(yearOf(tx.createdAt)))
  loans.forEach(loan => {
    if (loan.startDate) years.add(yearOf(loan.startDate))
  })
  return [...years].sort((a, b) => b - a)
}

// Savings for one year: balance brought forward, then money in / out per month and the running balance
export const savingsTimeline = (transactions = [], year) => {
  const done = completed(transactions)
  const before = done.filter(tx => yearOf(tx.createdAt) < year)
  const broughtForward = total(before.filter(tx => SAVINGS_IN.includes(tx.type)))
    - total(before.filter(tx => SAVINGS_OUT.includes(tx.type)))

  const months = Array.from({ length: 12 }, (_, index) => ({ index, deposits: 0, depositCount: 0, withdrawals: 0 }))
  done.filter(tx => yearOf(tx.createdAt) === year).forEach(tx => {
    const month = months[monthIndexOf(tx.createdAt)]
    if (SAVINGS_IN.includes(tx.type)) {
      month.deposits += amountOf(tx)
      month.depositCount += 1
    } else if (SAVINGS_OUT.includes(tx.type)) {
      month.withdrawals += amountOf(tx)
    }
  })

  let balance = broughtForward
  months.forEach(month => {
    month.net = month.deposits - month.withdrawals
    balance += month.net
    month.balance = balance
  })

  const deposits = months.reduce((sum, month) => sum + month.deposits, 0)
  const withdrawals = months.reduce((sum, month) => sum + month.withdrawals, 0)
  return {
    broughtForward,
    months,
    deposits,
    withdrawals,
    depositCount: months.reduce((sum, month) => sum + month.depositCount, 0),
    closingBalance: balance,
    peakDeposit: Math.max(0, ...months.map(month => month.deposits)),
  }
}

const monthKey = (date) => local(date).year() * 12 + local(date).month()

// Loans that matter in a year: started on or before it and still running in it, or paid something in it
export const loanTimelines = (loans = [], transactions = [], year) => {
  const payments = completed(transactions).filter(tx => tx.type === 'LOAN_PAYMENT')
  const nowKey = monthKey(new Date())

  return loans
    .map(loan => {
      const loanPayments = payments.filter(tx => tx.loanId === loan.id)
      const isApplication = APPLICATION_STATUSES.includes(loan.status)
      const startKey = monthKey(loan.startDate)
      const endKey = monthKey(loan.endDate)
      const owed = Number(loan.amount) + Number(loan.summary?.totalInterest || 0)
      const paidToDate = total(loanPayments)
      const lastPaymentKey = loanPayments.length ? Math.max(...loanPayments.map(tx => monthKey(tx.createdAt))) : null

      const months = Array.from({ length: 12 }, (_, index) => {
        const key = year * 12 + index
        const paid = total(loanPayments.filter(tx => monthKey(tx.createdAt) === key))
        // Repayments are due from the month after the start until the end month
        const due = !isApplication && key > startKey && key <= endKey
        let state = 'none'
        if (paid > 0) state = 'paid'
        else if (due && key < nowKey && OPEN_LOAN_STATUSES.includes(loan.status)) state = 'missed'
        else if (due && key >= nowKey && OPEN_LOAN_STATUSES.includes(loan.status)) state = 'upcoming'
        else if (due) state = 'due'
        return { index, paid, state }
      })

      const paidBefore = total(loanPayments.filter(tx => yearOf(tx.createdAt) < year))
      const paidInYear = months.reduce((sum, month) => sum + month.paid, 0)
      const yearStart = year * 12
      const yearEnd = yearStart + 11
      const runsInYear = startKey <= yearEnd && (
        OPEN_LOAN_STATUSES.includes(loan.status) ? true : endKey >= yearStart || (lastPaymentKey ?? -1) >= yearStart
      )
      const relevant = isApplication ? yearOf(loan.startDate) === year : runsInYear || paidInYear > 0

      return {
        loan,
        isApplication,
        owed,
        paidBefore,
        paidInYear,
        paidToDate,
        remaining: Number(loan.summary?.remainingBalance ?? Math.max(0, owed - paidToDate)),
        progress: owed > 0 ? Math.min(1, paidToDate / owed) : 0,
        months,
        relevant,
      }
    })
    .filter(item => item.relevant)
    .sort((a, b) => new Date(b.loan.startDate) - new Date(a.loan.startDate))
}

// Header figures for the selected year
export const memberFigures = (account, year) => {
  const transactions = account?.transactions || []
  const loans = account?.loans || []
  const done = completed(transactions).filter(tx => yearOf(tx.createdAt) === year)
  const openLoans = loans.filter(loan => OPEN_LOAN_STATUSES.includes(loan.status))
  return {
    balance: Number(account?.balance || 0),
    outstanding: openLoans.reduce((sum, loan) => sum + Number(loan.summary?.remainingBalance || 0), 0),
    monthlyDue: openLoans.reduce((sum, loan) => sum + Number(loan.summary?.monthlyPayment || 0), 0),
    openLoanCount: openLoans.length,
    savedInYear: total(done.filter(tx => SAVINGS_IN.includes(tx.type))),
    depositsInYear: done.filter(tx => SAVINGS_IN.includes(tx.type)).length,
    repaidInYear: total(done.filter(tx => tx.type === 'LOAN_PAYMENT')),
    paymentsInYear: done.filter(tx => tx.type === 'LOAN_PAYMENT').length,
    pendingApplication: loans.some(loan => loan.status === 'PENDING'),
  }
}

export const transactionsInYear = (transactions = [], year) => transactions
  .filter(tx => yearOf(tx.createdAt) === year)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
