import { gql } from '@apollo/client'
import { LOAN_FIELDS, TRANSACTION_FIELDS } from '../queries'


// User Mutations
export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput) {
    createUser(user: $user) {
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
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserId: ID!, $updateData: UserUpdateInput) {
    updateUser(id: $updateUserId, updateData: $updateData) {
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
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID!) {
  deleteUser(id: $deleteUserId)
}
`;

// Account Mutations
export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($account: AccountInput) {
    createAccount(account: $account) {
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
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($updateAccountId: String!, $balance: Money, $status: ACCOUNTSTATUS, $paidMembership: Boolean) {
  updateAccount(id: $updateAccountId, balance: $balance, status: $status, paidMembership: $paidMembership) {
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
`;

export const DELETE_ACCOUNT = gql`
mutation DeleteAccount($deleteAccountId: String!) {
  deleteAccount(id: $deleteAccountId)
}
`;

// Loan Mutations
export const CREATE_LOAN = gql`
  mutation CreateLoan($loan: LoanInput) {
    createLoan(loan: $loan) {
      ...LoanFields
    }
  }
  ${LOAN_FIELDS}
`;

export const UPDATE_LOAN = gql`
  mutation UpdateLoan($updateLoanId: String!, $accountId: String, $amount: Money, $interestRate: Float, $status: LOANSTATUS, $endDate: String, $startDate: String, $term: Int) {
  updateLoan(id: $updateLoanId, accountId: $accountId, amount: $amount, interestRate: $interestRate, status: $status, endDate: $endDate, startDate: $startDate, term: $term) {
      ...LoanFields
    }
  }
  ${LOAN_FIELDS}
`;

export const DELETE_LOAN = gql`
  mutation DeleteLoan($deleteLoanId: String!) {
  deleteLoan(id: $deleteLoanId)
}
`;

// Transaction Mutations
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($transaction: TransactionInput) {
    createTransaction(transaction: $transaction) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`; 

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($updateTransactionId: String!, $type: TRANSACTIONTYPE, $amount: Money, $accountId: String, $status: TRANSACTIONSTATUS, $description: String, $loanId: String) {
  updateTransaction(id: $updateTransactionId, type: $type, amount: $amount, accountId: $accountId, status: $status, description: $description, loanId: $loanId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($deleteTransactionId: String!) {
  deleteTransaction(id: $deleteTransactionId)
}
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    message
    token
    user {
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
    }
  }
}
`;

export const LOGOUT = gql`
  mutation Logout {
  logout
}
`
// Bulk CSV import: per-row results ({ row, ok, id, error }), row = index in the submitted list
export const BULK_CREATE_USERS = gql`
  mutation BulkCreateUsers($users: [UserInput!]!) {
    bulkCreateUsers(users: $users) { row ok id error }
  }
`;
export const BULK_CREATE_TRANSACTIONS = gql`
  mutation BulkCreateTransactions($transactions: [BulkTransactionInput!]!) {
    bulkCreateTransactions(transactions: $transactions) { row ok id error }
  }
`;
export const BULK_CREATE_LOANS = gql`
  mutation BulkCreateLoans($loans: [LoanInput!]!) {
    bulkCreateLoans(loans: $loans) { row ok id error }
  }
`;

// The signed-in user's own profile (id comes from the session on the server)
export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($input: ProfileInput!) {
    updateMyProfile(input: $input) {
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
`;

// Manager decisions on loan applications
export const APPROVE_LOAN = gql`
  mutation ApproveLoan($id: String!, $interestRate: Float, $startDate: String, $note: String) {
    approveLoan(id: $id, interestRate: $interestRate, startDate: $startDate, note: $note) {
      id
      status
      interestRate
      startDate
      endDate
    }
  }
`;
export const PAY_LOAN_FROM_SAVINGS = gql`
  mutation PayLoanFromSavings($id: String!, $amount: Money!) {
    payLoanFromSavings(id: $id, amount: $amount) {
      withdrawal { id type amount status accountId createdAt }
      payment { id type amount status accountId loanId createdAt }
      loan { id status summary { remainingBalance } }
    }
  }
`;
export const REJECT_LOAN = gql`
  mutation RejectLoan($id: String!, $reason: String!) {
    rejectLoan(id: $id, reason: $reason) {
      id
      status
      decisionNote
    }
  }
`;
