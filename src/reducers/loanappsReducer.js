import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loanappsService from '../services/loanapplications'

const initialState = {
    error : null,
    loanapps : [],
    status: 'idle'
}

export const fetchLoanapps = createAsyncThunk(
    'loanapps/getLoanapps',
    async (_,{ rejectWithValue }) => {
        try{
            const response = await loanappsService.getLoanApps()
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const fetchLoanappsById = createAsyncThunk(
    'loanapps/getOneLoanapp',
    async (id, { rejectWithValue }) => {
        try{
            const response = await loanappsService.getOneLoanApp(id)
            return response
        } catch(error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const createLoanapp = createAsyncThunk(
    'loanapps/createLoanapp',
    async (loanappData, { rejectWithValue }) =>{
        try{
            const response = await loanappsService.createLoanApp(loanappData)
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const deleteLoanapp = createAsyncThunk(
    'loanapps/deleteLoanapp',
    async (id, { rejectWithValue }) => {
        try{
            const response = await loanappsService.deleteLoanApp(id)
            return response
        } catch(error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const patchLoanapp = createAsyncThunk(
    'loanapps/patchLoanapp',
    async ({id, loanAppObj}, { rejectWithValue}) => {
        try{
            const response = await loanappsService.patchLoanApp(id, loanAppObj)
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

const loanappSlice = createSlice({
    name:'loanapps',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // fetchall
            .addCase(fetchLoanapps.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchLoanapps.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.loanapps = action.payload
            })
            .addCase(fetchLoanapps.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // patch
            .addCase(patchLoanapp.pending, state => {
                state.status = 'loading'
            })
            .addCase(patchLoanapp.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                const loanId = action.payload.id
                state.loanapps = state.loanapps.map(loan =>loan.id !== loanId ? loan : action.payload)
            })
            .addCase(patchLoanapp.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // create
            .addCase(createLoanapp.pending, state => {
                state.status = 'pending'
                state.error = null
            })
            .addCase(createLoanapp.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                state.loanapps.push(action.payload)
            })
            .addCase(createLoanapp.rejected,(state,action) =>{
                state.status = 'failed'
                state.error = action.payload
            })
            // delete
            .addCase(deleteLoanapp.pending, state => {
                state.status = 'pending',
                state.error = null
            })
            .addCase(deleteLoanapp.fulfilled, (state,action) => {
                state.status = 'succeeded'
                const loanId = action.payload.id
                state.loanapps = state.loanapps.filter(loan => loan.id !== loanId)
            })
            .addCase(deleteLoanapp.rejected,(state,action) =>{
                state.status = 'failed'
                state.error = action.payload
            })

    }
})

export default loanappSlice.reducer