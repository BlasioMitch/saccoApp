import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_LOAN_PAYMENTS_REPORT } from "../graphql/queries";
import client from "../graphql/client";
import { isOffline } from '../offline/network'

const initialState = {
    error : null,
    report : null,
    status: 'idle'
}

export const fetchLoanPaymentsReport = createAsyncThunk(
    'loanPayments/getLoanPaymentsReport',
    async ({ year, month = null }, { rejectWithValue }) => {
        try{
            const { data } = await client.query({
                query: GET_LOAN_PAYMENTS_REPORT,
                variables: { year, month },
                // Payments change often; always collate fresh figures on the server
                fetchPolicy: 'network-only'
            })
            return data.getLoanPaymentsReport
        } catch (error){
            return rejectWithValue(error.message || 'Something went wrong!')
        }
    },
  // Offline: keep the saved list instead of failing (it refreshes once the server is back)
  { condition: () => !isOffline() }
)

const loanPaymentsSlice = createSlice({
    name: 'loanPayments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoanPaymentsReport.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchLoanPaymentsReport.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.report = action.payload
            })
            .addCase(fetchLoanPaymentsReport.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export default loanPaymentsSlice.reducer
