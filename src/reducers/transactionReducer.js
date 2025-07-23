import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from '../graphql/client'
import { GET_TRANSACTIONS } from '../graphql/queries'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION } from '../graphql/mutations'

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

const initialState = {
  error: null,
  transactions: [],
  status: 'idle',
  success: null
}

export const fetchTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (accountId, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_TRANSACTIONS,
        variables: accountId ? { accountId } : {}
      })
      return data.getTransactions
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!')
    }
  }
)

// export const fetchTransactionById = createAsyncThunk(
//   'transactions/getOneTransaction',
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await client.query({
//         query: GET_TRANSACTION_BY_ID,
//         variables: { getTransactionByIdId: id }
//       })
//       return data.getTransactionById
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong on our end')
//     }
//   }
// )

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_TRANSACTION,
        variables: { transaction: transactionData }
      })
      return data.createTransaction
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!')
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      // Only send allowed fields for update
      const allowedFields = ['type', 'amount', 'accountId', 'status', 'description', 'loanId'];
      const updateVars = Object.fromEntries(
        Object.entries(transactionData).filter(([key]) => allowedFields.includes(key))
      );
      const { data } = await client.mutate({
        mutation: UPDATE_TRANSACTION,
        variables: { updateTransactionId: id, ...updateVars }
      })
      return data.updateTransaction
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!')
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await client.mutate({
        mutation: DELETE_TRANSACTION,
        variables: { deleteTransactionId: id }
      })
      return { id }
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!')
    }
  }
)

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: state => { state.error = null },
    clearSuccess: state => { state.success = null }
  },
  extraReducers: builder => {
    builder
      // Fetch all cases
      .addCase(fetchTransactions.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Create cases
      .addCase(createTransaction.pending, state => {
        state.status = 'loading'
        state.error = null
        state.success = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload)
        state.status = 'succeeded'
        state.success = 'Transaction created successfully'
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Update cases
      .addCase(updateTransaction.pending, state => {
        state.status = 'loading'
        state.error = null
        state.success = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.success = 'Transaction updated successfully'
        const transactionId = action.payload.id
        state.transactions = state.transactions.map(transaction =>
          transaction.id !== transactionId ? transaction : action.payload
        )
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Delete cases
      .addCase(deleteTransaction.pending, state => {
        state.status = 'loading'
        state.error = null
        state.success = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.success = 'Transaction deleted successfully'
        const transactionId = action.payload.id
        state.transactions = state.transactions.filter(transaction => transaction.id !== transactionId)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { clearError, clearSuccess } = transactionSlice.actions

export default transactionSlice.reducer