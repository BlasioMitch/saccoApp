import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_SAVINGS_REPORT } from "../graphql/queries";
import client from "../graphql/client";

const initialState = {
    error : null,
    report : null,
    status: 'idle'
}

export const fetchSavingsReport = createAsyncThunk(
    'savings/getSavingsReport',
    async ({ year, month = null }, { rejectWithValue }) => {
        try{
            const { data } = await client.query({
                query: GET_SAVINGS_REPORT,
                variables: { year, month },
                // Deposits change often; always collate fresh figures on the server
                fetchPolicy: 'network-only'
            })
            return data.getSavingsReport
        } catch (error){
            return rejectWithValue(error.message || 'Something went wrong!')
        }
    }
)

const savingsSlice = createSlice({
    name: 'savings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSavingsReport.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchSavingsReport.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.report = action.payload
            })
            .addCase(fetchSavingsReport.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export default savingsSlice.reducer
