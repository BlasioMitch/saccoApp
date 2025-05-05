import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loansService from '../services/loans'
import accountsService from '../services/accounts'

const initialState = {
    error : null,
    loans : [],
    status: 'idle'
}

export const fetchLoans = createAsyncThunk(
    'loans/getLoans',
    async (_,{ rejectWithValue }) => {
        try{
            const response = await loansService.getAllLoans()
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const fetchLoanById = createAsyncThunk(
    'loans/getOneLoan',
    async (id, { rejectWithValue }) => {
        try{
            const response = await loansService.getOneLoan(id)
            return response
        } catch(error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const createLoan = createAsyncThunk(
    'loans/createLoan',
    async (loanData, { rejectWithValue }) =>{
        try{
            // First create the loan
            const response = await loansService.createLoan(loanData)
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'something went wrong!')
        }
    }
)

export const deleteLoan = createAsyncThunk(
    'loans/deleteLoan',
    async (id, { rejectWithValue }) => {
        try{
            const response = await loansService.deleteLoan(id)
            return { id }; // Return the deleted loan's ID
        } catch(error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const patchLoan = createAsyncThunk(
    'loans/patchLoan',
    async ({id, loanData}, { rejectWithValue}) => {
        try{
            const response = await loansService.patchLoan(id, loanData)        
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

const loanSlice = createSlice({
    name:'loans',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // fetchall
            .addCase(fetchLoans.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchLoans.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.loans = action.payload
            })
            .addCase(fetchLoans.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // patch
            .addCase(patchLoan.pending, state => {
                state.status = 'loading'
            })
            .addCase(patchLoan.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                const loanId = action.payload.id
                state.loans = state.loans.map(loan =>loan.id !== loanId ? loan : action.payload)
            })
            .addCase(patchLoan.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // create
            .addCase(createLoan.pending, state => {
                state.status = 'loading'
            })
            .addCase(createLoan.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.loans = [...state.loans, action.payload]
            })
            .addCase(createLoan.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // delete
            .addCase(deleteLoan.pending, state => {
                state.status = 'pending',
                state.error = null
            })
            .addCase(deleteLoan.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const loanId = action.payload.id
                state.loans = state.loans.filter(loan => loan.id !== loanId)
            })
            .addCase(deleteLoan.rejected,(state,action) =>{
                state.status = 'failed'
                state.error = action.payload
            })

    }
})

export default loanSlice.reducer