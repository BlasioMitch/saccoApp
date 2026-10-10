import React, { useState } from 'react'
import { Fingerprint, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Button from '../ui/Button'
import { addPasskey, dismissPasskeyOffer, passkeyErrorMessage } from '../../auth/passkeys'

// Asked once after a password sign-in on a computer with a fingerprint reader / Windows Hello
const PasskeyOfferDialog = ({ user, onDone }) => {
  const [adding, setAdding] = useState(false)

  const notNow = () => {
    dismissPasskeyOffer(user.id)
    onDone()
  }

  const turnOn = async () => {
    setAdding(true)
    try {
      await addPasskey()
      toast.success('Done. Next time, sign in with your fingerprint.')
      onDone()
    } catch (error) {
      toast.error(passkeyErrorMessage(error))
      setAdding(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && notNow()}>
      <DialogContent className="w-full max-w-md rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 shadow-2xl">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-custom-interactive-focus text-custom-brand-green">
            <Fingerprint className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="text-lg font-semibold text-custom-text-primary">Sign in with your fingerprint next time?</DialogTitle>
          <DialogDescription className="text-sm text-custom-text-secondary">
            Use this computer's fingerprint reader or Windows Hello instead of your password{user?.twoFactorEnabled ? ' and code' : ''}. You can remove it in Settings.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" className="px-4" onClick={notNow} disabled={adding}>Not now</Button>
          <Button className="px-4" onClick={turnOn} disabled={adding}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
            Turn on
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PasskeyOfferDialog
