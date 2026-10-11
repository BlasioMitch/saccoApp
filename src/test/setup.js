// Unit test setup: jest-dom matchers, an in-memory IndexedDB (localforage uses it), and a clean DOM per test
import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())
