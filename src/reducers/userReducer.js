import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from '../services/user'

const initialState = {
    user: null,
    error: null,
    users: [],
    status:'idle'
}
// register user in backend
export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) =>{
        try {
            const response = await userService.createUser(userData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something is not right on our end');
        }
    }
)

// fetch all users
export const fetchUsers = createAsyncThunk(
    'users/getUsers',
    async (_,{ rejectWithValue }) => {
        try {
            const response = await userService.getAllUsers()
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our side')
        }
    }
)

// get one user
export const fetchUserById = createAsyncThunk(
    'users/getOneUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await userService.getOneUser(id)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong one our End')
        }
    }
)

// patch one user
export const patchUser = createAsyncThunk(
    'users/patchUser',
    async ({id, updatedData},{ rejectWithValue }) => {
        try {
            const response = await userService.patchUser(id,updatedData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our side')
        }
    }
)

// delete one user
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id,{ rejectWithValue }) => {
        try {
            await userService.deleteUser(id)
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Something went wrong on our side')
        }
    }
)

const usersSlice = createSlice({
    name:'users',
    initialState,
    reducers: {
        clearRegError: state => state.error = null
    },
    extraReducers: builder =>{
        builder
            // fetch users cases
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            //  create user cases
            .addCase(createUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(createUser.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                state.users.push(action.payload)
            })
            .addCase(createUser.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // delete cases
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                const userId = action.payload
                state.users = state.users.filter(user => user.id !== userId); // Remove user
            })
            .addCase(deleteUser.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // Pathc user cases
            .addCase(patchUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(patchUser.fulfilled, (state,action) =>{
                state.status = 'succeeded'
                const userId = action.payload
                state.users = state.users.map(user => user.id !== userId ? user : action.payload); // Remove user
            })
            .addCase(patchUser.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})


export const {clearRegError} = usersSlice.actions

export default usersSlice.reducer