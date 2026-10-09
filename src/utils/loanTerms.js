import moment from 'moment'

// Loan term rules shared by the loan form and the CSV importer

export const DATE_FORMAT = 'YYYY-MM-DD'

// Payment periods between two dates; a partial month counts as a period (31 Jan -> 28 Feb is 1 month)
export const termInMonths = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const months = moment(endDate).diff(moment(startDate), 'months', true)
  return months > 0 ? Math.ceil(months - 1e-9) : 0
}

export const addMonths = (date, months) => moment(date).add(months, 'months').format(DATE_FORMAT)

// Same rounding as the backend (saccoback/src/lib/utils.ts), so previews match what is saved
export const summarize = (amount, interestRate, term) => {
  const totalInterest = Math.round(amount * interestRate / 100)
  return {
    totalInterest,
    totalDue: amount + totalInterest,
    monthlyPayment: term > 0 ? Math.ceil((amount + totalInterest) / term) : 0,
  }
}
