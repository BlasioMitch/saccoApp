/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum Accountstatus {
  Active = 'ACTIVE',
  Closed = 'CLOSED',
  Inactive = 'INACTIVE'
}

export type Account = {
  __typename?: 'Account';
  accountNumber: Scalars['String']['output'];
  balance: Scalars['Int']['output'];
  deleted_at?: Maybe<Scalars['String']['output']>;
  hasLoan: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  is_deleted?: Maybe<Scalars['Boolean']['output']>;
  loans?: Maybe<Array<Maybe<Loan>>>;
  owner?: Maybe<User>;
  paidMembership: Scalars['Boolean']['output'];
  status: Accountstatus;
  transactions?: Maybe<Array<Maybe<Transaction>>>;
  userId: Scalars['String']['output'];
};

export type AccountInput = {
  balance?: InputMaybe<Scalars['Int']['input']>;
  paidMembership?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Accountstatus>;
  userId: Scalars['String']['input'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

export enum Loanstatus {
  Active = 'ACTIVE',
  Defaulted = 'DEFAULTED',
  Paid = 'PAID'
}

export type Loan = {
  __typename?: 'Loan';
  account?: Maybe<Account>;
  accountId: Scalars['String']['output'];
  amount: Scalars['Int']['output'];
  createAt?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  interestRate: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  status: Loanstatus;
  summary?: Maybe<LoanSummary>;
  term: Scalars['Int']['output'];
  updateAt?: Maybe<Scalars['String']['output']>;
};

export type LoanInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Int']['input'];
  endDate: Scalars['String']['input'];
  interestRate: Scalars['Float']['input'];
  startDate: Scalars['String']['input'];
  status: Loanstatus;
  term: Scalars['Int']['input'];
};

export type LoanSummary = {
  __typename?: 'LoanSummary';
  id: Scalars['String']['output'];
  loanId?: Maybe<Scalars['String']['output']>;
  monthlyPayment?: Maybe<Scalars['Float']['output']>;
  remainingBalance?: Maybe<Scalars['Float']['output']>;
  totalInterest?: Maybe<Scalars['Float']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount?: Maybe<Account>;
  createLoan?: Maybe<Loan>;
  createTransaction?: Maybe<Transaction>;
  createUser?: Maybe<User>;
  deleteAccount?: Maybe<Scalars['String']['output']>;
  deleteLoan?: Maybe<Scalars['String']['output']>;
  deleteTransaction?: Maybe<Scalars['String']['output']>;
  deleteUser?: Maybe<Scalars['String']['output']>;
  login?: Maybe<AuthPayload>;
  updateAccount?: Maybe<Account>;
  updateLoan?: Maybe<Loan>;
  updateTransaction?: Maybe<Transaction>;
  updateUser?: Maybe<User>;
};


export type MutationCreateAccountArgs = {
  account?: InputMaybe<AccountInput>;
};


export type MutationCreateLoanArgs = {
  loan?: InputMaybe<LoanInput>;
};


export type MutationCreateTransactionArgs = {
  transaction?: InputMaybe<TransactionInput>;
};


export type MutationCreateUserArgs = {
  user?: InputMaybe<UserInput>;
};


export type MutationDeleteAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteLoanArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateAccountArgs = {
  balance?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['String']['input'];
  paidMembership?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Accountstatus>;
};


export type MutationUpdateLoanArgs = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Loanstatus>;
  term?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateTransactionArgs = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  loanId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Transactionstatus>;
  type?: InputMaybe<Transactiontype>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  updateData?: InputMaybe<UserUpdateInput>;
};

export type Query = {
  __typename?: 'Query';
  getAccountById?: Maybe<Account>;
  getAccounts?: Maybe<Array<Maybe<Account>>>;
  getHealthCheck?: Maybe<Scalars['String']['output']>;
  getLoans?: Maybe<Array<Maybe<Loan>>>;
  getTransactions?: Maybe<Array<Maybe<Transaction>>>;
  getUserById?: Maybe<User>;
  getUsers?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetAccountByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetLoansArgs = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetTransactionsArgs = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};

