import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from '../graphql/client'
import { GET_LOANS } from '../graphql/queries'
import { CREATE_LOAN, UPDATE_LOAN, DELETE_LOAN } from '../graphql/mutations'
// import { GET_LOAN_BY_ID } from '../graphql/queries'

const initialState = {
    error : null,
    loans : [],
    status: 'idle'
}

export const fetchLoans = createAsyncThunk(
    'loans/getLoans',
    async (accountId, { rejectWithValue }) => {
        try{
            const { data } = await client.query({
                query: GET_LOANS,
                variables: accountId ? { accountId } : {}
            })
            return data.getLoans
        } catch (error){
            return rejectWithValue(error.message || 'Something went wrong!')
        }
    }
)

// export const fetchLoanById = createAsyncThunk(
//     'loans/getOneLoan',
//     async (id, { rejectWithValue }) => {
//         try {
//             const { data } = await client.query({
//                 query: GET_LOAN_BY_ID,
//                 variables: { getLoanByIdId: id }
//             })
//             return data.getLoanById
//         } catch (error) {
//             return rejectWithValue(error.message || 'Something went wrong!')
//         }
//     }
// )

export const createLoan = createAsyncThunk(
    'loans/createLoan',
    async (loanData, { rejectWithValue }) =>{
        try{
            const { data } = await client.mutate({
                mutation: CREATE_LOAN,
                variables: { loan: loanData }
            })
            return data.createLoan
        } catch (error){
            return rejectWithValue(error.message || 'something went wrong!')
        }
    }
)

export const deleteLoan = createAsyncThunk(
    'loans/deleteLoan',
    async (id, { rejectWithValue }) => {
        try{
            await client.mutate({
                mutation: DELETE_LOAN,
                variables: { deleteLoanId: id }
            })
            return { id }
        } catch(error){
            return rejectWithValue(error.message || 'Something went wrong!')
        }
    }
)

export const patchLoan = createAsyncThunk(
    'loans/patchLoan',
    async ({id, loanData}, { rejectWithValue}) => {
        try{
            // Only send allowed fields for update
            const allowedFields = ['accountId', 'amount', 'interestRate', 'status', 'endDate', 'startDate', 'term'];
            const updateVars = Object.fromEntries(
                Object.entries(loanData).filter(([key]) => allowedFields.includes(key))
            );
            const { data } = await client.mutate({
                mutation: UPDATE_LOAN,
                variables: { updateLoanId: id, ...updateVars }
            })
            return data.updateLoan
        } catch (error){
            return rejectWithValue(error.message || 'Something went wrong!')
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