// Sign-in steps in the web app: password, then the 2-step code or a new password, then signed in
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

const mutate = vi.fn()
vi.mock('../graphql/client', () => ({ default: { mutate: (...args) => mutate(...args) } }))
vi.mock('../auth/passkeys', () => ({ signInWithPasskey: vi.fn(), passkeyErrorMessage: () => 'Passkey failed' }))

const { default: auth, cancelSignIn, login, setNewPassword, verifyTwoFactor } = await import('./authReducer')

const makeStore = () => configureStore({ reducer: { auth } })
const signInError = (code, message) => Object.assign(new Error(message), { graphQLErrors: [{ message, extensions: { code } }] })
const jane = { id: 'u1', email: 'jane@test.sacco', first_name: 'Jane', role: 'USER' }

beforeEach(() => {
  mutate.mockReset()
  localStorage.clear()
})

describe('sign-in steps', () => {
  it('a plain sign-in finishes at once and remembers the user', async () => {
    const store = makeStore()
    mutate.mockResolvedValue({ data: { login: { success: true, user: jane, twoFactorRequired: false, mustChangePassword: false } } })
    await store.dispatch(login({ email: jane.email, password: 'member123' }))
    expect(store.getState().auth).toMatchObject({ isAuthenticated: true, user: jane, pending: null, status: 'succeeded' })
  })

  it('with 2-step on, waits for the code, then finishes', async () => {
    const store = makeStore()
    mutate.mockResolvedValueOnce({ data: { login: { twoFactorRequired: true, challengeToken: 'challenge', user: { first_name: 'Jane' } } } })
    await store.dispatch(login({ email: jane.email, password: 'member123' }))
    expect(store.getState().auth).toMatchObject({ isAuthenticated: false, pending: { step: 'code', challengeToken: 'challenge', firstName: 'Jane' } })

    mutate.mockRejectedValueOnce(signInError('INVALID_CODE', 'That code is not correct'))
    await store.dispatch(verifyTwoFactor({ challengeToken: 'challenge', code: '000000' }))
    expect(store.getState().auth).toMatchObject({ isAuthenticated: false, errorCode: 'INVALID_CODE', pending: { step: 'code' } })

    mutate.mockResolvedValueOnce({ data: { verifyTwoFactor: { user: jane, twoFactorRequired: false } } })
    await store.dispatch(verifyTwoFactor({ challengeToken: 'challenge', code: '123456' }))
    expect(store.getState().auth).toMatchObject({ isAuthenticated: true, pending: null, error: null })
  })

  it('an expired challenge sends the user back to the password', async () => {
    const store = makeStore()
    mutate.mockResolvedValueOnce({ data: { login: { twoFactorRequired: true, challengeToken: 'old', user: {} } } })
    await store.dispatch(login({ email: jane.email, password: 'member123' }))
    mutate.mockRejectedValueOnce(signInError('CHALLENGE_EXPIRED', 'Sign in again'))
    await store.dispatch(verifyTwoFactor({ challengeToken: 'old', code: '123456' }))
    expect(store.getState().auth.pending).toBeNull()
  })

  it('a temporary password asks for a new one before signing in', async () => {
    const store = makeStore()
    mutate.mockResolvedValueOnce({ data: { login: { user: jane, mustChangePassword: true, twoFactorRequired: false } } })
    await store.dispatch(login({ email: jane.email, password: 'Temp2026x' }))
    expect(store.getState().auth).toMatchObject({ isAuthenticated: false, pending: { step: 'newPassword' } })
    mutate.mockResolvedValueOnce({ data: { setNewPassword: { user: jane, mustChangePassword: false, twoFactorRequired: false } } })
    await store.dispatch(setNewPassword({ newPassword: 'MyOwn2026x' }))
    expect(store.getState().auth.isAuthenticated).toBe(true)
  })

  it('a wrong password shows a message and can be cancelled back to the start', async () => {
    const store = makeStore()
    mutate.mockRejectedValueOnce(signInError('INVALID_CREDENTIALS', 'Invalid email or password'))
    await store.dispatch(login({ email: jane.email, password: 'nope' }))
    expect(store.getState().auth).toMatchObject({ isAuthenticated: false, status: 'failed', error: 'Invalid email or password' })
    store.dispatch(cancelSignIn())
    expect(store.getState().auth.pending).toBeNull()
  })
})
