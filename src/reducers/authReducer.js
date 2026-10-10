import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../graphql/client'
import { LOGIN, LOGOUT, SET_NEW_PASSWORD, VERIFY_TWO_FACTOR } from '../graphql/mutations'
import { passkeyErrorMessage, signInWithPasskey } from '../auth/passkeys'

// Restore the signed-in user after a page refresh. The httpOnly cookie is the real session:
// if it has expired, the first query returns UNAUTHORIZED and the session-expired handler signs out.
const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
})()
localStorage.removeItem('token') // no longer stored; the session lives in the cookie

const initialState = {
  user: storedUser,
  token: null,
  isAuthenticated: Boolean(storedUser),
  status: storedUser ? 'succeeded' : 'idle',
  error: null,
  errorCode: null,
  message: null,
  // A sign-in in progress: { step: 'code', challengeToken, firstName } or { step: 'newPassword', user }
  pending: null,
}

const ERROR_MESSAGES = {
  UNAUTHENTICATED: 'Invalid email or password',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  REST_API_UNREACHABLE: 'The service is unavailable right now. Please try again later.',
}

const toAuthError = (error, fallback) => {
  const graphQLError = error?.graphQLErrors?.[0]
  if (graphQLError) {
    const code = graphQLError.extensions?.code || 'UNKNOWN_ERROR'
    return { message: ERROR_MESSAGES[code] || graphQLError.message || fallback, code }
  }
  return { message: error?.message || fallback, code: 'UNKNOWN_ERROR' }
}

// What a sign-in step answered: the next step to show, or a finished session
const toStepResult = (payload) => {
  if (payload?.twoFactorRequired) {
    return { step: 'code', challengeToken: payload.challengeToken, firstName: payload.user?.first_name ?? null }
  }
  if (!payload?.user) throw new Error('Invalid response received from authentication service')
  if (payload.mustChangePassword) return { step: 'newPassword', user: payload.user }
  localStorage.setItem('user', JSON.stringify(payload.user))
  return { step: 'done', user: payload.user, message: payload.message || 'Login successful' }
}

const signInStep = (type, mutation, field, fallback) => createAsyncThunk(type, async (variables, { rejectWithValue }) => {
  try {
    const { data } = await client.mutate({ mutation, variables })
    return toStepResult(data[field])
  } catch (error) {
    return rejectWithValue(toAuthError(error, fallback))
  }
})

export const login = signInStep('auth/login', LOGIN, 'login', 'Login failed')
export const verifyTwoFactor = signInStep('auth/verifyTwoFactor', VERIFY_TWO_FACTOR, 'verifyTwoFactor', 'That code is not correct')
export const setNewPassword = signInStep('auth/setNewPassword', SET_NEW_PASSWORD, 'setNewPassword', 'Could not save the new password')

// Fingerprint / passkey sign-in: the browser prompt, then the same session as a password sign-in
export const loginWithPasskey = createAsyncThunk('auth/loginWithPasskey', async ({ email } = {}, { rejectWithValue }) => {
  try {
    return toStepResult(await signInWithPasskey(email))
  } catch (error) {
    const code = error?.graphQLErrors?.[0]?.extensions?.code || error?.name || 'PASSKEY_FAILED'
    return rejectWithValue({ message: passkeyErrorMessage(error), code })
  }
})

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

const clearSession = (state) => {
  state.user = null
  state.token = null
  state.isAuthenticated = false
  state.status = 'idle'
  state.pending = null
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

const applyStep = (state, action) => {
  const result = action.payload
  state.error = null
  state.errorCode = null
  if (result.step === 'done') {
    state.status = 'succeeded'
    state.user = result.user
    state.isAuthenticated = true
    state.message = result.message
    state.pending = null
  } else {
    state.status = 'idle'
    state.pending = result
  }
}

const rejectStep = (state, action) => {
  state.status = 'failed'
  state.error = action.payload?.message || 'Login failed'
  state.errorCode = action.payload?.code || 'UNKNOWN_ERROR'
  // An expired 2-step challenge means starting again from the password
  if (action.payload?.code === 'CHALLENGE_EXPIRED') state.pending = null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    // "Back to sign in" from the code or new-password step
    cancelSignIn: (state) => {
      state.pending = null
      state.status = 'idle'
      state.error = null
    },
    // After the member saves their profile or avatar
    profileUpdated: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    sessionExpired: (state) => {
      clearSession(state)
      state.error = 'Your session has expired. Please log in again.';
      state.errorCode = 'UNAUTHORIZED';
    },
    initializeAuth: (state) => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          state.user = user;
          state.isAuthenticated = true;
          state.status = 'succeeded';
        } else {
          clearSession(state)
        }
      } catch {
        clearSession(state)
        state.status = 'failed';
      }
    }
  },
  extraReducers: (builder) => {
    for (const thunk of [login, verifyTwoFactor, setNewPassword, loginWithPasskey]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = 'loading'
          state.error = null
        })
        .addCase(thunk.fulfilled, applyStep)
        .addCase(thunk.rejected, rejectStep)
    }
    builder
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state) => {
        clearSession(state)
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { clearError, cancelSignIn, initializeAuth, sessionExpired, profileUpdated } = authSlice.actions

export default authSlice.reducer
