import { gql } from '@apollo/client'

// User Queries
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      first_name
      last_name
      other_name
      email
      role
      status
      lastLogin
      joinDate
      contact
      gender
      dob
      hasAccount
      fullName
      avatar
      account {
        id
        userId
        accountNumber
        balance
        status
        paidMembership
        hasLoan
        is_deleted
        deleted_at
      }
    }
  }

`;

export const GET_USER_BY_ID = gql`
query GetUserById($getUserByIdId: ID!) {
  getUserById(id: $getUserByIdId) {
    id
    first_name
    last_name
    other_name
    email
    role
    status
    lastLogin
    joinDate
    contact
    gender
    dob
    hasAccount
    fullName
    avatar
    account {
      id
      userId
      accountNumber
      balance
      status
      paidMembership
      hasLoan
      is_deleted
      deleted_at
      loans {
        id
        accountId
        amount
        interestRate
        status
        endDate
        startDate
        term
        purpose
        decisionNote
        summary {
          id
          loanId
          monthlyPayment
          totalInterest
          remainingBalance
        }
        createAt
        updateAt
      }
      transactions {
        id
        type
        amount
        accountId
        acountName
        status
        description
        loanId
        createdAt
        updateAt
      }
    }
  }
}

`;

// Account Queries
export const GET_ACCOUNTS = gql`
  query GetAccounts {
    getAccounts {
      id
      userId
      accountNumber
      balance
      status
      paidMembership
      hasLoan
      is_deleted
      deleted_at
      owner {
        avatar
id
        first_name
        last_name
        other_name
        email
        role
        status
        lastLogin
        joinDate
        contact
        gender
        dob
        hasAccount
        fullName
      }
      loans {
        id
        amount
        interestRate
        status
        endDate
        startDate
        term
        summary {
          id
          monthlyPayment
          totalInterest
          remainingBalance
        }
        createAt
        updateAt
      }
      transactions {
        id
        type
        amount
        status
        description
        loanId
        createdAt
        updateAt
      }
    }
  }
`;

export const GET_ACCOUNT_BY_ID = gql`
  query GetAccountById($getAccountByIdId: String!) {
    getAccountById(id: $getAccountByIdId) {
      id
      userId
      accountNumber
      balance
      status
      paidMembership
      hasLoan
      is_deleted
      deleted_at
      owner {
        avatar
id
        first_name
        last_name
        other_name
        email
        role
        status
        lastLogin
        joinDate
        contact
        gender
        dob
        hasAccount
        fullName
      }
      loans {
        id
        accountId
        amount
        interestRate
        status
        endDate
        startDate
        term
        summary {
          id
          monthlyPayment
          totalInterest
          remainingBalance
        }
        createAt
        updateAt
      }
      transactions {
        id
        type
        amount
        accountId
        acountName
        status
        description
        loanId
        createdAt
        updateAt
      }
    }
  }
`;

// Loan Queries
// Shared by GET_LOANS, CREATE_LOAN and UPDATE_LOAN so every loan in the store has the same shape
// (including account.owner, which the loans table and details modal display)
export const LOAN_FIELDS = gql`
  fragment LoanFields on Loan {
    id
    accountId
    amount
    interestRate
    status
    endDate
    startDate
    term
    summary {
      id
      loanId
      monthlyPayment
      totalInterest
      remainingBalance
    }
    createAt
    updateAt
    account {
      id
      userId
      accountNumber
      balance
      status
      paidMembership
      hasLoan
      is_deleted
      deleted_at
      owner {
        avatar
id
        first_name
        last_name
        other_name
        email
        role
        status
        lastLogin
        joinDate
        contact
        gender
        dob
        hasAccount
        fullName
      }
    }
  }
`;

export const GET_LOANS = gql`
  query GetLoans {
    getLoans {
      ...LoanFields
    }
  }
  ${LOAN_FIELDS}
`;

// export const GET_LOAN_BY_ID = gql`
//   query GetLoanById($getLoanByIdId: String!) {
//     getLoanById(id: $getLoanByIdId) {
//       id
//       accountId
//       amount
//       interestRate
//       status
//       endDate
//       startDate
//       term
//       summary {
//         id
//         loanId
//         monthlyPayment
//         totalInterest
//         remainingBalance
//       }
//       createAt
//       updateAt
//       account {
//         id
//         userId
//         accountNumber
//         balance
//         status
//         paidMembership
//         hasLoan
//         is_deleted
//         deleted_at
//         owner {
//           id
//           first_name
//           last_name
//           other_name
//           email
//           role
//           status
//           lastLogin
//           joinDate
//           contact
//           gender
//           dob
//           hasAccount
//           fullName
//         }
//       }
//     }
//   }
// `;

// Transaction Queries
// Shared by GET_TRANSACTIONS, CREATE_TRANSACTION and UPDATE_TRANSACTION so every transaction
// in the store carries the account owner's names (shown in the table and details modal)
export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    type
    amount
    accountId
    acountName
    status
    description
    loanId
    createdAt
    updateAt
    account {
      id
      accountNumber
      owner {
        avatar
id
        first_name
        last_name
        other_name
        fullName
      }
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// export const GET_TRANSACTION_BY_ID = gql`
//   query GetTransactionById($getTransactionByIdId: String!) {
//     getTransactionById(id: $getTransactionByIdId) {
//       id
//       type
//       amount
//       accountId
//       acountName
//       status
//       description
//       loanId
//       createdAt
//       updateAt
//     }
//   }
// `;

// Savings Queries
export const GET_SAVINGS_REPORT = gql`
  query GetSavingsReport($year: Int!, $month: Int) {
    getSavingsReport(year: $year, month: $month) {
      year
      month
      availableYears
      stats {
        totalSavings
        transactionCount
        pendingSavings
        pendingCount
        highestTotalSaved
        meanAmount
        medianAmount
      }
      members {
        accountId
        accountNumber
        memberName
        memberAvatar
        broughtForward
        months
        total
      }
      totals {
        broughtForward
        months
        total
      }
    }
  }
`

// Loan Payments Queries
export const GET_LOAN_PAYMENTS_REPORT = gql`
  query GetLoanPaymentsReport($year: Int!, $month: Int) {
    getLoanPaymentsReport(year: $year, month: $month) {
      year
      month
      availableYears
      stats {
        totalRepaid
        paymentCount
        pendingRepaid
        pendingCount
        outstandingBalance
        loansCompleted
      }
      loans {
        loanId
        accountNumber
        memberName
        memberAvatar
        loanAmount
        broughtForward
        months
        totalPaid
        remainingBalance
        status
        completedOn
      }
      totals {
        loanAmount
        broughtForward
        months
        totalPaid
        remainingBalance
      }
    }
  }
`

// The signed-in user
export const ME = gql`
  query Me {
    me {
      id
      first_name
      last_name
      other_name
      email
      role
      status
      contact
      gender
      dob
      joinDate
      fullName
      avatar
    }
  }
`

// Loan applications (member requests from the app) for the staff Applications page
export const GET_LOAN_APPLICATIONS = gql`
  query GetLoanApplications($status: LOANSTATUS) {
    getLoanApplications(status: $status) {
      id
      accountId
      amount
      interestRate
      term
      status
      purpose
      decisionNote
      decidedAt
      createdAt
      account {
        id
        accountNumber
        balance
        status
        paidMembership
        hasLoan
        owner {
          avatar
id
          first_name
          last_name
          other_name
        }
      }
    }
  }
`
