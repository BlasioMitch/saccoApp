import { expect, test } from '@playwright/test'
import { ADMIN, signInAndWait } from './support/helpers'

test('the books balance and print', async ({ page }) => {
  await signInAndWait(page, ADMIN)
  await page.goto('/home/reports')

  await page.getByRole('tab', { name: 'Trial balance' }).click()
  await expect(page.getByText('Debits equal credits.')).toBeVisible()

  await page.getByRole('tab', { name: 'Balance sheet' }).click()
  await expect(page.getByText('Assets equal liabilities plus equity.')).toBeVisible()

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF' }).click()
  expect((await download).suggestedFilename()).toMatch(/^balance-sheet_\d{4}-\d{2}-\d{2}\.pdf$/)
})
