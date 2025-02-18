import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from '../services/transaction'

const initialState = {
    error:null,
    transactions:[],
    status:'idle'
}

export const fetchTransactions = createAsyncThunk(
    'transactions/getTransactions',
    async ( _,{ rejectWithValue}) => {
        try {
            const response = await transactionService.getAllTransactions()
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our end')
        }
    }
)

export const fetchTransactionById = createAsyncThunk(
    'transactions/getOneTransaction',
    async ( id, { rejectWithValue }) => {
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
    async ( objData, { rejectWithValue }) => {
        try{   
            const response = await transactionService.createTransaction(objData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our end')
        }
    }
)

export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async ({ id,objData }, { rejectWithValue }) =>{
        try{
            const response = await transactionService.updateTransaction(id, objData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our side')
        }
    }
)

export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async( id, { rejectWithValue }) => {
        try {
            const response = await transactionService.deleteTransaction(id)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our side')
        }
    }
)

const transactionSlice = createSlice({
    name:'transactions',
    initialState,
    reducers: {
        clearRegError: state => state.error = null,
        // succesful: state => state.transactions.filter(transaction => transaction.status == 'S'),
        // rejected: state => state.transactions.filter(transaction => transaction.status == 'F'),
        // pending: state => state.transactions.filter(transaction => transaction.status == 'P'),
    },
    extraReducers: builder => {
        builder
            // Fetch all cases
            .addCase(fetchTransactions.pending, state =>{
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchTransactions.fulfilled, (state,action) => {
                state.status = 'succeeded'
                state.transactions = action.payload
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // update cases
            .addCase(updateTransaction.pending, state => {
                state.status = 'loading'
            })
            .addCase(updateTransaction.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                const tranID = action.payload
                state.transactions = state.transactions.map(tran => tran.id !== tranID ? tran : action.payload )
            })
            .addCase(updateTransaction.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // delete cases
            .addCase(deleteTransaction.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(deleteTransaction.fulfilled,(state,action) => {
                state.status = 'succeeded'
                const tranID = action.payload
                state.transactions = state.transactions.filter(tran => tran.id !== tranID)
            })
            .addCase(deleteTransaction.rejected, (state, action) =>{
                state.status = 'failed'
                state.error = action.payload
            })
            // create cases
            .addCase(createTransaction.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(createTransaction.fulfilled, (state,action) => {
                state.status = 'succeeded'
                state.users.push(action.payload)
            })
            .addCase(createTransaction.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export const { clearRegError, succesful, rejected,  pending } = transactionSlice.actions

export default transactionSlice.reducer