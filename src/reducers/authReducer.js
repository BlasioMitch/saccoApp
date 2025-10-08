import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../graphql/client'
import { LOGIN, LOGOUT } from '../graphql/mutations'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  errorCode: null,
  message: null
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log('Attempting login with credentials:', { ...credentials, password: '[REDACTED]' });
      
      const { data } = await client.mutate({
        mutation: LOGIN,
        variables: credentials
      });
      // console.log('Full login response:', data);
      // console.log('Login response structure:', {
      //   success: data.login.success,
      //   message: data.login.message,
      //   hasToken: Boolean(data.login.token),
      //   hasUser: Boolean(data.login.user)
      // });
      
      const { success, message, token, user } = data.login;
      
      if (!success) {
        return rejectWithValue({
          message: message || 'Login failed',
          code: 'LOGIN_FAILED'
        });
      }
      
      // Only proceed if we have both token and user
      if (!token || !user) {
        return rejectWithValue({
          message: 'Invalid response received from authentication service',
          code: 'INVALID_RESPONSE'
        });
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        user,
        token,
        success: true,
        message: message || 'Login successful'
      };
    } catch (error) {
      // console.error('Login error in thunk:', error);
      
      // Handle Apollo specific errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        
        switch(graphQLError.extensions.code) {
          case 'UNAUTHENTICATED':
          case 'INVALID_CREDENTIALS':
            return rejectWithValue({
              message: 'Invalid email or password',
              code: graphQLError.extensions.code
            });
          case 'USER_NOT_FOUND':
            return rejectWithValue({
              message: 'No user exists with the provided email',
              code: 'USER_NOT_FOUND'
            });
          case 'SERVER_ERROR':
            return rejectWithValue({
              message: 'An unexpected error occurred. Please try again later.',
              code: 'SERVER_ERROR'
            });
          default:
            return rejectWithValue({
              message: graphQLError.message || 'Login failed',
              code: graphQLError.extensions.code || 'UNKNOWN_ERROR'
            });
        }
      }
      
      return rejectWithValue({
        message: error.message || 'Login failed',
        code: 'UNKNOWN_ERROR'
      });
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
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        if (user && token) {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
          state.status = 'succeeded';
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.status = 'idle';
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'failed';
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        // Ensure we're storing the error message as a string
        state.error = typeof action.payload === 'object' ? action.payload.message : (action.payload || 'Login failed');
        state.errorCode = action.payload?.code || 'UNKNOWN_ERROR';
        state.message = null;
        state.user = null;
        state.token = null;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { clearError, initializeAuth } = authSlice.actions

export default authSlice.reducer