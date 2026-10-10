import {
  APPROVE_LOAN, CREATE_ACCOUNT, CREATE_LOAN, CREATE_TRANSACTION, CREATE_USER, REJECT_LOAN, UPDATE_ACCOUNT, UPDATE_LOAN,
  UPDATE_TRANSACTION, UPDATE_USER,
} from '../graphql/mutations'

// Staff changes that can be made offline and sent later. Each says how it reads in the "waiting" list and what
// the row looks like until the server has it (a temporary id for new records, marked syncStatus: 'pending').
// Deletes, CSV imports, password resets and reports need the server there and then, so they are not here.

const money = (value) => `UGX ${Math.round(Number(value) || 0).toLocaleString('en-US')}`
const nameOf = (user) => user ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email : null
const now = () => new Date().toISOString()

const TYPE_LABELS = {
  SAVINGS_DEPOSIT: 'deposit',
  ACCOUNT_WITHDRAW: 'withdrawal',
  CLOSURE_WITHDRAW: 'closure payout',
  LOAN_PAYMENT: 'loan repayment',
  MEMBERSHIP_FEE: 'membership fee',
}

const accountById = (state, id) => state.accounts?.accounts?.find(account => account.id === id)
const accountLabel = (account) => account ? `${nameOf(account.owner) ?? 'member'} (${account.accountNumber})` : 'an account'
const merge = (list, id, changes) => {
  const existing = list?.find(item => item.id === id)
  return { ...(existing ?? { id }), ...changes, syncStatus: 'pending' }
}
const only = (values, keys) => Object.fromEntries(Object.entries(values).filter(([key]) => !keys.includes(key)))

export const OFFLINE_OPERATIONS = {
  CREATE_TRANSACTION: {
    document: CREATE_TRANSACTION,
    field: 'createTransaction',
    creates: true,
    label: ({ transaction }, state) => `Record ${TYPE_LABELS[transaction.type] ?? 'transaction'} of ${money(transaction.amount)} for ${accountLabel(accountById(state, transaction.accountId))}`,
    placeholder: ({ transaction }, tempId, state) => {
      const account = accountById(state, transaction.accountId)
      return {
        id: tempId,
        ...transaction,
        acountName: account?.accountNumber ?? null,
        createdAt: now(),
        updateAt: now(),
        account: account ? { id: account.id, accountNumber: account.accountNumber, owner: account.owner ?? null } : null,
        syncStatus: 'pending',
      }
    },
  },
  UPDATE_TRANSACTION: {
    document: UPDATE_TRANSACTION,
    field: 'updateTransaction',
    label: (vars) => `Edit a transaction (${Object.keys(only(vars, ['updateTransactionId'])).join(', ')})`,
    placeholder: (vars, _, state) => merge(state.transactions?.transactions, vars.updateTransactionId, only(vars, ['updateTransactionId'])),
  },
  CREATE_USER: {
    document: CREATE_USER,
    field: 'createUser',
    creates: true,
    label: ({ user }) => `Register ${nameOf(user)} (${user.email})`,
    placeholder: ({ user }, tempId) => ({
      id: tempId,
      ...only(user, ['password']),
      fullName: [user.first_name, user.last_name, user.other_name].filter(Boolean).join(' '),
      hasAccount: false,
      joinDate: now(),
      syncStatus: 'pending',
    }),
  },
  UPDATE_USER: {
    document: UPDATE_USER,
    field: 'updateUser',
    label: (vars, state) => `Edit ${nameOf(state.users?.users?.find(user => user.id === vars.updateUserId)) ?? 'a member'} (${Object.keys(vars.updateData ?? {}).join(', ')})`,
    placeholder: (vars, _, state) => merge(state.users?.users, vars.updateUserId, vars.updateData ?? {}),
  },
  CREATE_ACCOUNT: {
    document: CREATE_ACCOUNT,
    field: 'createAccount',
    creates: true,
    label: ({ account }, state) => `Open an account for ${nameOf(state.users?.users?.find(user => user.id === account.userId)) ?? 'a member'}`,
    placeholder: ({ account }, tempId, state) => ({
      id: tempId,
      accountNumber: 'Waiting to sync',
      balance: 0,
      status: 'ACTIVE',
      paidMembership: false,
      hasLoan: false,
      ...account,
      owner: state.users?.users?.find(user => user.id === account.userId) ?? null,
      loans: [],
      transactions: [],
      syncStatus: 'pending',
    }),
  },
  UPDATE_ACCOUNT: {
    document: UPDATE_ACCOUNT,
    field: 'updateAccount',
    label: (vars, state) => `Edit account ${accountById(state, vars.updateAccountId)?.accountNumber ?? ''}`.trim(),
    placeholder: (vars, _, state) => merge(state.accounts?.accounts, vars.updateAccountId, only(vars, ['updateAccountId'])),
  },
  CREATE_LOAN: {
    document: CREATE_LOAN,
    field: 'createLoan',
    creates: true,
    label: ({ loan }, state) => `Create a loan of ${money(loan.amount)} for ${accountLabel(accountById(state, loan.accountId))}`,
    placeholder: ({ loan }, tempId, state) => {
      const account = accountById(state, loan.accountId)
      return { id: tempId, ...loan, summary: null, account: account ?? null, createdAt: now(), syncStatus: 'pending' }
    },
  },
  UPDATE_LOAN: {
    document: UPDATE_LOAN,
    field: 'updateLoan',
    label: (vars) => `Edit a loan (${Object.keys(only(vars, ['updateLoanId'])).join(', ')})`,
    placeholder: (vars, _, state) => merge(state.loans?.loans, vars.updateLoanId, only(vars, ['updateLoanId'])),
  },
  APPROVE_LOAN: {
    document: APPROVE_LOAN,
    field: 'approveLoan',
    label: (vars) => `Approve a loan application${vars.interestRate ? ` at ${vars.interestRate}%` : ''}`,
    placeholder: (vars) => ({ id: vars.id, status: 'ACTIVE', interestRate: vars.interestRate ?? null, startDate: vars.startDate ?? null, endDate: null, syncStatus: 'pending' }),
  },
  REJECT_LOAN: {
    document: REJECT_LOAN,
    field: 'rejectLoan',
    label: () => 'Decline a loan application',
    placeholder: (vars) => ({ id: vars.id, status: 'REJECTED', decisionNote: vars.reason, syncStatus: 'pending' }),
  },
}

// Operation names as GraphQL sends them, to tell queueable mutations from online-only ones
export const OFFLINE_OPERATION_NAMES = new Set(
  Object.values(OFFLINE_OPERATIONS).map(({ document }) => document.definitions.find(definition => definition.kind === 'OperationDefinition')?.name?.value).filter(Boolean)
)

export const TEMP_ID_PREFIX = 'offline-'
export const isTempId = (id) => typeof id === 'string' && id.startsWith(TEMP_ID_PREFIX)
