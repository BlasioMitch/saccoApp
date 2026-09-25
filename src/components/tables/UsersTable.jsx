import React, { useState } from 'react'
import { MoreVertical, Eye, Pencil, Trash2, UserPlus } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { deleteUser } from '../../reducers/userReducer'
import { toast } from 'sonner'
import { TableToolbar, DataTable, TablePagination, SortableHeader } from './TableShell'
import DropdownMenu from '../ui/DropdownMenu'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'

const inputClass = 'h-10 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary placeholder:text-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, user }) => {
  const [deleteText, setDeleteText] = useState('')
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold leading-6 text-custom-text-primary">Delete Member</DialogTitle>
          <DialogDescription className="text-sm text-custom-text-secondary">
            {user?.hasAccount ? (
              <span className="block space-y-2">
                <span className="block">This member has an active account. Deleting this member will also delete their account.</span>
                <span className="block font-medium text-yellow-700 dark:text-yellow-400">This action cannot be allowed.</span>
              </span>
            ) : (
              <span>This action cannot be undone. Type "delete" to confirm.</span>
            )}
          </DialogDescription>
        </DialogHeader>
        {!user?.hasAccount && (
          <input
            type="text"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className={`${inputClass} mt-4 w-full`}
          />
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {!user?.hasAccount && (
            <Button variant="danger" onClick={onConfirm} disabled={deleteText !== 'delete'}>
              Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Same hues as before, legible in both themes
const ROLE_STYLES = {
  ADMIN: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  MANAGER: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
}

const Pill = ({ className, children }) => (
  <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ${className}`}>{children}</span>
)

const sortable = (label) => ({ column }) => <SortableHeader column={column} label={label} />

function UsersTable({ users, onEdit, onView }) {
  const dispatch = useDispatch()
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [filtering, setFiltering] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleEditClick = (user) => {
    onEdit(user)
  }
  
  const handleViewClick = (user) => { 
    onView(user); // Call the onView prop, which is handleOpenDetailsModal in Team
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap()
      toast.success('Member deleted successfully')
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    } catch (error) {
      toast.error(error || 'Failed to delete member')
    }
  }

  const columns = [
    {
      id: 'fullName',
      meta: { label: 'Full Name', emphasis: 'primary' },
      header: sortable('Full Name'),
      accessorFn: (row) => `${row.first_name || ''} ${row.last_name || ''} ${row.other_name || ''}`.trim(),
      filterFn: 'nameFilter',
    },
    {
      accessorKey: 'email',
      meta: { label: 'Email' },
      header: sortable('Email'),
    },
    {
      accessorKey: 'contact',
      meta: { label: 'Contact' },
      header: sortable('Contact'),
    },
    {
      accessorKey: 'gender',
      meta: { label: 'Gender' },
      header: sortable('Gender'),
    },
    {
      accessorKey: 'role',
      meta: { label: 'Role' },
      header: sortable('Role'),
      cell: ({ row }) => (
        <Pill className={ROLE_STYLES[row.original.role] || 'bg-custom-bg-tertiary text-custom-text-secondary'}>
          {row.original.role}
        </Pill>
      ),
    },
    {
      accessorKey: 'dob',
      meta: { label: 'Birth Date' },
      header: sortable('Birth Date'),
      cell: ({ row }) => moment(new Date(row.getValue('dob'))).format('DD/MMM/YYYY'),
    },
    {
      accessorKey: 'joinDate',
      meta: { label: 'Join Date' },
      header: sortable('Join Date'),
      cell: ({ row }) => moment(new Date(row.getValue('joinDate'))).format('DD/MMM/YYYY'),
    },
    {
      accessorKey: 'status',
      meta: { label: 'Status' },
      header: sortable('Status'),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'hasAccount',
      meta: { label: 'Account Status' },
      header: sortable('Account Status'),
      cell: ({ row }) => (
        <Pill className={row.original.hasAccount
          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
          : 'bg-custom-bg-tertiary text-custom-text-secondary'}
        >
          {row.original.hasAccount ? 'Has Account' : 'No Account'}
        </Pill>
      ),
    },
  ]

  const actionColumn = {
    id: 'actions',
    header: '',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <DropdownMenu
        ariaLabel="Member actions"
        label={<MoreVertical className="h-4 w-4" />}
        items={[
          { label: 'View Details', icon: Eye, onClick: () => handleViewClick(row.original) },
          { label: 'Edit', icon: Pencil, onClick: () => handleEditClick(row.original) },
          { label: 'Delete', icon: Trash2, danger: true, onClick: () => handleDeleteClick(row.original) },
        ]}
      />
    ),
  };

  const allColumns = [
    ...columns,
    actionColumn
  ];

  const table = useReactTable({
    data: users,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      nameFilter: (row, id, filterValue) => {
        const first = row.original.first_name || ''
        const last = row.original.last_name || ''
        const other = row.original.other_name || ''
        const fullName = `${first} ${last} ${other}`.trim().toLowerCase()
        return fullName.includes(filterValue.toLowerCase())
      }
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const activeFilter = table.getState().columnFilters[0]

  return (
    <>
      <TableToolbar search={filtering} onSearch={setFiltering} placeholder="Search all columns...">
        <select
          value={activeFilter?.id || ''}
          onChange={(e) => {
            if (e.target.value === '') {
              setColumnFilters([])
            } else {
              setColumnFilters([{ id: e.target.value, value: activeFilter?.value || '' }])
            }
          }}
          aria-label="Filter by column"
          className={inputClass}
        >
          <option value="">Filter by column...</option>
          {columns.map((column) => {
            const id = column.id || column.accessorKey
            return <option key={id} value={id}>{column.meta.label}</option>
          })}
        </select>
        {activeFilter && (
          <input
            type="text"
            value={activeFilter.value || ''}
            onChange={(e) => setColumnFilters([{ id: activeFilter.id, value: e.target.value }])}
            placeholder={`Filter ${columns.find(c => (c.id || c.accessorKey) === activeFilter.id)?.meta.label || activeFilter.id}...`}
            className={`${inputClass} w-48`}
          />
        )}
        <Button onClick={() => onEdit()}>
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </TableToolbar>

      <DataTable table={table} />

      <TablePagination table={table} />

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        user={userToDelete}
      />
    </>
  )
}

export default UsersTable
