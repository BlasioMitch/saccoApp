import { expect, test } from '@playwright/test'
import { ADMIN, signIn, signOut } from './support/helpers'

// A virtual fingerprint reader (Chromium's WebAuthn test API)
test('turn on a passkey after signing in, then sign in with it', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'virtual authenticators are Chromium only')
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('WebAuthn.enable')
  await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true },
  })

  await signIn(page, ADMIN)
  await page.getByRole('button', { name: 'Turn on' }).click()
  await expect(page.getByRole('button', { name: 'Turn on' })).toBeHidden()
  await page.waitForURL(url => !url.pathname.startsWith('/login'))
  await signOut(page)

  await page.getByRole('button', { name: 'Sign in with fingerprint or passkey' }).click()
  await page.waitForURL(url => !url.pathname.startsWith('/login'))
})
