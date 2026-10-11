import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { cancelSignIn, login, loginWithPasskey, logout, setNewPassword, verifyTwoFactor } from '../../reducers/authReducer'
import PasskeyOfferDialog from '../../components/auth/PasskeyOfferDialog'
import { hasPasskeys, passkeyOfferDismissed, passkeysSupported, platformPasskeyAvailable } from '../../auth/passkeys'
import { CloudOff, Fingerprint, HandCoins, PiggyBank, Smartphone } from 'lucide-react'
import LoginForm from '../../components/forms/LoginForm'
import CodeStep from '../../components/auth/CodeStep'
import NewPasswordStep from '../../components/auth/NewPasswordStep'
import ForgotPasswordDialog from '../../components/auth/ForgotPasswordDialog'
import { toast } from 'sonner'
import BrandMark from '../../components/ui/BrandMark'

const FEATURES = [
  { icon: PiggyBank, title: 'Save regularly', text: 'Every deposit and withdrawal is recorded, with a receipt for the member.' },
  { icon: HandCoins, title: 'Borrow at SACCO rates', text: 'Members apply from their phone; managers approve or decline in one place.' },
  { icon: CloudOff, title: 'Keeps working offline', text: 'Record transactions without a connection; they sync once you are back online.' },
]

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
    <LoginForm onSubmit={handleSubmit} onForgotPassword={openForgot} onEmailChange={setTypedEmail} loading={loading}>
      {passkeysSupported() && (
        <>
          <div className="flex items-center gap-3 text-xs text-custom-text-muted" aria-hidden="true">
            <span className="h-px flex-1 bg-custom-bg-tertiary" />or<span className="h-px flex-1 bg-custom-bg-tertiary" />
          </div>
          <button
            type="button"
            onClick={handlePasskey}
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-custom-brand-primary text-sm font-medium text-custom-brand-primary transition-colors hover:bg-custom-interactive-hover disabled:opacity-60"
          >
            <Fingerprint className="h-4 w-4" aria-hidden="true" />
            Sign in with fingerprint or passkey
          </button>
        </>
      )}
    </LoginForm>
  )

  return (
    <div className="flex min-h-screen w-full">
      {/* Welcome panel on the brand green (the sidebar's colours, both themes) */}
      <section className="app-sidebar relative hidden overflow-hidden bg-custom-bg-secondary text-custom-text-primary md:flex md:w-3/5 lg:w-2/3 flex-col justify-between p-10 xl:p-14">
        <BrandMark variant="sprout" className="pointer-events-none absolute -bottom-20 -right-20 h-[26rem] w-[26rem] text-custom-brand-primary opacity-[0.06]" label="" />
        <div className="flex items-center gap-3">
          <BrandMark variant="sprout" className="h-11 w-11 text-custom-brand-primary" />
          <div>
            <p className="text-lg font-bold leading-tight">Green Sprout SACCO</p>
            <p className="text-xs text-custom-text-secondary">Savings and credit cooperative</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <h1 className="text-3xl font-bold leading-tight xl:text-4xl">Grow your savings.<br />Borrow with confidence.</h1>
          <p className="mt-4 text-base text-custom-text-secondary xl:text-lg">
            Everything the SACCO office needs in one place: members, savings, loans and the books.
          </p>
          <ul className="mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-custom-bg-primary text-custom-brand-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-sm text-custom-text-secondary">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-custom-text-muted">
          <Smartphone className="h-4 w-4" aria-hidden="true" />
          Members: use the Green Sprout app on your phone to follow your savings and loans.
        </p>
      </section>

      {/* Sign-in */}
      <main className="flex w-full flex-col items-center justify-center gap-6 bg-custom-bg-primary px-4 py-10 md:w-2/5 lg:w-1/3">
        <div className="flex items-center gap-2 md:hidden">
          <BrandMark variant="sprout" className="h-9 w-9 text-custom-brand-primary" />
          <span className="text-lg font-bold text-custom-text-primary">Green Sprout SACCO</span>
        </div>
        {form}
        <p className="text-xs text-custom-text-muted">&copy; {new Date().getFullYear()} Green Sprout SACCO</p>
      </main>
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} initialEmail={forgotEmail} />
      {offerFor && <PasskeyOfferDialog user={offerFor.user} onDone={() => enterApp(offerFor.message)} />}
    </div>
  )
}

export default Login
