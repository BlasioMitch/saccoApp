import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_ACCOUNTS, GET_ACCOUNT_BY_ID } from "../graphql/queries";
import client from "../graphql/client";
import { CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../graphql/mutations'

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
            const { data } = await client.query({
                query: GET_ACCOUNTS
            })
            return data.getAccounts
        } catch (error){
            return rejectWithValue(error.message || 'Something went wrong!')
        }
    }
)

export const fetchAccountById = createAsyncThunk(
    'accounts/getOneAccount',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await client.query({
                query: GET_ACCOUNT_BY_ID,
                variables: { getAccountByIdId: id }
            })
            return data.getAccountById
        } catch (error) {
            return rejectWithValue(error.message || 'Something went wrong!')
        }
    }
)

export const createAccount = createAsyncThunk(
    'accounts/createAccount',
    async (accountData, { rejectWithValue }) =>{
        try{
            const { data } = await client.mutate({
                mutation: CREATE_ACCOUNT,
                variables: { account: accountData }
            })
            return data.createAccount
        } catch (error){
            return rejectWithValue(error.message || 'something went wrong!')
        }
    }
)

export const deleteAccount = createAsyncThunk(
    'accounts/deleteAccount',
    async (id, { rejectWithValue }) => {
        try{
            await client.mutate({
                mutation: DELETE_ACCOUNT,
                variables: { deleteAccountId: id }
            })
            return id
        } catch(error){
            return rejectWithValue(error.message || 'Something went wrong!')
        }
    }
)

export const patchAccount = createAsyncThunk(
    'accounts/patchAccount',
    async ({id, accountData}, { rejectWithValue}) => {
        try{
            // Only send allowed fields for update
            const allowedFields = ['balance', 'status', 'paidMembership'];
            const updateVars = Object.fromEntries(
                Object.entries(accountData).filter(([key]) => allowedFields.includes(key))
            );
            const { data } = await client.mutate({
                mutation: UPDATE_ACCOUNT,
                variables: { updateAccountId: id, ...updateVars }
            })
            return data.updateAccount
        } catch (error){
            return rejectWithValue(error.message || 'Something went wrong!')
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