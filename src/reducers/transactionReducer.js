import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from '../services/transaction'

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getAllTransactions()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong!')
    }
  }
)

export const fetchTransactionById = createAsyncThunk(
  'transactions/getOneTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await transactionService.getOneTransaction(id)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong on our end')
    }
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await transactionService.createTransaction(transactionData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong!')
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await transactionService.updateTransaction(id, transactionData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong!')
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await transactionService.deleteTransaction(id)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong!')
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
        state.status = 'succeeded'
        state.success = 'Transaction created successfully'
        state.transactions.push(action.payload)
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