export enum Transactionstatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export enum Transactiontype {
  AccountWithdraw = 'ACCOUNT_WITHDRAW',
  ClosureWithdraw = 'CLOSURE_WITHDRAW',
  LoanPayment = 'LOAN_PAYMENT',
  MembershipFee = 'MEMBERSHIP_FEE',
  SavingsDeposit = 'SAVINGS_DEPOSIT'
}

export type Transaction = {
  __typename?: 'Transaction';
  account?: Maybe<Account>;
  accountId: Scalars['String']['output'];
  acountName?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  loanId?: Maybe<Scalars['String']['output']>;
  status: Transactionstatus;
  type: Transactiontype;
  updateAt?: Maybe<Scalars['String']['output']>;
};

export type TransactionInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  loanId?: InputMaybe<Scalars['String']['input']>;
  status: Transactionstatus;
  type: Transactiontype;
};

export enum Userrole {
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  User = 'USER'
}

export enum Userstatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type User = {
  __typename?: 'User';
  account?: Maybe<Account>;
  contact?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Gender>;
  hasAccount?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  joinDate?: Maybe<Scalars['String']['output']>;
  lastLogin?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  other_name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Userrole>;
  status?: Maybe<Userstatus>;
};

export type UserInput = {
  contact: Scalars['String']['input'];
  dob: Scalars['String']['input'];
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  gender?: InputMaybe<Gender>;
  last_name: Scalars['String']['input'];
  other_name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role: Userrole;
  status: Userstatus;
};

export type UserUpdateInput = {
  contact?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  other_name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Userrole>;
  status?: InputMaybe<Userstatus>;
};

export type CreateUserMutationVariables = Exact<{
  user?: InputMaybe<UserInput>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null };

export type UpdateUserMutationVariables = Exact<{
  updateUserId: Scalars['ID']['input'];
  updateData?: InputMaybe<UserUpdateInput>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null };

export type DeleteUserMutationVariables = Exact<{
  deleteUserId: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: string | null };

export type CreateAccountMutationVariables = Exact<{
  account?: InputMaybe<AccountInput>;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount?: { __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null, owner?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null } | null };

export type UpdateAccountMutationVariables = Exact<{
  updateAccountId: Scalars['String']['input'];
  balance?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Accountstatus>;
  paidMembership?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount?: { __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null, owner?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null } | null };

export type DeleteAccountMutationVariables = Exact<{
  deleteAccountId: Scalars['String']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount?: string | null };

export type CreateLoanMutationVariables = Exact<{
  loan?: InputMaybe<LoanInput>;
}>;


export type CreateLoanMutation = { __typename?: 'Mutation', createLoan?: { __typename?: 'Loan', id: string, accountId: string, amount: number, interestRate: number, status: Loanstatus, endDate: string, startDate: string, term: number, createAt?: string | null, updateAt?: string | null, summary?: { __typename?: 'LoanSummary', id: string, loanId?: string | null, monthlyPayment?: number | null, totalInterest?: number | null, remainingBalance?: number | null } | null } | null };

