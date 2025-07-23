import { gql } from '@apollo/client'


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
  mutation UpdateAccount($updateAccountId: String!, $balance: Int, $status: ACCOUNTSTATUS, $paidMembership: Boolean) {
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
  }
`;

export const UPDATE_LOAN = gql`
  mutation UpdateLoan($updateLoanId: String!, $accountId: String, $amount: Int, $interestRate: Float, $status: LOANSTATUS, $endDate: String, $startDate: String, $term: Int) {
  updateLoan(id: $updateLoanId, accountId: $accountId, amount: $amount, interestRate: $interestRate, status: $status, endDate: $endDate, startDate: $startDate, term: $term) {
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
    }
  }
}
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
`; 

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($updateTransactionId: String!, $type: TRANSACTIONTYPE, $amount: Float, $accountId: String, $status: TRANSACTIONSTATUS, $description: String, $loanId: String) {
  updateTransaction(id: $updateTransactionId, type: $type, amount: $amount, accountId: $accountId, status: $status, description: $description, loanId: $loanId) {
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
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($deleteTransactionId: String!) {
  deleteTransaction(id: $deleteTransactionId)
}
`;

export const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
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
    }
  }
}
`;