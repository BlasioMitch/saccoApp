// Fresh demo data (deterministic: seeded random numbers), then the REST API on its side port
import { spawn, spawnSync } from 'child_process'
import { BACKEND_DIR, databaseUrl, PORTS, SECRETS, WEB_URL } from './stack.mjs'

const env = {
  ...process.env,
  ...SECRETS,
  DATABASE_URL: databaseUrl(),
  PORT: String(PORTS.backend),
  // test: emails are kept in memory, never sent
  NODE_ENV: 'test',
  EMAIL_PASSWORD: 'disabled-in-test',
  OTP_CODE: '123456',
  WEBAUTHN_RP_ID: 'localhost',
  WEBAUTHN_ORIGINS: WEB_URL,
  ALLOWED_ORIGINS: `${WEB_URL},http://localhost:${PORTS.gateway}`,
  TS_NODE_LOG_ERROR: 'true',
}

const reset = spawnSync('npm', ['run', 'db:demo', '--', '--reset'], { cwd: BACKEND_DIR, env, stdio: 'inherit' })
if (reset.status !== 0) process.exit(reset.status ?? 1)

const server = spawn('node', ['--loader', 'ts-node/esm', 'src/server.ts'], { cwd: BACKEND_DIR, env, stdio: 'inherit' })
const stop = () => server.kill('SIGTERM')
process.on('SIGTERM', stop)
process.on('SIGINT', stop)
server.on('exit', code => process.exit(code ?? 0))
