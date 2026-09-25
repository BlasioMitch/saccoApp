import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Activity, Wallet, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react'
import { StatGrid } from '../../components/ui/StatCard'
import { PageShell, Panel } from '../../components/layout/PageShell'
import { TableEmpty } from '../../components/tables/TableShell'
import Button from '../../components/ui/Button'
import TransactionTable from '../../components/tables/TransactionTable'
import TransactionForm from '../../components/forms/TransactionForm'
import TransactionDetailsModal from '../../components/Transactions/TransactionDetailsModal'
import DeleteTransactionModal from '../../components/Transactions/DeleteTransactionModal'
import { fetchTransactions, deleteTransaction } from '../../reducers/transactionReducer'
import { toast } from 'sonner'
import { TransactionType, TransactionStatus } from '../../reducers/transactionReducer'
import {formatUGX} from '../../utils/currency'

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
      icon: Activity,
      tone: 'blue',
    },
    {
      title: 'Total Amount',
      value: formatUGX(totalAmount),
      icon: Wallet,
      tone: 'green',
    },
    {
      title: 'Completed',
      value: completedTransactions,
      icon: CheckCircle2,
      tone: 'purple',
    },
    {
      title: 'Pending',
      value: pendingTransactions,
      icon: Clock,
      tone: 'yellow',
    },
    {
      title: 'Failed',
      value: failedTransactions,
      icon: XCircle,
      tone: 'red',
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
      <PageShell>
        <Panel className="items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-custom-brand-primary" />
        </Panel>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <StatGrid stats={stats} className="lg:grid-cols-5" />

      <Panel>
        {transactions?.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <TableEmpty
              title="No transactions found"
              description="Start by creating a new transaction"
              action={<Button onClick={handleAddTransaction}>Create Transaction</Button>}
            />
          </div>
        ) : (
          <TransactionTable
            onRowClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </Panel>

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
    </PageShell>
  )
}

export default Transactions
