import React, { useState } from 'react'
import { cardClass, fieldClass, labelClass, linkClass, submitClass } from '../auth/authStyles'

// Step 1 of sign-in: email and password. `children` go at the bottom of the card (e.g. passkey sign-in).
function LoginForm({ onSubmit, onForgotPassword, onEmailChange, loading = false, children }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  return (
    <div className={cardClass}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-custom-text-primary">Sign in</h2>
        <p className="text-sm text-custom-text-secondary">Use the email and password from your SACCO.</p>
      </div>
      <form onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
        <div>
          <label htmlFor="login-email" className={labelClass}>Email</label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="username"
            className={fieldClass}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => { setFormData({ ...formData, email: e.target.value }); onEmailChange?.(e.target.value) }}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className={labelClass}>Password</label>
            <button type="button" onClick={() => onForgotPassword?.(formData.email)} className={linkClass}>
              Forgot password?
            </button>
          </div>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            className={fieldClass}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className={submitClass}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      {children}
      <p className="text-center text-xs text-custom-text-muted">
        New member? Register at the SACCO office.
      </p>
    </div>
  )
}

export default LoginForm