export type UpdateLoanMutationVariables = Exact<{
  updateLoanId: Scalars['String']['input'];
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Loanstatus>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  term?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateLoanMutation = { __typename?: 'Mutation', updateLoan?: { __typename?: 'Loan', id: string, accountId: string, amount: number, interestRate: number, status: Loanstatus, endDate: string, startDate: string, term: number, createAt?: string | null, updateAt?: string | null, summary?: { __typename?: 'LoanSummary', id: string, loanId?: string | null, monthlyPayment?: number | null, totalInterest?: number | null, remainingBalance?: number | null } | null, account?: { __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null } | null } | null };

export type DeleteLoanMutationVariables = Exact<{
  deleteLoanId: Scalars['String']['input'];
}>;


export type DeleteLoanMutation = { __typename?: 'Mutation', deleteLoan?: string | null };

export type CreateTransactionMutationVariables = Exact<{
  transaction?: InputMaybe<TransactionInput>;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction?: { __typename?: 'Transaction', id: string, type: Transactiontype, amount: number, accountId: string, acountName?: string | null, status: Transactionstatus, description?: string | null, loanId?: string | null, createdAt?: string | null, updateAt?: string | null } | null };

export type UpdateTransactionMutationVariables = Exact<{
  updateTransactionId: Scalars['String']['input'];
  type?: InputMaybe<Transactiontype>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  accountId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Transactionstatus>;
  description?: InputMaybe<Scalars['String']['input']>;
  loanId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction?: { __typename?: 'Transaction', id: string, type: Transactiontype, amount: number, accountId: string, acountName?: string | null, status: Transactionstatus, description?: string | null, loanId?: string | null, createdAt?: string | null, updateAt?: string | null } | null };

export type DeleteTransactionMutationVariables = Exact<{
  deleteTransactionId: Scalars['String']['input'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction?: string | null };

export type MutationMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type MutationMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token?: string | null, user?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers?: Array<{ __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null, account?: { __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null } | null } | null> | null };

export type GetUserByIdQueryVariables = Exact<{
  getUserByIdId: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null, account?: { __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null, loans?: Array<{ __typename?: 'Loan', id: string, accountId: string, amount: number, interestRate: number, status: Loanstatus, endDate: string, startDate: string, term: number, createAt?: string | null, updateAt?: string | null, summary?: { __typename?: 'LoanSummary', id: string, loanId?: string | null, monthlyPayment?: number | null, totalInterest?: number | null, remainingBalance?: number | null } | null } | null> | null, transactions?: Array<{ __typename?: 'Transaction', id: string, type: Transactiontype, amount: number, accountId: string, acountName?: string | null, status: Transactionstatus, description?: string | null, loanId?: string | null, createdAt?: string | null, updateAt?: string | null } | null> | null } | null } | null };

export type GetAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountsQuery = { __typename?: 'Query', getAccounts?: Array<{ __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null, owner?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null, loans?: Array<{ __typename?: 'Loan', id: string, amount: number, interestRate: number, status: Loanstatus, endDate: string, startDate: string, term: number, createAt?: string | null, updateAt?: string | null, summary?: { __typename?: 'LoanSummary', id: string, monthlyPayment?: number | null, totalInterest?: number | null, remainingBalance?: number | null } | null } | null> | null, transactions?: Array<{ __typename?: 'Transaction', id: string, type: Transactiontype, amount: number, status: Transactionstatus, description?: string | null, loanId?: string | null, createdAt?: string | null, updateAt?: string | null } | null> | null } | null> | null };

export type GetAccountByIdQueryVariables = Exact<{
  getAccountByIdId: Scalars['String']['input'];
}>;


export type GetAccountByIdQuery = { __typename?: 'Query', getAccountById?: { __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null, owner?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null, loans?: Array<{ __typename?: 'Loan', id: string, accountId: string, amount: number, interestRate: number, status: Loanstatus, endDate: string, startDate: string, term: number, createAt?: string | null, updateAt?: string | null, summary?: { __typename?: 'LoanSummary', id: string, monthlyPayment?: number | null, totalInterest?: number | null, remainingBalance?: number | null } | null } | null> | null, transactions?: Array<{ __typename?: 'Transaction', id: string, type: Transactiontype, amount: number, accountId: string, acountName?: string | null, status: Transactionstatus, description?: string | null, loanId?: string | null, createdAt?: string | null, updateAt?: string | null } | null> | null } | null };

