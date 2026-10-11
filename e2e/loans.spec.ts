import { expect, test } from '@playwright/test'
import { MANAGER, signInAndWait } from './support/helpers'
// @ts-ignore plain JS helper
import { query } from './support/db.mjs'

const pendingCount = async () => Number((await query(`SELECT count(*) FROM loans WHERE status = 'PENDING'`))[0].count)

test('a manager approves one application and declines another', async ({ page }) => {
  const before = await pendingCount()
  test.skip(before < 2, 'the demo data has fewer than two waiting applications')

  await signInAndWait(page, MANAGER)
  await page.goto('/home/loan-applications')
  await expect(page.locator('tbody tr').first()).toBeVisible()

  await page.locator('tbody').getByRole('button', { name: 'Approve' }).first().click()
  await page.getByRole('dialog').getByRole('button', { name: 'Approve' }).click()
  await expect.poll(pendingCount).toBe(before - 1)
  // The approved application leaves the Pending list before the next decision
  await expect(page.locator('tbody tr')).toHaveCount(before - 1)

  await page.locator('tbody').getByRole('button', { name: 'Reject' }).first().click()
  await page.getByRole('dialog').locator('textarea, input').last().fill('Income too low for this amount')
  await page.getByRole('dialog').locator('button[type=submit]').click()
  await expect.poll(pendingCount).toBe(before - 2)

  const rejected = await query(`SELECT status FROM loans WHERE "decisionNote" = 'Income too low for this amount'`)
  expect(rejected).toEqual([{ status: 'REJECTED' }])
})
