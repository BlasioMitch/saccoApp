import { expect, Page } from '@playwright/test'

export const ADMIN = { email: 'admin@example.com', password: 'admin123' }
export const MANAGER = { email: 'manager@example.com', password: 'manager123' }

export async function signIn(page: Page, { email, password }: { email: string; password: string }) {
  await page.goto('/login')
  await page.getByPlaceholder('Enter your email').fill(email)
  await page.getByPlaceholder('Enter your password').fill(password)
  await page.locator('form button[type=submit]').click()
}

export async function signInAndWait(page: Page, user: { email: string; password: string }) {
  await signIn(page, user)
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 })
  // A one-time passkey offer may appear after a password sign-in on a computer with a fingerprint reader
  const notNow = page.getByRole('button', { name: 'Not now' })
  if (await notNow.isVisible().catch(() => false)) await notNow.click()
}

export async function signOut(page: Page) {
  await page.getByRole('button', { name: 'Account menu' }).click()
  await page.getByText('Logout', { exact: true }).click()
  await expect(page).toHaveURL(/\/login/)
}

// The top-bar sync pill
export const syncPill = (page: Page) => page.locator('header button[aria-haspopup=dialog]').first()
