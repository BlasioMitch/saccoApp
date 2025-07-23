import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../graphql/client'
import { LOGIN } from '../graphql/mutations'

const initialState = {
  user: null,
  token: null,
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
      const { user, token } = data.login;
      localStorage.setItem('user', JSON.stringify(user));
      if (token) localStorage.setItem('token', token);
      return { user, token };
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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
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
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user'))
        if (token && user) {
          state.token = token
          state.user = user
          state.isAuthenticated = true
          state.status = 'succeeded'
        } else {
          state.token = null
          state.user = null
          state.isAuthenticated = false
          state.status = 'idle'
          if (token || user) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
          }
        }
      } catch (error) {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.status = 'failed'
        localStorage.removeItem('user')
        localStorage.removeItem('token')
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
        state.token = action.payload.token
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
        state.token = null
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