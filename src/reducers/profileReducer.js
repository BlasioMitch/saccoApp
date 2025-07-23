import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from '../graphql/client'
import { GET_USER_BY_ID } from '../graphql/queries'

const initialState = {
    profile: null,
    error: null,
    status: 'idle',
    success: null
}
// register user in backend
export const FetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await client.query({
                query: GET_USER_BY_ID,
                variables: { getUserByIdId: userId }
            })
            return data.getUserById
        } catch (error) {
            return rejectWithValue(error.message || 'Something is not right on our end');
        }
    }
)
// create a slice of the store
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        resetProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.status = 'idle';
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(FetchProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(FetchProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;