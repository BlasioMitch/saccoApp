// Rules shared by forms and the CSV importer, kept in step with the server
import { describe, expect, it } from 'vitest'
import { normalizeHeader, parseCsv, parseCsvRows, toCsv } from './csv'
import { formatUGX, parseUGX } from './currency'
import { addMonths, summarize, termInMonths } from './loanTerms'
import { defaultAmount, ELIGIBILITY, loanPaymentDefault, MEMBERSHIP_FEE_AMOUNT, savingsPaymentDefault } from './transactionRules'

describe('CSV', () => {
  it('reads quoted cells, escaped quotes, CRLF, a BOM and blank lines', () => {
    const text = '﻿name,note\r\n"Smith, Jane","She said ""hi"""\r\n\r\nBob,plain\n'
    expect(parseCsvRows(text)).toEqual([['name', 'note'], ['Smith, Jane', 'She said "hi"'], ['Bob', 'plain']])
  })

  it('maps headers by name or alias, reports missing required ones, and numbers lines', () => {
    const columns = [{ key: 'first_name', aliases: ['First Name'], required: true }, { key: 'email', required: true }, { key: 'contact' }]
    const result = parseCsv('First Name,Phone\nJane,0772\n', columns)
    expect(result.rows).toEqual([{ line: 2, values: { first_name: 'Jane' } }])
    expect(result.missingHeaders).toEqual(['email'])
    expect(result.unknownHeaders).toEqual(['Phone'])
    expect(normalizeHeader(' First-Name ')).toBe('first_name')
  })

  it('writes CSV that reads back the same', () => {
    const rows = [{ a: 'x,y', b: 'say "no"' }, { a: null, b: 3 }]
    const text = toCsv(rows, [{ key: 'a' }, { key: 'b' }])
    expect(parseCsvRows(text)).toEqual([['a', 'b'], ['x,y', 'say "no"'], ['', '3']])
  })
})

describe('money', () => {
  it('shows whole shillings and reads them back', () => {
    expect(formatUGX(1234567)).toMatch(/UGX\s?1,234,567$/)
    expect(formatUGX(null)).toBe('')
    expect(parseUGX('UGX 1,234,567')).toBe(1234567)
  })
})

describe('loan terms (same rounding as the server)', () => {
  it('flat interest and monthly payments rounded up', () => {
    expect(summarize(1_000_000, 12, 12)).toEqual({ totalInterest: 120_000, totalDue: 1_120_000, monthlyPayment: 93_334 })
  })

  it('counts a partial month as a period', () => {
    expect(termInMonths('2026-01-31', '2026-02-28')).toBe(1)
    expect(termInMonths('2026-01-01', '2026-07-01')).toBe(6)
    expect(termInMonths('2026-01-10', '2026-02-11')).toBe(2)
    expect(termInMonths('2026-02-01', '2026-01-01')).toBe(0)
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28')
  })
})

describe('transaction rules', () => {
  const account = { status: 'ACTIVE', balance: 50_000, paidMembership: false, loans: [{ status: 'ACTIVE', summary: { monthlyPayment: 93_334, remainingBalance: 40_000 } }] }

  it('decides which accounts can take each type', () => {
    expect(ELIGIBILITY.MEMBERSHIP_FEE(account)).toBe(true)
    expect(ELIGIBILITY.MEMBERSHIP_FEE({ ...account, paidMembership: true })).toBe(false)
    expect(ELIGIBILITY.ACCOUNT_WITHDRAW({ ...account, balance: 0 })).toBe(false)
    expect(ELIGIBILITY.LOAN_PAYMENT(account)).toBe(true)
    // An account with an open loan can't be closed
    expect(ELIGIBILITY.CLOSURE_WITHDRAW(account)).toBe(false)
  })

  it('suggests one instalment, never more than is owed or than the savings hold', () => {
    const loan = account.loans[0]
    expect(loanPaymentDefault(loan)).toBe(40_000)
    expect(savingsPaymentDefault(loan, { balance: 25_000 })).toBe(25_000)
    expect(defaultAmount('MEMBERSHIP_FEE')).toBe(MEMBERSHIP_FEE_AMOUNT)
  })
})
