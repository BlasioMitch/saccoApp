import React, { useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { HiEllipsisVertical, HiEye, HiPencil, HiTrash } from 'react-icons/hi2'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useDispatch } from 'react-redux'
import { deleteUser } from '../../reducers/userReducer'
import { toast } from 'sonner'

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, user }) => {
  const [deleteText, setDeleteText] = useState('')
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black-900/90 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-50">Delete Member</DialogTitle>
          <DialogDescription className="text-gray-400">
            {user?.hasAccount ? (
              <div className="space-y-2">
                <p>This member has an active account. Deleting this member will also delete their account.</p>
                <p className="text-yellow-400">This action cannot be allowed.</p>
              </div>
            ) : (
              <p>This action cannot be undone. Type "delete" to confirm.</p>
            )}
          </DialogDescription>
        </DialogHeader>
        {!user?.hasAccount && (
          <input
            type="text"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="w-full px-4 py-2 mt-4 bg-black-800/90 text-gray-50 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
          />
        )}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black-800/90 text-gray-50 rounded-md hover:bg-black-700 border border-black-700"
          >
            Cancel
          </button>
          {!user?.hasAccount && (
            <button
              onClick={onConfirm}
              disabled={deleteText !== 'delete'}
              className="px-4 py-2 bg-red-500 text-gray-50 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ActionMenu = ({ isOpen, onClose, onEdit, onDelete, onView }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-custom-bg-secondary border border-custom-bg-tertiary z-50">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={onView}
          className="flex items-center w-full px-4 py-2 text-sm text-custom-text-primary hover:bg-custom-interactive-hover"
          role="menuitem"
        >
          <HiEye className="mr-3 h-5 w-5" />
          View Details
        </button>
        <button
          onClick={onEdit}
          className="flex items-center w-full px-4 py-2 text-sm text-custom-text-primary hover:bg-custom-interactive-hover"
          role="menuitem"
        >
          <HiPencil className="mr-3 h-5 w-5" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-custom-interactive-hover"
          role="menuitem"
        >
          <HiTrash className="mr-3 h-5 w-5" />
          Delete
        </button>
      </div>
    </div>
  );
};

function UsersTable({ users, onEdit, onView }) {
  const dispatch = useDispatch()
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [filtering, setFiltering] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
    setActiveMenu(null)
  }

  const handleEditClick = (user) => {
    setActiveMenu(null)
    onEdit(user)
  }
  
  // New function to handle view click
  const handleViewClick = (user) => { 
    setActiveMenu(null);
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
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Full Name
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
      cell: ({ row }) => {
        const first = row.original.first_name || ''
        const last = row.original.last_name || ''
        const other = row.original.other_name || ''
        return `${first} ${last} ${other}`.trim()
      },
      filterFn: 'nameFilter',
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Email
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
    },
    {
      accessorKey: 'contact',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Contact
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Gender
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Role
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
      cell: ({ row }) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.original.role === 'ADMIN' 
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500'
            : row.original.role === 'MANAGER'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500'
        }`}>
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: 'dob',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Birth Date
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('dob'));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: 'joinDate',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Join Date
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('joinDate'));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Status
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
      cell: ({ row }) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.original.status === 'ACTIVE' 
            ? 'bg-custom-brand-green/20 text-custom-brand-green'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'hasAccount',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Account Status
          {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
        </button>
      ),
      cell: ({ row }) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.original.hasAccount
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500'
        }`}>
          {row.original.hasAccount ? 'Has Account' : 'No Account'}
        </span>
      ),
    },
  ]

  const actionColumn = {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const isOpen = activeMenu === row.original.id;
      
      return (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(isOpen ? null : row.original.id);
            }}
            className="p-1 text-custom-text-secondary hover:text-custom-brand-primary"
          >
            <HiEllipsisVertical className="h-5 w-5" />
          </button>
          <ActionMenu
            isOpen={isOpen}
            onClose={() => setActiveMenu(null)}
            onEdit={() => {
              handleEditClick(row.original);
            }}
            onDelete={() => handleDeleteClick(row.original)}
            onView={() => handleViewClick(row.original)} // Call the new view function
          />
        </div>
      );
    },
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

  return (
    <div className="space-y-4 min-w-[1200px]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-custom-text-primary">Members List</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Search all columns..."
              className="px-4 py-2 bg-custom-bg-secondary text-custom-text-primary rounded-md border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
            />
            <select
              value={table.getState().columnFilters[0]?.id || ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  setColumnFilters([])
                } else {
                  setColumnFilters([
                    {
                      id: e.target.value,
                      value: table.getState().columnFilters[0]?.value || '',
                    },
                  ])
                }
              }}
              className="px-4 py-2 bg-custom-bg-secondary text-custom-text-primary rounded-md border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
            >
              <option value="">Filter by column...</option>
              {table.getAllLeafColumns().map((column) => {
                if (column.id === 'actions') return null
                return (
                  <option key={column.id} value={column.id}>
                    {column.columnDef.header({ column }).props.children[0]}
                  </option>
                )
              })}
            </select>
            {table.getState().columnFilters[0] && (
              <input
                type="text"
                value={table.getState().columnFilters[0]?.value || ''}
                onChange={(e) => {
                  setColumnFilters([
                    {
                      id: table.getState().columnFilters[0]?.id,
                      value: e.target.value,
                    },
                  ])
                }}
                placeholder={`Filter ${
                  table.getState().columnFilters[0]?.id
                }...`}
                className="px-4 py-2 bg-custom-bg-secondary text-custom-text-primary rounded-md border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
              />
            )}
          </div>
          <button
            onClick={() => onEdit()} 
            className="flex items-center gap-2 px-4 py-2 bg-custom-brand-primary text-custom-interactive-active-text rounded-md hover:bg-custom-brand-dark transition-colors"
          >
            <FiUserPlus className="w-5 h-5" />
            Add Member
          </button>
        </div>
      </div>
      
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-x-auto rounded-lg border border-custom-bg-tertiary">
          <table className="w-full">
            <thead className="bg-custom-bg-secondary">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-custom-text-secondary uppercase tracking-wider">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-custom-bg-primary divide-y divide-custom-bg-tertiary">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-custom-bg-secondary transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-custom-text-primary">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-custom-bg-secondary border-t border-custom-bg-tertiary mt-4 rounded-lg sticky bottom-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-custom-text-secondary">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="px-2 py-1 bg-custom-bg-primary text-custom-text-primary rounded-md border border-custom-bg-tertiary"
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-custom-bg-primary text-custom-text-primary rounded-md border border-custom-bg-tertiary disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 bg-custom-bg-primary text-custom-text-primary rounded-md border border-custom-bg-tertiary disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        user={userToDelete}
      />
       
    </div>
  )
}

export default UsersTable