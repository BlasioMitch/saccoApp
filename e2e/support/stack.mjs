// Where the end-to-end stack runs: side ports and its own database, so it never touches finapp or the
// services you run yourself. The sibling repos are expected next to this one (override with *_DIR).
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const WEB_DIR = path.resolve(here, '../..')
export const BACKEND_DIR = path.resolve(process.env.SACCOBACK_DIR || path.join(WEB_DIR, '../saccoback'))
export const GATEWAY_DIR = path.resolve(process.env.GRAPHSACCO_DIR || path.join(WEB_DIR, '../graphsacco'))

export const PORTS = { backend: 3101, gateway: 4100, web: 5175 }
export const WEB_URL = `http://localhost:${PORTS.web}`
export const GATEWAY_URL = `http://localhost:${PORTS.gateway}`

// E2E_DATABASE_URL, or saccoback's .env database renamed to finapp_e2e_demo (the demo-data script only
// writes to databases whose name ends in _demo)
export function databaseUrl() {
  if (process.env.E2E_DATABASE_URL) return process.env.E2E_DATABASE_URL
  const envFile = path.join(BACKEND_DIR, '.env')
  const line = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8').split('\n').find(entry => entry.startsWith('DATABASE_URL=')) : null
  if (!line) throw new Error('Set E2E_DATABASE_URL (a database whose name ends in _demo)')
  const url = new URL(line.slice('DATABASE_URL='.length).trim())
  url.pathname = '/finapp_e2e_demo'
  url.search = ''
  return url.toString()
}

// Shared by the backend and the gateway (they must match); test-only values
export const SECRETS = { INTERNAL_API_KEY: 'e2e-internal-key', JWT_SECRET: 'e2e-jwt-secret' }
