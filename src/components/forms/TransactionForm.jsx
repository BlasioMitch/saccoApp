import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTransaction, fetchTransactions, updateTransaction } from '../../reducers/transactionReducer'
import { fetchAccounts } from '../../reducers/accountsReducer'
import { fetchLoans } from '../../reducers/loansReducer'
import { TransactionType, TransactionStatus } from '../../reducers/transactionReducer'
import { formatUGX, parseUGX } from '../../utils/currency'
import { toast } from 'sonner'
import { FiX } from 'react-icons/fi'

// Currency formatter for UGX
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

const TransactionForm = ({ isOpen, onClose, transactionToEdit, initialValues = {} }) => {
  const dispatch = useDispatch()
  const { accounts, status: accountsStatus } = useSelector(state => state.accounts)
  const { status } = useSelector(state => state.transactions)
  
  const [formData, setFormData] = useState({
    accountId: '',
    type: TransactionType.SAVINGS_DEPOSIT,
    amount: '',
    status: TransactionStatus.COMPLETED,
    loanId: ''
  })
  const [errors, setErrors] = useState({})
  // console.log(initialValues, ' from initial values')
  // console.log(formData,' from make payment action')

  // Fetch accounts if not already loaded
  useEffect(() => {
    if (isOpen && accountsStatus === 'idle') {
      dispatch(fetchAccounts())
    }
  }, [isOpen, accountsStatus, dispatch])

  // Update form data when editing a transaction
  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        accountId: transactionToEdit.accountId,
        type: transactionToEdit.type,
        amount: transactionToEdit.amount,
        status: transactionToEdit.status,
        loanId: transactionToEdit.loanId
      })
    } else if(initialValues.accountId || initialValues.type){
      // create with initial values
      setFormData( prev =>({
        ...prev,
        accountId: initialValues.accountId || '',
        type: initialValues.type || TransactionType.SAVINGS_DEPOSIT,
        amount: Number(initialValues.amount) || '',
        status: TransactionStatus.COMPLETED,
        loanId: initialValues.loanId || null      }))
      }
    }, [transactionToEdit?.id,
      initialValues.accountId,
      initialValues.type,
      initialValues.amount,
      initialValues.loanId])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'amount') {
      const numericValue = parseUGX(value)
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.accountId) newErrors.accountId = 'Account is required'
    if (!formData.amount) newErrors.amount = 'Amount is required'
    if (isNaN(formData.amount)) newErrors.amount = 'Amount must be a number'
    if (Number(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (transactionToEdit) {
        await dispatch(updateTransaction({ 
          id: transactionToEdit.id, 
          transactionData: formData 
        })).unwrap()
        toast.success('Transaction updated successfully')
      } else {
        const cleanedData = { ...formData }
        if (!cleanedData.loanId) {
          delete cleanedData.loanId
        }
        await dispatch(createTransaction(cleanedData)).unwrap()
        toast.success('Transaction created successfully')
      }
      dispatch(fetchTransactions())
      // Refresh loans data if this is a loan payment
      if (formData.type === TransactionType.LOAN_PAYMENT) {
        dispatch(fetchLoans())
      }
      onClose()
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  // Find the selected account details
const selectedAccount = useMemo(() => {
  if (!accounts || !formData.accountId) return null
  return accounts.find(acc => acc.id === formData.accountId)
}, [accounts, formData.accountId])


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black-900/90 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-50">
            {transactionToEdit ? 'Edit Transaction' : 'Create New Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Account</label>
            {initialValues.accountId ? (
              <input
                type="text"
                value={selectedAccount ? `${selectedAccount.accountNumber} - ${selectedAccount.owner?.first_name} ${selectedAccount.owner?.last_name}` : 'Loading...'}
                readOnly
                className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-dcyan-500 "
              />
            ) : (
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                className="w-full p-2 bg-black-800 text-gray-700 secondary rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
                disabled={ !!transactionToEdit}
              >
                <option value="">Select Account</option>
                {accounts?.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.owner?.first_name} {account.owner?.last_name}
                  </option>
                ))}
              </select>
            )}
            {errors.accountId && (
              <p className="text-red-300 text-sm mt-1">{errors.accountId}</p>
            )}
            {accountsStatus === 'loading' && (
              <p className="text-gray-300 text-sm mt-1">Loading accounts...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 bg-black-800/90 text-gray-700 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
              disabled={!!initialValues.type || !!transactionToEdit}
            >
              {Object.entries(TransactionType).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Amount (UGX)</label>
            <div className="relative">
              <input
                type="text"
                name="amount"
                value={formData.amount ? formatUGX(formData.amount) : ''}
                onChange={handleChange}
                className="w-full p-2 bg-black-800/90 text-gray-700 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && (
              <p className="text-red-300 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black-800/90 text-gray-50 rounded-md hover:bg-black-700 border border-black-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-gray-900 rounded-md hover:bg-dcyan-600 hover:cursor-pointer"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : (transactionToEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm