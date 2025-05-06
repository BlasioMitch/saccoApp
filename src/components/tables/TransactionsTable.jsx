import React, { useState, useMemo, useCallback, memo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTransaction } from '../../reducers/transactionReducer'
import TransactionForm from '../forms/TransactionForm'
import { TransactionType, TransactionStatus } from '../../reducers/transactionReducer'

// Memoized table row component
const TableRow = memo(({ row, handleEdit, handleDelete }) => {
  return (
    <tr className="hover:bg-dblack-800">
      {row.getVisibleCells().map(cell => (
        <td key={cell.id} className="px-4 py-2 text-sm text-dblack-50">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
})

TableRow.displayName = 'TableRow'

const TransactionsTable = ({ transactions: propTransactions, isPanelOpen, setIsPanelOpen }) => {
  const dispatch = useDispatch()
  const reduxTransactions = useSelector(state => state.transactions.transactions)
  const transactions = propTransactions || reduxTransactions
  const [localTransactions, setLocalTransactions] = useState(transactions)
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Update local transactions when Redux state changes
  React.useEffect(() => {
    setLocalTransactions(transactions)
  }, [transactions])

  const handleEdit = useCallback((transactionId) => {
    const transactionToEdit = localTransactions.find(t => t.id === transactionId)
    if (transactionToEdit) {
      setSelectedTransaction(transactionToEdit)
      setIsPanelOpen(true)
    }
  }, [localTransactions, setIsPanelOpen])

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false)
    setSelectedTransaction(null)
  }, [setIsPanelOpen])

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap()
      setLocalTransactions(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }, [dispatch])

  const handleTransactionUpdate = useCallback((updatedTransaction) => {
    setLocalTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    )
  }, [])

  const columns = useMemo(() => [
    {
      accessorKey: 'accountName',
      header: 'Account',
      cell: info => info.getValue(),
    },
    {
            id: 'ownerName',
            header: ({ column }) => {
              return (
                <button
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                  className="flex items-center gap-1"
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
              const owner = row.account?.owner;
              return owner ? `${owner.first_name} ${owner.last_name}` : '';
            },
            cell: ({ getValue }) => (
              <div className="text-sm text-gray-600">{getValue()}</div>
            ),
          },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: info => {
        const type = info.getValue()
        const typeColors = {
          [TransactionType.LOAN_PAYMENT]: 'bg-blue-500',
          [TransactionType.MEMBERSHIP_FEE]: 'bg-purple-500',
          [TransactionType.SAVINGS_DEPOSIT]: 'bg-green-500',
          [TransactionType.ACCOUNT_WITHDRAW]: 'bg-yellow-500',
          [TransactionType.CLOSURE_WITHDRAW]: 'bg-red-500',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${typeColors[type]}`}>
            {type.replace('_', ' ')}
          </span>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: info => {
        const amount = info.getValue()
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(amount)
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue()
        const statusColors = {
          [TransactionStatus.COMPLETED]: 'bg-green-500',
          [TransactionStatus.PENDING]: 'bg-yellow-500',
          [TransactionStatus.FAILED]: 'bg-red-500',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: info => {
        const transaction = info.row.original
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(transaction.id)}
              className="p-1 text-dcyan-500 hover:text-dcyan-600"
            >
              <HiPencil className="text-lg" />
            </button>
            <button
              onClick={() => handleDelete(transaction.id)}
              className="p-1 text-red-500 hover:text-red-600"
            >
              <HiTrash className="text-lg" />
            </button>
          </div>
        )
      },
    },
  ], [handleEdit, handleDelete])

  const table = useReactTable({
    data: localTransactions,
    columns,
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
  })

  if (!localTransactions || localTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-xl text-dblack-50 mb-4">No transactions found</p>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-dcyan-500 text-dblack-900 rounded-lg hover:bg-dcyan-600 transition-colors"
          >
            <HiPlus className="text-lg" />
            Add Transaction
          </button>
        </div>
        <TransactionForm 
          isOpen={isPanelOpen} 
          onClose={handleClosePanel} 
          transactionToEdit={selectedTransaction}
          onTransactionUpdate={handleTransactionUpdate}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Search..."
          className="w-1/2 p-2 mt-3 ml-3 bg-dblack-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-dcyan-500"
        />
        <button
          onClick={() => setIsPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-2 mt-3 mr-3 bg-dcyan-500 text-dblack-900 rounded-lg hover:bg-dcyan-600 transition-colors"
        >
          <HiPlus className="text-lg" />
          Add Transaction
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-dblack-800">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium text-dblack-50"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1 cursor-pointer">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <FaSortUp className="text-dcyan-500" />,
                        desc: <FaSortDown className="text-dcyan-500" />,
                      }[header.column.getIsSorted()] ?? <FaSort className="text-dblack-400" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-dblack-700">
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                row={row}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-dblack-700">
        <div className="flex items-center gap-2">
          <span className="text-sm text-dblack-50">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="p-1 bg-dblack-600 text-dblack-50 rounded-md"
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-dblack-600 text-dblack-50 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-dblack-600 text-dblack-50 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <TransactionForm 
        isOpen={isPanelOpen} 
        onClose={handleClosePanel} 
        transactionToEdit={selectedTransaction}
        onTransactionUpdate={handleTransactionUpdate}
      />
    </div>
  )
}

export default memo(TransactionsTable) 