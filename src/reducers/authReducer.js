import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../services/auth'

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
      const response = await authService.login(credentials)
      return {
        token: response.token,
        user: response.user
      }
    } catch (error) {
      console.error('Login error in thunk:', error)
      return rejectWithValue(error.response?.data || 'Login failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed')
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
        const user = authService.getUserData()
        
        // Only set authenticated if both token and user exist
        if (token && user) {
          state.token = token
          state.user = user
          state.isAuthenticated = true
          state.status = 'succeeded'
        } else {
          // Clear any partial data
          state.token = null
          state.user = null
          state.isAuthenticated = false
          state.status = 'idle'
          // Clear localStorage if data is incomplete
          if (token || user) {
            authService.clearUserData()
          }
        }
      } catch (error) {
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.status = 'failed'
        authService.clearUserData()
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