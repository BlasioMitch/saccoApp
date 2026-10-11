// The top-bar pill: always visible, saying whether everything reached the server
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

vi.mock('../../offline/sync', () => ({ syncOutbox: vi.fn(async () => ({ sent: 0, failed: 0 })) }))

const { default: OfflineStatus } = await import('./OfflineStatus')
const { enqueue, failItem, getOutbox, removeItem } = await import('../../offline/outbox')
const network = await import('../../offline/network')

const store = configureStore({ reducer: { auth: (state = { user: { id: 'staff-1' }, isAuthenticated: true }) => state } })
const pill = () => screen.getByRole('button', { expanded: false })

const renderPill = () => render(<Provider store={store}><OfflineStatus /></Provider>)

beforeEach(() => {
  act(() => {
    for (const item of getOutbox()) removeItem(item.id)
    network.markServerReachable()
    network.setSyncing(false)
    window.dispatchEvent(new Event('online'))
  })
})

describe('OfflineStatus', () => {
  it('says Synced when online with nothing waiting', () => {
    renderPill()
    expect(pill()).toHaveAccessibleName(/^Synced/)
  })

  it('says Offline, then how many changes are waiting', () => {
    renderPill()
    act(() => window.dispatchEvent(new Event('offline')))
    expect(pill()).toHaveAccessibleName('Offline')
    act(() => { enqueue({ userId: 'staff-1', operation: 'CREATE_TRANSACTION', label: 'Deposit', variables: {} }) })
    expect(pill()).toHaveAccessibleName('Offline · 1 waiting')
  })

  it('says Syncing while changes are being sent', () => {
    renderPill()
    act(() => { enqueue({ userId: 'staff-1', operation: 'CREATE_TRANSACTION', label: 'Deposit', variables: {} }) })
    act(() => network.setSyncing(true))
    expect(pill()).toHaveAccessibleName('Syncing 1…')
  })

  it('lists refused changes with Retry and Discard', async () => {
    const user = userEvent.setup()
    renderPill()
    act(() => {
      const item = enqueue({ userId: 'staff-1', operation: 'APPROVE_LOAN', label: 'Approve the loan for Jane', variables: {} })
      failItem(item.id, 'This application was already rejected')
    })
    expect(pill()).toHaveAccessibleName('1 not sent')
    await user.click(pill())
    expect(screen.getByText('This application was already rejected')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Discard: Approve the loan for Jane' }))
    expect(getOutbox()).toEqual([])
  })

  it("ignores another user's waiting changes", () => {
    renderPill()
    act(() => { enqueue({ userId: 'someone-else', operation: 'CREATE_TRANSACTION', label: 'Theirs', variables: {} }) })
    expect(pill()).toHaveAccessibleName(/^Synced/)
  })
})
