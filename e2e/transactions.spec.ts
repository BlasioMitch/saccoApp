import { expect, test } from '@playwright/test'
import { ADMIN, signInAndWait } from './support/helpers'
// @ts-ignore plain JS helper
import { aMember, query } from './support/db.mjs'

const balance = async (accountId: string) => Number((await query('SELECT balance FROM accounts WHERE id = $1', [accountId]))[0].balance)

async function record(page: any, type: string, accountId: string, amount: number) {
  await page.getByRole('button', { name: 'Add Transaction' }).click()
  await page.locator('select[name=type]').selectOption(type)
  await page.locator('select[name=accountId]').selectOption(accountId)
  await page.locator('input[name=amount]').fill(String(amount))
  await page.locator('form button[type=submit]').click()
}

test('a deposit raises the balance; a withdrawal over it is refused', async ({ page }) => {
  const member = await aMember(2)
  const before = await balance(member.accountId)

  await signInAndWait(page, ADMIN)
  await page.goto('/home/transactions')
  await expect(page.locator('tbody tr').first()).toBeVisible()

  await record(page, 'SAVINGS_DEPOSIT', member.accountId, 4321)
  await expect(page.getByText('Transaction created successfully')).toBeVisible()
  expect(await balance(member.accountId)).toBe(before + 4321)

  // The form stops an overdraft before it is sent (the server refuses it too: see the API tests)
  await record(page, 'ACCOUNT_WITHDRAW', member.accountId, before + 4321 + 1)
  await expect(page.getByText(/Cannot withdraw more than the available/)).toBeVisible()
  expect(await balance(member.accountId)).toBe(before + 4321)
})
