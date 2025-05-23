import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { HiPlus, HiEllipsisVertical, HiEye, HiPencil, HiTrash } from 'react-icons/hi2'
import AccountForm from '../forms/AccountForm'
import { formatUGX } from '../../utils/currency'
import { useDispatch } from 'react-redux'
import { deleteAccount } from '../../reducers/accountsReducer'
import { toast } from 'sonner'

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, account }) => {
  const [deleteText, setDeleteText] = useState('')
  
  return (
    <div className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 ${!isOpen && 'hidden'}`}>
      <div className="bg-black-900/90 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Delete Account</h2>
        {account?.hasLoan ? (
          <div className="space-y-4">
            <p className="text-yellow-400 font-medium">
              This account has an active loan. Please complete the loan before deleting the account.
            </p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-black-800/90 text-gray-100 rounded-md hover:bg-black-700 border border-black-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-200 font-medium">
              This action cannot be undone. Type "delete" to confirm.
            </p>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type 'delete' to confirm"
              className="w-full p-2 bg-black-800/90 text-red-700 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500 placeholder-gray-500"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-black-800/90 text-gray-100 rounded-md hover:bg-black-700 border border-black-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={deleteText !== 'delete'}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 disabled:opacity-50 hover:cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black-900/60 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Account Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Account Number</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {account.accountNumber}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Owner</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {account.owner ? `${account.owner.first_name} ${account.owner.last_name} ${account.owner.other_name || ''}`.trim() : 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Balance</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(account.balance)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <span className={`px-2 py-1 text-xs rounded-full ${
                account.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {account.status}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Membership Status</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <span className={`px-2 py-1 text-xs rounded-full ${
                account.paidMembership
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {account.paidMembership ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Loan Status</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <span className={`px-2 py-1 text-xs rounded-full ${
                account.hasLoan
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {account.hasLoan ? 'Has Loan' : 'No Loan'}
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black-800/90 text-gray-100 rounded-md hover:bg-black-700 border border-black-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
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

const AccountsTable = ({ accounts, onDelete }) => {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  
  const dispatch = useDispatch()
  
  const handleEditClick = (account) => {
    setActiveMenu(null)
    setSelectedAccount(account)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (account) => {
    setSelectedAccount(account)
    setIsDeleteOpen(true)
    setActiveMenu(null)
  }

  const handleViewClick = (account) => {
    setActiveMenu(null)
    setSelectedAccount(account)
    setIsDetailsOpen(true)
  }

  const handleAddAccount = () => {
    setSelectedAccount(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedAccount(null)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
    setSelectedAccount(null)
  }

  const handleCloseDelete = () => {
    setIsDeleteOpen(false)
    setSelectedAccount(null)
  }

  const handleConfirmDelete = async () => {
    try{

      if (selectedAccount && !selectedAccount.hasLoan) {
        // Delete account here
        await dispatch(deleteAccount(selectedAccount.id))
        toast.success('Account deleted successfully')
        handleCloseDelete()
      }
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const columns = [
    {
      id: 'accountNumber',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1"
          >
            Account Number
            {column.getIsSorted() === 'asc' ? (
              <FaSortUp />
            ) : column.getIsSorted() === 'desc' ? (
              <FaSortDown />
            ) : (
              <FaSort />
            )}
          </button>
        );
      },
      accessorFn: (row) => row.accountNumber,
      cell: ({ getValue }) => <div className='text-gray-200'>{getValue()}</div>,
    },
    {
      id: 'ownerName',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 "
          >
            Owner Name
            {column.getIsSorted() === 'asc' ? (
              <FaSortUp />
            ) : column.getIsSorted() === 'desc' ? (
              <FaSortDown />
            ) : (
              <FaSort />
            )}
          </button>
        );
      },
      accessorFn: (row) => {
        const owner = row.owner;
        return owner ? `${owner.first_name} ${owner.last_name} ${owner.other_name || ''}`.trim() : '';
      },
      cell: ({ getValue }) => (
        <div className="text-md text-gray-100">{getValue()}</div>
      ),
    },
    {
      accessorKey: 'balance',
      header: 'Account Balance',
      cell: ({ row }) => {
        const balance = row.getValue('balance');
        return formatUGX(balance);
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'paidMembership',
      header: 'Membership',
      cell: ({ row }) => {
        const paid = row.getValue('paidMembership');
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            paid
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {paid ? 'Paid' : 'Unpaid'}
          </span>
        );
      },
    },
    {
      accessorKey: 'hasLoan',
      header: 'Loan Status',
      cell: ({ row }) => {
        const hasLoan = row.getValue('hasLoan');
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            hasLoan
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {hasLoan ? 'Has Loan' : 'No Loan'}
          </span>
        );
      },
    },
  ];

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
            onEdit={() => handleEditClick(row.original)}
            onDelete={() => handleDeleteClick(row.original)}
            onView={() => handleViewClick(row.original)}
          />
        </div>
      );
    },
  };

  const allColumns = [...columns, actionColumn];

  const table = useReactTable({
    data: accounts,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-custom-text-primary">Account List</h2>
        <div className="flex items-center gap-4 py-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Search all columns..."
              className="px-4 py-2 bg-custom-bg-secondary text-custom-text-primary rounded-md border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
            />
          </div>
          <button
            onClick={handleAddAccount}
            className="flex items-center gap-2 px-4 py-2 bg-custom-brand-primary text-custom-interactive-active-text rounded-md hover:bg-custom-brand-dark transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            Add Account
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
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-custom-text-secondary uppercase tracking-wider"
                    >
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
                <tr
                  key={row.id}
                  className="hover:bg-custom-bg-secondary transition-colors"
                >
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

      <AccountForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        accountToEdit={selectedAccount}
      />

      <AccountDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        account={selectedAccount}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        account={selectedAccount}
      />
    </div>
  );
};

export default AccountsTable;