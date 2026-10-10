import React, { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { cardClass, fieldClass, labelClass, linkClass, passwordProblem, submitClass } from './authStyles'

// After signing in with a temporary password from the SACCO office: the member chooses their own
const NewPasswordStep = ({ user, loading, onSubmit, onCancel }) => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const problem = password ? passwordProblem(password) : null
  const mismatch = confirm && confirm !== password

  return (
    <div className={cardClass}>
      <div className="flex flex-col items-center gap-2 text-center">
        <KeyRound className="h-10 w-10 text-custom-brand-primary" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-custom-text-primary">Choose a new password</h2>
        <p className="text-sm text-custom-text-secondary">
          {user?.first_name ? `${user.first_name}, you` : 'You'} signed in with a temporary password. Set your own to continue.
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(password) }} className="space-y-4">
        <div>
          <label htmlFor="new-password" className={labelClass}>New password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            autoFocus
            required
            className={fieldClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="new-password-hint"
          />
          <p id="new-password-hint" className={`mt-1 text-xs ${problem ? 'text-red-500' : 'text-custom-text-muted'}`}>
            {problem || 'At least 8 characters, with letters and numbers'}
          </p>
        </div>
        <div>
          <label htmlFor="confirm-password" className={labelClass}>Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            className={fieldClass}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {mismatch && <p className="mt-1 text-xs text-red-500">The passwords do not match</p>}
        </div>
        <button type="submit" className={submitClass} disabled={loading || !password || Boolean(problem) || confirm !== password}>
          {loading ? 'Saving…' : 'Save and continue'}
        </button>
      </form>
      <p className="text-center">
        <button type="button" onClick={onCancel} className={linkClass}>Sign out</button>
      </p>
    </div>
  )
}

export default NewPasswordStep
