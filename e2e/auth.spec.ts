import { expect, test } from '@playwright/test'
import { ADMIN, signIn, signInAndWait, signOut } from './support/helpers'
// @ts-ignore plain JS helper
import { aMember, MEMBER_PASSWORD, query } from './support/db.mjs'

test('staff sign in to the dashboard and sign out', async ({ page }) => {
  await signInAndWait(page, ADMIN)
  await expect(page).toHaveURL(/\/home/)
  await signOut(page)
})

test('a wrong password is refused with a message', async ({ page }) => {
  await signIn(page, { email: ADMIN.email, password: 'not-the-password' })
  await expect(page.getByText('Invalid email or password')).toBeVisible()
  await expect(page).toHaveURL(/\/login/)
})

test('a member with 2-step verification needs the code', async ({ page }) => {
  const member = await aMember(5)
  await query('UPDATE users SET "twoFactorEnabled" = true WHERE id = $1', [member.id])
  try {
    await signIn(page, { email: member.email, password: MEMBER_PASSWORD })
    const code = page.getByPlaceholder('••••••')
    await expect(code).toBeVisible()
    await code.fill('000000')
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText(/code is not correct/i)).toBeVisible()
    await code.fill('123456')
    await page.locator('form button[type=submit]').click()
    await page.waitForURL(url => !url.pathname.startsWith('/login'))
  } finally {
    await query('UPDATE users SET "twoFactorEnabled" = false WHERE id = $1', [member.id])
  }
})
