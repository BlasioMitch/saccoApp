import { expect, test } from '@playwright/test'
import { ADMIN, MANAGER, signInAndWait, signOut } from './support/helpers'

test('admins see the audit trail; managers are kept out', async ({ page }) => {
  await signInAndWait(page, ADMIN)
  await page.goto('/home/audit')
  await expect(page.locator('tbody tr').first()).toBeVisible()
  await expect(page.locator('tbody')).toContainText('Signed in')
  await signOut(page)

  await signInAndWait(page, MANAGER)
  await page.goto('/home/audit')
  await expect(page).not.toHaveURL(/\/home\/audit/)
})
