// Tables: skeleton rows on first load; a change made offline shows as "Waiting to sync" and can't be opened yet
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DataTable } from './TableShell'

const columns = [{ accessorKey: 'name', header: 'Name' }, { accessorKey: 'amount', header: 'Amount' }]

function Table({ data, loading = false, onRowClick }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })
  return <DataTable table={table} loading={loading} onRowClick={onRowClick} empty={<p>Nothing yet</p>} />
}

describe('DataTable', () => {
  it('shows placeholder rows instead of "nothing yet" while the first load runs', () => {
    const { container } = render(<Table data={[]} loading />)
    expect(screen.queryByText('Nothing yet')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('shows the empty message once loaded', () => {
    render(<Table data={[]} />)
    expect(screen.getByText('Nothing yet')).toBeInTheDocument()
  })

  it('marks waiting rows and only opens synced ones', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<Table data={[{ name: 'Synced row', amount: 1 }, { name: 'Offline row', amount: 2, syncStatus: 'pending' }]} onRowClick={onRowClick} />)
    expect(screen.getAllByText('Waiting to sync')).toHaveLength(1)
    await user.click(screen.getByText('Offline row'))
    expect(onRowClick).not.toHaveBeenCalled()
    await user.click(screen.getByText('Synced row'))
    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ name: 'Synced row' }))
  })
})
