// Direct reads (and the odd setup write) on the E2E database, using saccoback's pg driver
import { createRequire } from 'module'
import path from 'path'
import { BACKEND_DIR, databaseUrl } from './stack.mjs'

const require = createRequire(path.join(BACKEND_DIR, 'package.json'))
const pg = require('pg')

export async function query(sql, params = []) {
  const client = new pg.Client({ connectionString: databaseUrl() })
  await client.connect()
  try {
    return (await client.query(sql, params)).rows
  } finally {
    await client.end()
  }
}

// A demo member with an active account and the fee paid (the generator's members all sign in with member123)
export const MEMBER_PASSWORD = 'member123'
export async function aMember(offset = 0) {
  const [row] = await query(
    `SELECT u.id, u.email, u.first_name, u.last_name, a.id AS "accountId", a."accountNumber", a.balance
       FROM users u JOIN accounts a ON a."userId" = u.id
      WHERE u.role = 'USER' AND u.status = 'ACTIVE' AND NOT u.is_deleted AND u.email LIKE '%@demo.sacco' AND a.status = 'ACTIVE' AND a."paidMembership" AND NOT a.is_deleted
      ORDER BY u.email OFFSET $1 LIMIT 1`,
    [offset],
  )
  return row
}
