import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { MailCheck } from 'lucide-react'
import client from '../../graphql/client'
import { REQUEST_PASSWORD_RESET } from '../../graphql/mutations'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Button from '../ui/Button'
import { fieldClass, labelClass } from './authStyles'

// "Forgot password?": the SACCO office is asked to set a temporary password, which is emailed to the member
const ForgotPasswordDialog = ({ open, onOpenChange, initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail)
  const [sending, setSending] = useState(false)
  const [sentMessage, setSentMessage] = useState(null)

  useEffect(() => {
    if (open) {
      setEmail(initialEmail)
      setSentMessage(null)
    }
  }, [open, initialEmail])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const { data } = await client.mutate({ mutation: REQUEST_PASSWORD_RESET, variables: { email: email.trim() } })
      setSentMessage(data.requestPasswordReset.message)
    } catch (error) {
      toast.error(error?.graphQLErrors?.[0]?.message || error.message || 'Could not send the request')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-custom-text-primary">Forgot password?</DialogTitle>
          <DialogDescription className="text-sm text-custom-text-secondary">
            Enter the email you sign in with. The SACCO office will set a temporary password and email it to you.
          </DialogDescription>
        </DialogHeader>

        {sentMessage ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-custom-bg-secondary p-4 text-sm text-custom-text-primary">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-custom-brand-primary" aria-hidden="true" />
              <p>{sentMessage}</p>
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>Back to sign in</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className={labelClass}>Email</label>
              <input
                id="forgot-email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                className={fieldClass}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" className="px-4" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="px-4" disabled={sending || !email.trim()}>
                {sending ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordDialog
