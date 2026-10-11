import { expect, test } from '@playwright/test'
import { MANAGER, signIn, signInAndWait, signOut } from './support/helpers'
// @ts-ignore plain JS helper
import { aMember, MEMBER_PASSWORD, query } from './support/db.mjs'

test('forgot password: member asks, manager issues a temporary password, member replaces it', async ({ page }) => {
  const member = await aMember(1)

  // The member asks from the sign-in page
  await page.goto('/login')
  await page.getByRole('button', { name: 'Forgot password?' }).click()
  await page.getByPlaceholder('you@example.com').fill(member.email)
  await page.getByRole('dialog').locator('button[type=submit]').click()
  await expect(page.getByRole('button', { name: 'Back to sign in' })).toBeVisible()

  // A manager sees it and resets it
  await signInAndWait(page, MANAGER)
  await page.goto('/home/password-resets')
  await page.getByText(member.email).first().click()
  const temporary = await page.locator('#temp-password').inputValue()
  expect(temporary).toMatch(/^[A-Za-z0-9]{12}$/)
  await page.getByRole('button', { name: 'Reset password' }).click()
  await expect(page.getByLabel('Copy password').first()).toBeVisible()
  await signOut(page)

  // The old password no longer works; the temporary one asks for a new password
  await signIn(page, { email: member.email, password: MEMBER_PASSWORD })
  await expect(page.getByText('Invalid email or password')).toBeVisible()
  await signIn(page, { email: member.email, password: temporary })
  await page.getByLabel('New password', { exact: true }).fill('MyOwnPass2026')
  await page.getByLabel('Confirm new password').fill('MyOwnPass2026')
  await page.locator('form button[type=submit]').click()
  await page.waitForURL(url => !url.pathname.startsWith('/login'))

  const [row] = await query(`SELECT summary, "actorEmail" FROM audit_logs WHERE action = 'PASSWORD_RESET_ISSUED' ORDER BY "createdAt" DESC LIMIT 1`)
  expect(row.actorEmail).toBe(MANAGER.email)
  expect(row.summary).toContain(member.email)
})
