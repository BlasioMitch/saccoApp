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
export const GET_LOANS = gql`
  query GetLoans {
    getLoans {
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
  }
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
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
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
          fullName
          id
        }
      }
    }
  }
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
