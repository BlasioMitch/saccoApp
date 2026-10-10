import React, { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { cardClass, fieldClass, labelClass, linkClass, submitClass } from './authStyles'

// Sign-in step 2 for members with 2-step verification on
const CodeStep = ({ firstName, loading, onSubmit, onCancel }) => {
  const [code, setCode] = useState('')

  return (
    <div className={cardClass}>
      <div className="flex flex-col items-center gap-2 text-center">
        <ShieldCheck className="h-10 w-10 text-custom-brand-primary" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-custom-text-primary">2-step verification</h2>
        <p className="text-sm text-custom-text-secondary">
          {firstName ? `Hi ${firstName}, enter` : 'Enter'} the 6-digit code to finish signing in.
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(code) }} className="space-y-4">
        <div>
          <label htmlFor="otp-code" className={labelClass}>Code</label>
          <input
            id="otp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            required
            className={`${fieldClass} text-center tracking-[0.5em] font-mono text-lg`}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <button type="submit" className={submitClass} disabled={loading || code.length !== 6}>
          {loading ? 'Checking…' : 'Verify'}
        </button>
      </form>
      <p className="text-center">
        <button type="button" onClick={onCancel} className={linkClass}>Back to sign in</button>
      </p>
    </div>
  )
}

export default CodeStep
