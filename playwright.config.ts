import { defineConfig, devices } from '@playwright/test'
// @ts-ignore plain JS helper
import { GATEWAY_DIR, PORTS, SECRETS, WEB_URL } from './e2e/support/stack.mjs'

// End-to-end: the real backend, gateway and a production build of this app (with its service worker),
// started on side ports against a fresh demo database. Run: npm run test:e2e
export default defineConfig({
  testDir: './e2e',
  // One stack, shared data: specs run one after another
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1360, height: 860 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1360, height: 860 } } }],
  webServer: [
    {
      command: 'node e2e/support/start-backend.mjs',
      url: `http://localhost:${PORTS.backend}/health`,
      timeout: 240_000,
      reuseExistingServer: false,
      stdout: 'ignore',
    },
    {
      command: 'node --loader ts-node/esm src/server.ts',
      cwd: GATEWAY_DIR,
      port: PORTS.gateway,
      timeout: 120_000,
      reuseExistingServer: false,
      stdout: 'ignore',
      env: {
        ...SECRETS,
        PORT: String(PORTS.gateway),
        REST_API_URL: `http://localhost:${PORTS.backend}`,
        ALLOWED_ORIGINS: WEB_URL,
        TS_NODE_LOG_ERROR: 'true',
      },
    },
    {
      // Built outside dist/ (dist is tracked in git)
      command: `npx vite build --outDir e2e/.build --emptyOutDir && npx vite preview --outDir e2e/.build --port ${PORTS.web} --strictPort`,
      url: WEB_URL,
      timeout: 240_000,
      reuseExistingServer: false,
      env: { VITE_GRAPHQL_PROD_URI: `http://localhost:${PORTS.gateway}` },
    },
  ],
})
