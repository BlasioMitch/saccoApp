import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { cancelSignIn, login, loginWithPasskey, logout, setNewPassword, verifyTwoFactor } from '../../reducers/authReducer'
import PasskeyOfferDialog from '../../components/auth/PasskeyOfferDialog'
import { hasPasskeys, passkeyOfferDismissed, passkeysSupported, platformPasskeyAvailable } from '../../auth/passkeys'
import { Fingerprint } from 'lucide-react'
import LoginForm from '../../components/forms/LoginForm'
import CodeStep from '../../components/auth/CodeStep'
import NewPasswordStep from '../../components/auth/NewPasswordStep'
import ForgotPasswordDialog from '../../components/auth/ForgotPasswordDialog'
import { toast } from 'sonner'
import BrandMark from '../../components/ui/BrandMark'

// Sign-in: email + password, then the 2-step code (if on), then a new password (after a staff reset)
const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pending = useSelector(state => state.auth.pending)
  const loading = useSelector(state => state.auth.status === 'loading')
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [offerFor, setOfferFor] = useState(null)
  const [typedEmail, setTypedEmail] = useState('')

  const enterApp = (message) => {
    toast.success(message)
    navigate('/home')
  }

  // After a password sign-in on a computer with a fingerprint reader, offer passkey sign-in once
  const shouldOfferPasskey = async (user) =>
    Boolean(user?.id) && !passkeyOfferDismissed(user.id) && await platformPasskeyAvailable() && !(await hasPasskeys())

  const runStep = async (action, doneMessage = 'Login successful!', { viaPasskey = false } = {}) => {
    try {
      const result = await dispatch(action).unwrap()
      if (result.step !== 'done') return
      if (!viaPasskey && await shouldOfferPasskey(result.user)) {
        setOfferFor({ user: result.user, message: doneMessage })
        return
      }
      enterApp(doneMessage)
    } catch (error) {
      toast.error(error?.message || 'Login failed')
    }
  }

  const handleSubmit = (e, formData) => {
    e.preventDefault()
    runStep(login({ ...formData, email: formData.email.trim() }))
  }

  const handlePasskey = () => runStep(loginWithPasskey({ email: typedEmail.trim() }), 'Signed in with your passkey', { viaPasskey: true })

  const openForgot = (email) => {
    setForgotEmail(email || '')
    setForgotOpen(true)
  }

  const step = pending?.step
  const form = step === 'code' ? (
    <CodeStep
      firstName={pending.firstName}
      loading={loading}
      onSubmit={(code) => runStep(verifyTwoFactor({ challengeToken: pending.challengeToken, code }))}
      onCancel={() => dispatch(cancelSignIn())}
    />
  ) : step === 'newPassword' ? (
    <NewPasswordStep
      user={pending.user}
      loading={loading}
      onSubmit={(newPassword) => runStep(setNewPassword({ newPassword }), 'Password saved. Welcome back!')}
      // The temporary-password session already has a cookie: sign out clears it
      onCancel={() => dispatch(logout())}
    />
  ) : (
    <div className="space-y-4">
      <LoginForm onSubmit={handleSubmit} onForgotPassword={openForgot} onEmailChange={setTypedEmail} loading={loading} />
      {passkeysSupported() && (
        <button
          type="button"
          onClick={handlePasskey}
          disabled={loading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-custom-brand-primary text-sm font-medium text-custom-brand-primary transition-colors hover:bg-custom-interactive-hover disabled:opacity-60"
        >
          <Fingerprint className="h-4 w-4" aria-hidden="true" />
          Sign in with fingerprint or passkey
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Landing content, on the brand green (same as the sidebar, both themes) */}
      <div className="app-sidebar hidden md:flex w-2/3 bg-custom-bg-secondary text-custom-text-primary p-8 flex-col justify-center">
        <BrandMark className="mb-6 h-20 w-20 text-custom-brand-primary" />
        <h1 className="text-3xl xl:text-4xl font-bold mb-4">Welcome to Green Sprout</h1>
        <p className="text-lg mb-6 text-custom-text-secondary">Your trusted platform for managing savings and loans efficiently.</p>
        <div className="flex gap-4">
          <button 
            // onClick={() => navigate('/register')}
            className="w-full md:w-auto h-12 px-6 bg-custom-brand-primary text-custom-interactive-active-text rounded-lg hover:bg-custom-brand-dark transition-colors"
          >
            Get Started
          </button>
          <button 
            // onClick={() => navigate('/about')}
            className="w-full md:w-auto h-12 px-6 border border-custom-brand-primary text-custom-brand-primary rounded-lg hover:bg-custom-interactive-hover transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-custom-bg-primary p-8">
        <div className="w-full max-w-md">
          <h2 className="text-xl xl:text-2xl font-bold mb-6 text-center text-custom-text-primary">Login to Your Account</h2>
          {form}
        </div>
      </div>
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} initialEmail={forgotEmail} />
      {offerFor && <PasskeyOfferDialog user={offerFor.user} onDone={() => enterApp(offerFor.message)} />}
    </div>
  )
}

export default Login
