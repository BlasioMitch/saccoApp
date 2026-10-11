import { expect, test } from '@playwright/test'
import { ADMIN, signInAndWait, syncPill } from './support/helpers'
// @ts-ignore plain JS helper
import { aMember, query } from './support/db.mjs'

test('works offline and sends a queued deposit once when back online', async ({ page, context }) => {
  const member = await aMember(3)
  const count = async () => Number((await query(`SELECT count(*) FROM transactions WHERE "accountId" = $1 AND amount = 7777`, [member.accountId]))[0].count)
  expect(await count()).toBe(0)

  await signInAndWait(page, ADMIN)
  // Open the pages once online so their data is saved, and let the service worker take over
  // (page data is saved to the browser a second after it changes, so stay on each page a moment)
  for (const path of ['/home/accounts', '/home/transactions']) {
    await page.goto(path)
    await expect(page.locator('tbody tr').first()).toBeVisible()
    await page.waitForTimeout(1500)
  }
  await page.evaluate(() => navigator.serviceWorker.ready)
  await expect(syncPill(page)).toHaveAccessibleName(/^Synced/)

  await context.setOffline(true)
  await page.reload()
  await expect(page.locator('tbody tr').first()).toBeVisible()
  await expect(syncPill(page)).toHaveAccessibleName('Offline')

  await page.getByRole('button', { name: 'Add Transaction' }).click()
  await page.locator('select[name=type]').selectOption('SAVINGS_DEPOSIT')
  await page.locator('select[name=accountId]').selectOption(member.accountId)
  await page.locator('input[name=amount]').fill('7777')
  await page.locator('form button[type=submit]').click()
  await expect(syncPill(page)).toHaveAccessibleName('Offline · 1 waiting')
  // Listed under the pill (the new row itself is added at the end of the table, on its last page)
  await syncPill(page).click()
  await expect(page.getByRole('dialog', { name: 'Changes made offline' })).toContainText('Record deposit of UGX 7,777')
  await page.keyboard.press('Escape')

  await context.setOffline(false)
  await expect(syncPill(page)).toHaveAccessibleName(/^Synced/, { timeout: 30_000 })
  expect(await count()).toBe(1)

  const [row] = await query(`SELECT "clientCreatedAt" FROM audit_logs WHERE action = 'TRANSACTION_CREATE' ORDER BY "createdAt" DESC LIMIT 1`)
  expect(row.clientCreatedAt).not.toBeNull()
})
