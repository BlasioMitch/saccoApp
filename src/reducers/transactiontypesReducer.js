import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactiontypesService from '../services/transactiontypes'

const initialState = {
    error:null,
    transactiontypes:[],
    status:'idle'
}

export const fetchtransactiontypes = createAsyncThunk(
    'transactiontypes/gettransactiontypes',
    async ( _,{ rejectWithValue}) => {
        try {
            const response = await transactiontypesService.getAllTransactiontypes()
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our end')
        }
    }
)

export const fetchTransactiontypeById = createAsyncThunk(
    'transactiontypes/getOneTransactiontype',
    async ( id, { rejectWithValue }) => {
        try {
            const response = await transactiontypesService.getOneTransactiontype(id)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our end')
        }
    }
)

export const createTransactiontype = createAsyncThunk(
    'transactiontypes/createTransactiontype',
    async ( objData, { rejectWithValue }) => {
        try{   
            const response = await transactiontypesService.createTransactiontype(objData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our end')
        }
    }
)

export const updateTransactiontype = createAsyncThunk(
    'transactiontypes/updateTransactiontype',
    async ({ id,objData }, { rejectWithValue }) =>{
        try{
            const response = await transactiontypesService.updateTransactiontype(id, objData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our side')
        }
    }
)

export const deleteTransactiontype = createAsyncThunk(
    'transactiontypes/deleteTransactiontype',
    async( id, { rejectWithValue }) => {
        try {
            const response = await transactiontypesService.deleteTransactiontype(id)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our side')
        }
    }
)

const transactiontypeslice = createSlice({
    name:'transactiontypes',
    initialState,
    reducers: {
        clearRegError: state => state.error = null,
        // succesful: state => state.transactiontypes.filter(transaction => transaction.status == 'S'),
        // rejected: state => state.transactiontypes.filter(transaction => transaction.status == 'F'),
        // pending: state => state.transactiontypes.filter(transaction => transaction.status == 'P'),
    },
    extraReducers: builder => {
        builder
            // Fetch all cases
            .addCase(fetchtransactiontypes.pending, state =>{
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchtransactiontypes.fulfilled, (state,action) => {
                state.status = 'succeeded'
                state.transactiontypes = action.payload
            })
            .addCase(fetchtransactiontypes.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // update cases
            .addCase(updateTransactiontype.pending, state => {
                state.status = 'loading'
            })
            .addCase(updateTransactiontype.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                const tranID = action.payload
                state.transactiontypes = state.transactiontypes.map(tran => tran.id !== tranID ? tran : action.payload )
            })
            .addCase(updateTransactiontype.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // delete cases
            .addCase(deleteTransactiontype.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(deleteTransactiontype.fulfilled,(state,action) => {
                state.status = 'succeeded'
                const tranID = action.payload
                state.transactiontypes = state.transactiontypes.filter(tran => tran.id !== tranID)
            })
            .addCase(deleteTransactiontype.rejected, (state, action) =>{
                state.status = 'failed'
                state.error = action.payload
            })
            // create cases
            .addCase(createTransactiontype.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(createTransactiontype.fulfilled, (state,action) => {
                state.status = 'succeeded'
                state.transactiontypes.push(action.payload)
            })
            .addCase(createTransactiontype.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export const { clearRegError, succesful, rejected,  pending } = transactiontypeslice.actions

export default transactiontypeslice.reducer