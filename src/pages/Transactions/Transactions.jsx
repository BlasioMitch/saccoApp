import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StatCards from '../../components/cards/StatCards'
import TransactionsTable from '../../components/tables/TransactionsTable'
import TransactionForm from '../../components/forms/TransactionForm'
import { fetchTransactions } from '../../reducers/transactionReducer'
import { toast } from 'sonner'
import { TransactionType, TransactionStatus } from '../../reducers/transactionReducer'

const Transactions = () => {
  const dispatch = useDispatch()
  const { transactions, status, error } = useSelector(state => state.transactions)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTransactions())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
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

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dcyan-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4 py-2">
      <div className='py-2'>
        <p className='capitalize text-2xl font-semibold'>Transanctions</p>
      </div>
      <div className="mb-6">
        <StatCards stats={stats} />
      </div>
      
      {transactions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 bg-dblack-900 rounded-lg p-8">
          <p className="text-xl text-dblack-50 mb-4">No transactions found</p>
          <p className="text-dblack-400 mb-6">Start by creating a new transaction</p>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="px-4 py-2 bg-dcyan-500 text-white rounded-md hover:bg-dcyan-600"
          >
            Create Transaction
          </button>
        </div>
      ) : (
        <div className="flex-1 bg-dblack-900 rounded-lg overflow-hidden">
          <TransactionsTable 
            transactions={transactions}
            isPanelOpen={isPanelOpen}
            setIsPanelOpen={setIsPanelOpen}
          />
        </div>
      )}

      <TransactionForm 
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        transactionToEdit={null}
      />
    </div>
  )
}

export default Transactions
