import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from '../services/user'

const initialState = {
    profile: null,
    error: null,
    users: [],
    status: 'idle',
    success: null
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
    async ({ id, objData } , { rejectWithValue }) => {
        try {
            if(!id || !objData){
                throw new Error('Invalid Input: ID and data are required')
            }
            const response = await userService.patchUser(id,objData)
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
        clearRegError: state => { state.error = null },
        clearSuccess: state => { state.success = null }
    },
    extraReducers: builder =>{
        builder
            // fetch users cases
            .addCase(fetchUsers.pending, (state) => {
                state.error = null
                state.status = 'loading'
            })
            .addCase(fetchUsers.fulfilled, (state,action) =>{
                // console.log('Raw users data:', action.payload)
                // Format each user with both original and transformed fields at root level
                const formattedUsers = (action.payload.data || action.payload).map(user => {
                    // console.log('Processing user:', user)
                    return {
                        ...user,  // Original user data
                        name: `${user.first_name} ${user.last_name} ${user.other_name || ''}`.trim(),
                        joinDate: user.created_on || new Date().toISOString(),
                        lastLogin: user.last_login || 'Never'
                    }
                })
                // console.log('Formatted users:', formattedUsers)
                state.users = formattedUsers
                state.status = 'succeeded'
            })
            .addCase(fetchUsers.rejected, (state,action) => {
                state.error = action.payload
                state.status = 'failed'
            })
            //  create user cases
            .addCase(createUser.pending, (state) => {
                state.error = null
                state.success = null
                state.status = 'loading'
            })
            .addCase(createUser.fulfilled, (state,action) =>{
                console.log('Backend response:', action.payload)
                // Format the user data with the name field
                const userData = action.payload.data || action.payload
                const formattedUser = {
                    ...userData,
                    name: `${userData.first_name} ${userData.last_name} ${userData.other_name || ''}`.trim()
                }
                state.users.push(formattedUser)
                state.status = 'succeeded'
                state.success = 'User created successfully'
            })
            .addCase(createUser.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // delete cases
            .addCase(deleteUser.pending, (state) => {
                state.error = null
                state.success = null
                state.status = 'loading'
            })
            .addCase(deleteUser.fulfilled, (state,action) =>{
                const userId = action.payload
                state.users = state.users.filter(user => user.id !== userId); // Remove user
                state.status = 'succeeded'
                state.success = 'User deleted successfully'
            })
            .addCase(deleteUser.rejected, (state,action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            // Pathc user cases
            .addCase(patchUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
                state.success = null
            })
            .addCase(patchUser.fulfilled, (state,action) =>{
                const userId = action.payload.id
                state.users = state.users.map(user => user.id !== userId ? user : action.payload); // Remove user
                state.status = 'succeeded'
                state.success = 'User updated successfully'
            })
            .addCase(patchUser.rejected, (state,action) => {
                state.error = action.payload
                state.status = 'failed'
            })
            // fetch user by id cases
            .addCase(fetchUserById.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchUserById.fulfilled, (state,action) => {
                state.profile = action.payload
                state.status = 'succeeded'
            })
            .addCase(fetchUserById.rejected, (state,action) => {
                state.error = action.payload
                state.status = 'failed'
            })
    }
})


export const {clearRegError, clearSuccess} = usersSlice.actions

export default usersSlice.reducer