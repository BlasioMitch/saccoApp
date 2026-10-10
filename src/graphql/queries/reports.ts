import { gql } from '@apollo/client'

// Bookkeeping reports (staff). Dates are YYYY-MM-DD; amounts are whole UGX.
export const CASH_BOOK = gql`
  query CashBook($from: String, $to: String, $kind: String) {
    cashBook(from: $from, to: $to, kind: $kind) {
      from to opening closing totalIn totalOut truncated filtered
      lines { id date kind description member accountNumber inflow outflow balance }
    }
  }
`;

export const INCOME_STATEMENT = gql`
  query IncomeStatement($from: String, $to: String) {
    incomeStatement(from: $from, to: $to) {
      from to expensesRecorded
      income { code name amount }
      expenses { code name amount }
      totals { income expenses surplus }
      months { month feeIncome interestIncome total }
    }
  }
`;

export const TRIAL_BALANCE = gql`
  query TrialBalance($asAt: String) {
    trialBalance(asAt: $asAt) {
      asAt balanced
      rows { code name type debit credit }
      totals { debit credit }
    }
  }
`;

export const BALANCE_SHEET = gql`
  query BalanceSheet($asAt: String) {
    balanceSheet(asAt: $asAt) {
      asAt balanced
      assets { code name amount }
      liabilities { code name amount }
      equity { code name amount }
      totals { assets liabilities equity }
      savingsCheck { ledger accounts difference }
    }
  }
`;

export const LOAN_PORTFOLIO = gql`
  query LoanPortfolio($asAt: String) {
    loanPortfolio(asAt: $asAt) {
      asAt
      summary { loans openLoans disbursed repaid outstanding arrears loansInArrears portfolioAtRisk30 }
      byStatus { status count principal }
      aging { key label count outstanding arrears }
      loans {
        id member accountNumber principal interestRate term startDate endDate status
        owed interest monthlyPayment paid outstanding instalmentsDue expectedPaid arrears daysOverdue bucket
      }
    }
  }
`;
