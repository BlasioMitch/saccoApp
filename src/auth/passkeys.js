import { browserSupportsWebAuthn, platformAuthenticatorIsAvailable, startAuthentication, startRegistration } from '@simplewebauthn/browser'
import client from '../graphql/client'
import { ADD_PASSKEY, MY_PASSKEYS, PASSKEY_LOGIN_OPTIONS, PASSKEY_REGISTRATION_OPTIONS } from '../graphql/queries/passkeys'
import { PASSKEY_LOGIN } from '../graphql/mutations'

// Passkeys: sign in to the web app with this computer's fingerprint reader, Windows Hello, or a phone

export const passkeysSupported = () => browserSupportsWebAuthn()

// A built-in authenticator (fingerprint reader / Windows Hello / Touch ID) is what the after-sign-in offer is about
export const platformPasskeyAvailable = async () => {
  try {
    return browserSupportsWebAuthn() && await platformAuthenticatorIsAvailable()
  } catch {
    return false
  }
}

// "Chrome on Windows" as the passkey's name in Settings and the audit trail
export const thisDeviceName = () => {
  const agent = navigator.userAgent
  const browser = /Edg\//.test(agent) ? 'Edge' : /Chrome\//.test(agent) ? 'Chrome' : /Firefox\//.test(agent) ? 'Firefox' : /Safari\//.test(agent) ? 'Safari' : 'Browser'
  const system = /Windows/.test(agent) ? 'Windows' : /Mac OS/.test(agent) ? 'Mac' : /Android/.test(agent) ? 'Android' : /iPhone|iPad/.test(agent) ? 'iOS' : /Linux/.test(agent) ? 'Linux' : 'this computer'
  return `${browser} on ${system}`
}

// The browser's own messages are technical; these are the cases people actually hit
export const passkeyErrorMessage = (error) => {
  if (error?.name === 'NotAllowedError') return 'The fingerprint or passkey prompt was closed or timed out.'
  if (error?.name === 'InvalidStateError') return 'This computer already has a passkey for your account.'
  return error?.graphQLErrors?.[0]?.message || error?.message || 'Something went wrong with the passkey.'
}

export async function addPasskey(deviceName = thisDeviceName()) {
  const { data } = await client.mutate({ mutation: PASSKEY_REGISTRATION_OPTIONS })
  const { options, challengeToken } = data.passkeyRegistrationOptions
  const response = await startRegistration({ optionsJSON: options })
  const result = await client.mutate({
    mutation: ADD_PASSKEY,
    variables: { challengeToken, response, deviceName },
    refetchQueries: [MY_PASSKEYS],
  })
  return result.data.addPasskey
}

// Returns the same AuthPayload as a password sign-in (the gateway sets the session cookie)
export async function signInWithPasskey(email) {
  const { data } = await client.mutate({ mutation: PASSKEY_LOGIN_OPTIONS, variables: { email: email || null } })
  const { options, challengeToken } = data.passkeyLoginOptions
  const response = await startAuthentication({ optionsJSON: options })
  const result = await client.mutate({ mutation: PASSKEY_LOGIN, variables: { challengeToken, response } })
  return result.data.passkeyLogin
}

export async function hasPasskeys() {
  try {
    const { data } = await client.query({ query: MY_PASSKEYS, fetchPolicy: 'network-only' })
    return data.myPasskeys.length > 0
  } catch {
    return true // unknown: don't nag
  }
}

// The offer after a password sign-in is made once per member on this browser
const offerKey = (userId) => `passkeyOfferDismissed:${userId}`
export const passkeyOfferDismissed = (userId) => {
  try { return localStorage.getItem(offerKey(userId)) === '1' } catch { return true }
}
export const dismissPasskeyOffer = (userId) => {
  try { localStorage.setItem(offerKey(userId), '1') } catch { /* storage unavailable */ }
}
