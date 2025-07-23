import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../graphql/client'
import { LOGIN, LOGOUT } from '../graphql/mutations'

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN,
        variables: credentials
      });
      const { user} = data.login;
      localStorage.setItem('user', JSON.stringify(user));
      return { user };
    } catch (error) {
      console.error('Login error in thunk:', error)
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: LOGOUT
      });
      localStorage.removeItem('user');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    initializeAuth: (state) => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if ( user) {
          state.user = user
          state.isAuthenticated = true
          state.status = 'succeeded'
        } else {
          state.user = null
          state.isAuthenticated = false
          state.status = 'idle'
          if (token || user) {
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        state.user = null
        state.isAuthenticated = false
        state.status = 'failed'
        localStorage.removeItem('user')
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle'
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { clearError, initializeAuth } = authSlice.actions

export default authSlice.reducer