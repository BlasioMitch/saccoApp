import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { MoreVertical, Eye, Pencil, Trash2, Plus, Banknote } from 'lucide-react'
import AccountForm from '../forms/AccountForm'
import LoanForm from '../forms/LoanForm'
import { formatUGX } from '../../utils/currency'
import { useDispatch } from 'react-redux'
import { deleteAccount } from '../../reducers/accountsReducer'
import { toast } from 'sonner'
import { TableToolbar, DataTable, TableEmpty, TablePagination, SortableHeader } from './TableShell'
import DropdownMenu from '../ui/DropdownMenu'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'

const Pill = ({ positive, warn, children }) => (
  <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ${
    positive
      ? 'bg-green-500/10 text-green-700 dark:text-green-400'
      : warn
      ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      : 'bg-red-500/10 text-red-700 dark:text-red-400'
  }`}>
    {children}
  </span>
)

const ModalOverlay = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
    <div className="max-h-full w-full max-w-md overflow-y-auto rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 shadow-2xl">
      {children}
    </div>
  </div>
)

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, account }) => {
  const [deleteText, setDeleteText] = useState('')
  if (!isOpen) return null

  return (
    <ModalOverlay>
      <h2 className="mb-4 text-lg font-semibold leading-6 text-custom-text-primary">Delete Account</h2>
      {account?.hasLoan ? (
        <div className="space-y-6">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
            This account has an active loan. Please complete the loan before deleting the account.
          </p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-custom-text-secondary">
            This action cannot be undone. Type "delete" to confirm.
          </p>
          <input
            type="text"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary placeholder:text-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm} disabled={deleteText !== 'delete'}>Delete</Button>
          </div>
        </div>
      )}
    </ModalOverlay>
  )
}

const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  if (!isOpen || !account) return null;

  const owner = account.owner
    ? `${account.owner.first_name} ${account.owner.last_name} ${account.owner.other_name || ''}`.trim()
    : 'N/A'

  const details = [
    ['Account Number', account.accountNumber],
    ['Owner', owner],
    ['Balance', <span key="balance" className="font-semibold tabular-nums">{formatUGX(account.balance)}</span>],
    ['Status', <StatusBadge key="status" status={account.status} />],
    ['Membership', <Pill key="membership" positive={account.paidMembership}>{account.paidMembership ? 'Paid' : 'Unpaid'}</Pill>],
    ['Loan Status', <Pill key="loan" warn={account.hasLoan} positive={!account.hasLoan}>{account.hasLoan ? 'Has Loan' : 'No Loan'}</Pill>],
  ]

  return (
    <ModalOverlay>
      <h2 className="mb-4 text-lg font-semibold leading-6 text-custom-text-primary">Account Details</h2>
      <dl className="grid grid-cols-[128px_1fr] gap-x-4 gap-y-2 text-sm leading-6">
        {details.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt className="text-custom-text-secondary">{label}</dt>
            <dd className="font-medium text-custom-text-primary">{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </ModalOverlay>
  )
}

const AccountsTable = ({ accounts, onDelete }) => {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  const dispatch = useDispatch()

  const handleEditClick = (account) => {
    setSelectedAccount(account)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (account) => {
    setSelectedAccount(account)
    setIsDeleteOpen(true)
  }

  const handleViewClick = (account) => {
    setSelectedAccount(account)
    setIsDetailsOpen(true)
  }

  const handleCreateLoan = (account) => {
    setSelectedAccount(account)
    setIsLoanFormOpen(true)
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

  const handleCloseLoanForm = () => {
    setIsLoanFormOpen(false)
    setSelectedAccount(null)
  }

  const handleConfirmDelete = async () => {
    try{
      if (selectedAccount && !selectedAccount.hasLoan) {
        await dispatch(deleteAccount(selectedAccount.id))
        toast.success('Account deleted successfully')
        handleCloseDelete()
      }
    } catch (error) {
    }
  }

  const columns = [
    {
      id: 'accountNumber',
      meta: { label: 'Account Number', emphasis: 'primary' },
      header: ({ column }) => <SortableHeader column={column} label="Account Number" />,
      accessorFn: (row) => row.accountNumber,
    },
    {
      id: 'ownerName',
      meta: { label: 'Owner Name', emphasis: 'primary' },
      header: ({ column }) => <SortableHeader column={column} label="Owner Name" />,
      accessorFn: (row) => {
        const owner = row.owner;
        return owner ? `${owner.first_name} ${owner.last_name} ${owner.other_name || ''}`.trim() : '';
      },
    },
    {
      accessorKey: 'balance',
      header: 'Account Balance',
      meta: { emphasis: 'amount' },
      cell: ({ row }) => formatUGX(row.getValue('balance')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'paidMembership',
      header: 'Membership',
      cell: ({ row }) => {
        const paid = row.getValue('paidMembership');
        return <Pill positive={paid}>{paid ? 'Paid' : 'Unpaid'}</Pill>;
      },
    },
    {
      accessorKey: 'hasLoan',
      header: 'Loan Status',
      cell: ({ row }) => {
        const hasLoan = row.getValue('hasLoan');
        return <Pill warn={hasLoan} positive={!hasLoan}>{hasLoan ? 'Has Loan' : 'No Loan'}</Pill>;
      },
    },
  ];

  const actionColumn = {
    id: 'actions',
    header: '',
    meta: { align: 'right' },
    cell: ({ row }) => {
      const account = row.original;
      return (
        <DropdownMenu
          ariaLabel="Account actions"
          label={<MoreVertical className="h-4 w-4" />}
          items={[
            { label: 'View Details', icon: Eye, onClick: () => handleViewClick(account) },
            { label: 'Edit', icon: Pencil, onClick: () => handleEditClick(account) },
            { label: 'Create Loan', icon: Banknote, hidden: account.hasLoan, onClick: () => handleCreateLoan(account) },
            { label: 'Delete', icon: Trash2, danger: true, onClick: () => handleDeleteClick(account) },
          ]}
        />
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
    <>
      <TableToolbar search={filtering} onSearch={setFiltering} placeholder="Search all columns...">
        <Button onClick={handleAddAccount}>
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </TableToolbar>

      <DataTable
        table={table}
        empty={
          <TableEmpty
            title="No accounts found"
            action={<Button onClick={handleAddAccount}><Plus className="h-4 w-4" />Add Account</Button>}
          />
        }
      />

      <TablePagination table={table} />

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

      {selectedAccount && (
        <LoanForm
          isOpen={isLoanFormOpen}
          onClose={handleCloseLoanForm}
          initialValues={{
            accountId: selectedAccount.id,
            accountNumber: selectedAccount.accountNumber,
            account: {
              value: selectedAccount.id,
              label: `${selectedAccount.accountNumber} - ${selectedAccount.owner?.first_name} ${selectedAccount.owner?.last_name}`
            }
          }}
        />
      )}
    </>
  );
};

export default AccountsTable
