import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import { toast } from 'sonner'
import { Fingerprint, KeyRound, Loader2, Trash2 } from 'lucide-react'
import { MY_PASSKEYS, REMOVE_PASSKEY } from '../../graphql/queries/passkeys'
import { addPasskey, passkeyErrorMessage, passkeysSupported, platformPasskeyAvailable } from '../../auth/passkeys'
import Button from '../ui/Button'

// Settings: sign in with this computer's fingerprint reader / Windows Hello, or a phone, instead of a password
const PasskeyCard = ({ Card }) => {
  const supported = passkeysSupported()
  const [platform, setPlatform] = useState(false)
  const [adding, setAdding] = useState(false)
  const { data, loading } = useQuery(MY_PASSKEYS, { skip: !supported, fetchPolicy: 'cache-and-network' })
  const [remove, { loading: removing }] = useMutation(REMOVE_PASSKEY, { refetchQueries: [MY_PASSKEYS] })
  const passkeys = data?.myPasskeys ?? []

  useEffect(() => { platformPasskeyAvailable().then(setPlatform) }, [])

  const add = async () => {
    setAdding(true)
    try {
      await addPasskey()
      toast.success('Passkey added. Next time, sign in with your fingerprint.')
    } catch (error) {
      toast.error(passkeyErrorMessage(error))
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card
      title="Fingerprint and passkeys"
      description={platform
        ? 'Sign in with this computer\'s fingerprint reader or Windows Hello instead of your password and code.'
        : 'Sign in with a passkey (a phone or security key) instead of your password and code.'}
    >
      {!supported ? (
        <p className="text-sm text-custom-text-secondary">This browser does not support passkeys.</p>
      ) : (
        <div className="space-y-3">
          {loading && !data && <p className="text-sm text-custom-text-secondary">Loading…</p>}
          {passkeys.length > 0 && (
            <ul className="divide-y divide-custom-bg-tertiary rounded-lg border border-custom-bg-tertiary">
              {passkeys.map(passkey => (
                <li key={passkey.id} className="flex items-center gap-3 px-3 py-2">
                  <KeyRound className="h-4 w-4 shrink-0 text-custom-brand-green" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-custom-text-primary">{passkey.deviceName || 'Passkey'}</p>
                    <p className="text-xs text-custom-text-secondary">
                      Added {moment(passkey.createdAt).format('D MMM YYYY')}
                      {passkey.lastUsedAt && ` · last used ${moment(passkey.lastUsedAt).fromNow()}`}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove ${passkey.deviceName || 'passkey'}`}
                    title="Remove"
                    disabled={removing}
                    onClick={() => remove({ variables: { id: passkey.id } }).then(() => toast.success('Passkey removed')).catch(error => toast.error(error.message))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button variant="secondary" className="px-4" onClick={add} disabled={adding}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
            {platform ? 'Use this computer\'s fingerprint' : 'Add a passkey'}
          </Button>
          <p className="text-xs text-custom-text-muted">Passkeys stop working when your password is changed or reset, or when 2-step verification is turned on.</p>
        </div>
      )}
    </Card>
  )
}

export default PasskeyCard
