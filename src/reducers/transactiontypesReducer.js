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
            console.log(response,' red response')
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
            if(!id || !objData){
                throw new Error('Invalid Input: ID and data object are required')
            }
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
                state.error = null
                state.status = 'loading'
            })
            .addCase(fetchtransactiontypes.fulfilled, (state,action) => {
                state.transactiontypes = action.payload
                state.status = 'succeeded'
            })
            .addCase(fetchtransactiontypes.rejected, (state, action) => {
                state.error = action.payload
                state.status = 'failed'
            })
            // update cases
            .addCase(updateTransactiontype.pending, state => {
                state.status = 'loading'
            })
            .addCase(updateTransactiontype.fulfilled, (state,action) =>{
                const tranID = action.payload.id
                state.transactiontypes = state.transactiontypes.map(tran => tran.id !== tranID ? tran : action.payload )
                state.status = 'succeeded'
            })
            .addCase(updateTransactiontype.rejected, (state,action) => {
                state.error = action.payload
                state.status = 'failed'
            })
            // delete cases
            .addCase(deleteTransactiontype.pending, state => {
                state.error = null
                state.status = 'loading'
            })
            .addCase(deleteTransactiontype.fulfilled,(state,action) => {
                const tranID = action.payload.id
                state.transactiontypes = state.transactiontypes.filter(tran => tran.id !== tranID)
                state.status = 'succeeded'
            })
            .addCase(deleteTransactiontype.rejected, (state, action) =>{
                state.error = action.payload
                state.status = 'failed'
            })
            // create cases
            .addCase(createTransactiontype.pending, state => {
                state.error = null
                state.status = 'loading'
            })
            .addCase(createTransactiontype.fulfilled, (state,action) => {
                state.transactiontypes.push(action.payload)
                state.status = 'succeeded'
            })
            .addCase(createTransactiontype.rejected, (state,action) => {
                state.error = action.payload
                state.status = 'failed'
            })
    }
})

export const { clearRegError, succesful, rejected,  pending } = transactiontypeslice.actions

export default transactiontypeslice.reducer