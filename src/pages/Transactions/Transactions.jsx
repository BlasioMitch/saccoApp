import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StatCards from '../../components/cards/StatCards'
import TransactionTable from '../../components/tables/TransactionTable'
import TransactionForm from '../../components/forms/TransactionForm'
import TransactionDetailsModal from '../../components/Transactions/TransactionDetailsModal'
import DeleteTransactionModal from '../../components/Transactions/DeleteTransactionModal'
import { fetchTransactions, deleteTransaction } from '../../reducers/transactionReducer'
import { toast } from 'sonner'
import { TransactionType, TransactionStatus } from '../../reducers/transactionReducer'

const Transactions = () => {
  const dispatch = useDispatch()
  const { transactions, status, error } = useSelector(state => state.transactions)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTransactions())
        .unwrap()
        .catch(error => {
          toast.error(error?.message || 'Failed to fetch transactions')
        })
    }
  }, [status, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error?.message || 'An error occurred')
    }
  }, [error])

  // Calculate statistics
  const totalTransactions = transactions?.length || 0
  const totalAmount = transactions?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0
  const completedTransactions = transactions?.filter(t => t.status === TransactionStatus.COMPLETED).length || 0
  const pendingTransactions = transactions?.filter(t => t.status === TransactionStatus.PENDING).length || 0
  const failedTransactions = transactions?.filter(t => t.status === TransactionStatus.FAILED).length || 0

  const stats = [
    {
      title: 'Total Transactions',
      value: totalTransactions,
      icon: '📊',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Amount',
      value: totalAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      }),
      icon: '💰',
      color: 'bg-green-500',
    },
    {
      title: 'Completed',
      value: completedTransactions,
      icon: '✅',
      color: 'bg-purple-500',
    },
    {
      title: 'Pending',
      value: pendingTransactions,
      icon: '⏳',
      color: 'bg-yellow-500',
    },
    {
      title: 'Failed',
      value: failedTransactions,
      icon: '❌',
      color: 'bg-red-500',
    }
  ]

  const handleRowClick = (transaction) => {
    try {
      setSelectedTransaction(transaction)
    } catch (error) {
      toast.error('Failed to select transaction')
    }
  }

  const handleEdit = (transaction) => {
    try {
      setSelectedTransaction(transaction)
      setIsFormOpen(true)
    } catch (error) {
      toast.error('Failed to open edit form')
    }
  }

  const handleDelete = async (transaction) => {
    try {
      setSelectedTransaction(transaction)
      setIsDeleteOpen(true)
    } catch (error) {
      toast.error('Failed to open delete confirmation')
    }
  }

  const handleConfirmDelete = async (transaction) => {
    try {
      await dispatch(deleteTransaction(transaction.id)).unwrap()
      toast.success('Transaction deleted successfully')
      // Refresh the transactions list
      await dispatch(fetchTransactions()).unwrap()
      setIsDeleteOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      toast.error(error?.message || 'Failed to delete transaction')
      setIsDeleteOpen(false)
    }
  }

  const handleView = (transaction) => {
    try {
      setSelectedTransaction(transaction)
      setIsDetailsOpen(true)
    } catch (error) {
      toast.error('Failed to view transaction details')
    }
  }

  const handleAddTransaction = () => {
    try {
      setSelectedTransaction(null)
      setIsFormOpen(true)
    } catch (error) {
      toast.error('Failed to open new transaction form')
    }
  }

  const handleCloseForm = () => {
    try {
      setIsFormOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      toast.error('Failed to close form')
    }
  }

  const handleCloseDetails = () => {
    try {
      setIsDetailsOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      toast.error('Failed to close details')
    }
  }

  const handleCloseDelete = () => {
    try {
      setIsDeleteOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      toast.error('Failed to close delete confirmation')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dcyan-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] p-4">
      <div className="flex justify-between items-center px-2 border-b border-custom-bg-tertiary pb-4">
        <h1 className="text-2xl font-semibold text-custom-text-primary">Transactions</h1>
      </div>
      <div className="mb-6 pt-4">
        <StatCards stats={stats} />
      </div>
      
      {transactions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 bg-dblack-900 rounded-lg p-8">
          <p className="text-xl text-dblack-50 mb-4">No transactions found</p>
          <p className="text-dblack-400 mb-6">Start by creating a new transaction</p>
          <button
            onClick={handleAddTransaction}
            className="px-4 py-2 bg-custom-brand-primary text-white rounded-md hover:bg-custom-brand-dark"
          >
            Create Transaction
          </button>
        </div>
      ) : (
        <div className="flex-1 bg-custom-bg-secondary rounded-lg overflow-hidden min-h-0">
          <TransactionTable 
            onRowClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      )}

      <TransactionForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        transactionToEdit={selectedTransaction}
      />

      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        transaction={selectedTransaction}
      />

      <DeleteTransactionModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        transaction={selectedTransaction}
      />
    </div>
  )
}

export default Transactions
