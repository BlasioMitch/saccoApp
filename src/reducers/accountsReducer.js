import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountsService from '../services/accounts'

const initialState = {
    error : null,
    accounts : [],
    status: 'idle',
    success: null
}

export const fetchAccounts = createAsyncThunk(
    'accounts/getAccounts',
    async (_,{ rejectWithValue }) => {
        try{
            const response = await accountsService.getAccounts()
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const fetchAccountById = createAsyncThunk(
    'accounts/getOneAccount',
    async (id, { rejectWithValue }) => {
        try{
            const response = await accountsService.getOneAccount(id)
            return response
        } catch(error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const createAccount = createAsyncThunk(
    'accounts/createAccount',
    async (accountData, { rejectWithValue }) =>{
        try{
            const response = await accountsService.createAccount(accountData)
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'something went wrong!')
        }
    }
)

export const deleteAccount = createAsyncThunk(
    'accounts/deleteAccount',
    async (id, { rejectWithValue }) => {
        try{
            const response = await accountsService.deleteAccount(id)
            return response
        } catch(error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

export const patchAccount = createAsyncThunk(
    'accounts/patchAccount',
    async ({id, accountData}, { rejectWithValue}) => {
        try{
            const response = await accountsService.patchAccount(id, accountData)
            return response
        } catch (error){
            return rejectWithValue(error.response?.data || 'Something went wrong!')
        }
    }
)

const accountSlice = createSlice({
    name:'accounts',
    initialState,
    reducers: {
        clearError: state => { state.error = null },
        clearSuccess: state => { state.success = null }
    },
    extraReducers: builder => {
        builder
            // fetchall
            .addCase(fetchAccounts.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.accounts = action.payload
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // patch
            .addCase(patchAccount.pending, state => {
                state.status = 'loading'
                state.error = null
                state.success = null
            })
            .addCase(patchAccount.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                state.success = 'Account updated successfully'
                const accountId = action.payload.id
                state.accounts = state.accounts.map(account => 
                    account.id !== accountId ? account : action.payload
                )
            })
            .addCase(patchAccount.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // create
            .addCase(createAccount.pending, state => {
                state.status = 'loading'
                state.error = null
                state.success = null
            })
            .addCase(createAccount.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                state.success = 'Account created successfully'
                state.accounts.push(action.payload)
            })
            .addCase(createAccount.rejected,(state,action) =>{
                state.status = 'failed'
                state.error = action.payload
            })
            // delete
            .addCase(deleteAccount.pending, state => {
                state.error = null
                state.success = null
                state.status = 'loading'
            })
            .addCase(deleteAccount.fulfilled, (state,action) => {
                const accountId = action.payload
                state.accounts = state.accounts.filter(account => account.id !== accountId)
                state.status = 'succeeded'
                state.success = 'Account deleted successfully'
            })
            .addCase(deleteAccount.rejected,(state,action) =>{
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export const { clearError, clearSuccess } = accountSlice.actions

export default accountSlice.reducer