export type GetLoansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoansQuery = { __typename?: 'Query', getLoans?: Array<{ __typename?: 'Loan', id: string, accountId: string, amount: number, interestRate: number, status: Loanstatus, endDate: string, startDate: string, term: number, createAt?: string | null, updateAt?: string | null, summary?: { __typename?: 'LoanSummary', id: string, loanId?: string | null, monthlyPayment?: number | null, totalInterest?: number | null, remainingBalance?: number | null } | null, account?: { __typename?: 'Account', id: string, userId: string, accountNumber: string, balance: number, status: Accountstatus, paidMembership: boolean, hasLoan: boolean, is_deleted?: boolean | null, deleted_at?: string | null, owner?: { __typename?: 'User', id?: string | null, first_name?: string | null, last_name?: string | null, other_name?: string | null, email?: string | null, role?: Userrole | null, status?: Userstatus | null, lastLogin?: string | null, joinDate?: string | null, contact?: string | null, gender?: Gender | null, dob?: string | null, hasAccount?: boolean | null, fullName?: string | null } | null } | null } | null> | null };

export type GetTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionsQuery = { __typename?: 'Query', getTransactions?: Array<{ __typename?: 'Transaction', id: string, type: Transactiontype, amount: number, accountId: string, acountName?: string | null, status: Transactionstatus, description?: string | null, loanId?: string | null, createdAt?: string | null, updateAt?: string | null, account?: { __typename?: 'Account', id: string, accountNumber: string, owner?: { __typename?: 'User', fullName?: string | null, id?: string | null } | null } | null } | null> | null };


export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateData"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserUpdateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteUserId"}}}]}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"account"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const UpdateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateAccountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"balance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ACCOUNTSTATUS"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paidMembership"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateAccountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"balance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"balance"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"paidMembership"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paidMembership"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteAccountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteAccountId"}}}]}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const CreateLoanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLoan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loan"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoanInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLoan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loan"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPayment"}},{"kind":"Field","name":{"kind":"Name","value":"totalInterest"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}}]}}]} as unknown as DocumentNode<CreateLoanMutation, CreateLoanMutationVariables>;
export const UpdateLoanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLoan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateLoanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interestRate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LOANSTATUS"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"term"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLoan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateLoanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"interestRate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interestRate"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"term"},"value":{"kind":"Variable","name":{"kind":"Name","value":"term"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPayment"}},{"kind":"Field","name":{"kind":"Name","value":"totalInterest"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateLoanMutation, UpdateLoanMutationVariables>;
export const DeleteLoanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLoan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteLoanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLoan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteLoanId"}}}]}]}}]} as unknown as DocumentNode<DeleteLoanMutation, DeleteLoanMutationVariables>;
export const CreateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transaction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transaction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"acountName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}}]}}]} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const UpdateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateTransactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TRANSACTIONTYPE"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TRANSACTIONSTATUS"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loanId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateTransactionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"loanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loanId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"acountName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const DeleteTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteTransactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteTransactionId"}}}]}]}}]} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const MutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Mutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<MutationMutation, MutationMutationVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserByIdId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserByIdId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"loans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPayment"}},{"kind":"Field","name":{"kind":"Name","value":"totalInterest"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"acountName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPayment"}},{"kind":"Field","name":{"kind":"Name","value":"totalInterest"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountsQuery, GetAccountsQueryVariables>;
export const GetAccountByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccountById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getAccountByIdId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAccountById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getAccountByIdId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPayment"}},{"kind":"Field","name":{"kind":"Name","value":"totalInterest"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"acountName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountByIdQuery, GetAccountByIdQueryVariables>;
export const GetLoansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLoans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLoans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyPayment"}},{"kind":"Field","name":{"kind":"Name","value":"totalInterest"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidMembership"}},{"kind":"Field","name":{"kind":"Name","value":"hasLoan"}},{"kind":"Field","name":{"kind":"Name","value":"is_deleted"}},{"kind":"Field","name":{"kind":"Name","value":"deleted_at"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"other_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"joinDate"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"hasAccount"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetLoansQuery, GetLoansQueryVariables>;
export const GetTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"acountName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updateAt"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTransactionsQuery, GetTransactionsQueryVariables>;