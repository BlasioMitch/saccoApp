import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTransaction, fetchTransactions, updateTransaction } from '../../reducers/transactionReducer'
import { fetchAccounts } from '../../reducers/accountsReducer'
import { fetchLoans } from '../../reducers/loansReducer'
import {
  TransactionType, TransactionStatus, MEMBERSHIP_FEE_AMOUNT, TYPE_OPTIONS, typeLabel, openLoans,
  ELIGIBILITY, isWithdrawal, loanPaymentDefault, defaultAmount,
} from '../../utils/transactionRules'
import { formatUGX } from '../../utils/currency'
import { ownerName } from '../../utils/names'
import MoneyInput from '../ui/MoneyInput'
import { toast } from 'sonner'
import { FiX } from 'react-icons/fi'

const inputClass = 'w-full h-10 px-4 text-sm bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary disabled:opacity-60 disabled:cursor-not-allowed'
const labelClass = 'block text-sm font-medium mb-2 text-custom-text-primary'

const FieldError = ({ message }) => message
  ? <p className="text-red-600 dark:text-red-400 text-sm mt-1">{message}</p>
  : null

const Hint = ({ children }) => <p className="text-custom-text-secondary text-sm mt-1">{children}</p>

const TransactionForm = ({ isOpen, onClose, transactionToEdit, initialValues = {} }) => {
  const dispatch = useDispatch()
  const { accounts, status: accountsStatus } = useSelector(state => state.accounts)
  const { status } = useSelector(state => state.transactions)

  const [formData, setFormData] = useState({ type: TransactionType.SAVINGS_DEPOSIT, accountId: '', loanId: '', amount: '' })
  const [errors, setErrors] = useState({})

  const typeLocked = Boolean(transactionToEdit || initialValues.type)
  const accountLocked = Boolean(transactionToEdit || initialValues.accountId)

  // Eligibility depends on live balances, membership and loans: refresh accounts each time the form opens
  useEffect(() => {
    if (isOpen) dispatch(fetchAccounts())
  }, [isOpen, dispatch])

  // Reset when opening: edit an existing transaction, or start a new one (optionally pre-filled)
  useEffect(() => {
    if (!isOpen) return
    if (transactionToEdit) {
      setFormData({
        type: transactionToEdit.type,
        accountId: transactionToEdit.accountId,
        loanId: transactionToEdit.loanId || '',
        amount: Number(transactionToEdit.amount) || '',
      })
    } else {
      const type = initialValues.type || TransactionType.SAVINGS_DEPOSIT
      setFormData({
        type,
        accountId: initialValues.accountId || '',
        loanId: initialValues.loanId || '',
        amount: Number(initialValues.amount) || defaultAmount(type),
      })
    }
    setErrors({})
  }, [isOpen, transactionToEdit?.id, initialValues.type, initialValues.accountId, initialValues.loanId, initialValues.amount]) // eslint-disable-line react-hooks/exhaustive-deps

  const accountById = useMemo(
    () => new Map((accounts || []).map(account => [account.id, account])),
    [accounts]
  )
  const selectedAccount = accountById.get(formData.accountId)
  const accountLoans = openLoans(selectedAccount)
  const selectedLoan = accountLoans.find(loan => loan.id === formData.loanId)
    || (selectedAccount?.loans || []).find(loan => loan.id === formData.loanId)

  // Type first, then only the accounts that can take it (the current account always stays listed)
  const eligibleAccounts = useMemo(() => {
    const isEligible = ELIGIBILITY[formData.type] || (() => true)
    return (accounts || []).filter(account => isEligible(account) || account.id === formData.accountId)
  }, [accounts, formData.type, formData.accountId])

  const clearError = (name) => {
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Picking an account for a loan payment selects its open loan (if only one) and suggests an instalment
  const withAccount = (prev, accountId, type) => {
    const loans = type === TransactionType.LOAN_PAYMENT ? openLoans(accountById.get(accountId)) : []
    const loan = loans.length === 1 ? loans[0] : null
    return { ...prev, type, accountId, loanId: loan?.id || '', amount: defaultAmount(type, loan) }
  }

  const handleTypeChange = (e) => {
    const type = e.target.value
    setFormData(prev => {
      const account = accountById.get(prev.accountId)
      const keepAccount = account && ELIGIBILITY[type]?.(account)
      return withAccount(prev, keepAccount ? prev.accountId : '', type)
    })
    setErrors({})
  }

  const handleAccountChange = (e) => {
    setFormData(prev => withAccount(prev, e.target.value, prev.type))
    clearError('accountId')
  }

  const handleLoanChange = (e) => {
    const loan = accountLoans.find(item => item.id === e.target.value)
    setFormData(prev => ({ ...prev, loanId: e.target.value, amount: loanPaymentDefault(loan) }))
    clearError('loanId')
  }

  const handleAmountChange = (amount) => {
    setFormData(prev => ({ ...prev, amount }))
    clearError('amount')
  }

  const validateForm = () => {
    const newErrors = {}
    const amount = Number(formData.amount)
    if (!formData.accountId) newErrors.accountId = 'Account is required'
    if (!formData.amount || amount <= 0) newErrors.amount = 'Amount must be greater than 0'
    if (formData.type === TransactionType.LOAN_PAYMENT && !formData.loanId) newErrors.loanId = 'Select the loan being paid'
    if (isWithdrawal(formData.type) && selectedAccount && amount > Number(selectedAccount.balance)) {
      newErrors.amount = `Cannot withdraw more than the available ${formatUGX(selectedAccount.balance)}`
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const transactionData = {
      type: formData.type,
      accountId: formData.accountId,
      amount: Number(formData.amount),
      // No payment service yet: transactions are settled when they are entered
      status: transactionToEdit?.status || TransactionStatus.COMPLETED,
      ...(formData.type === TransactionType.LOAN_PAYMENT && { loanId: formData.loanId }),
    }

    try {
      if (transactionToEdit) {
        await dispatch(updateTransaction({ id: transactionToEdit.id, transactionData })).unwrap()
        toast.success('Transaction updated successfully')
      } else {
        await dispatch(createTransaction(transactionData)).unwrap()
        toast.success('Transaction created successfully')
      }
      dispatch(fetchTransactions())
      // Balances, membership and loan figures change with transactions
      dispatch(fetchAccounts())
      if (formData.type === TransactionType.LOAN_PAYMENT) {
        dispatch(fetchLoans())
      }
      onClose()
    } catch (error) {
      toast.error(error?.message || error || 'Something went wrong')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-md border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg leading-6 font-semibold text-custom-text-primary">
            {transactionToEdit ? 'Edit Transaction' : 'Create New Transaction'}
          </h2>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary" aria-label="Close">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Type</label>
            <select name="type" value={formData.type} onChange={handleTypeChange} className={inputClass} disabled={typeLocked}>
              {TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Account</label>
            <select name="accountId" value={formData.accountId} onChange={handleAccountChange} className={inputClass} disabled={accountLocked}>
              <option value="">Select Account</option>
              {eligibleAccounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {ownerName(account.owner)}
                </option>
              ))}
            </select>
            <FieldError message={errors.accountId} />
            {accountsStatus === 'loading' && !accounts?.length && <Hint>Loading accounts...</Hint>}
            {accountsStatus !== 'loading' && eligibleAccounts.length === 0 && (
              <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">No accounts eligible for {typeLabel(formData.type)}</p>
            )}
            {isWithdrawal(formData.type) && selectedAccount && (
              <Hint>Available balance: {formatUGX(selectedAccount.balance)}</Hint>
            )}
          </div>

          {formData.type === TransactionType.LOAN_PAYMENT && selectedAccount && (
            <div>
              <label className={labelClass}>Loan</label>
              <select name="loanId" value={formData.loanId} onChange={handleLoanChange} className={inputClass} disabled={Boolean(transactionToEdit || initialValues.loanId)}>
                <option value="">Select Loan</option>
                {(accountLoans.some(loan => loan.id === formData.loanId) || !selectedLoan ? accountLoans : [...accountLoans, selectedLoan]).map(loan => (
                  <option key={loan.id} value={loan.id}>
                    {formatUGX(loan.amount)} from {new Date(loan.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <FieldError message={errors.loanId} />
              {selectedLoan?.summary && (
                <Hint>
                  Remaining {formatUGX(selectedLoan.summary.remainingBalance)} · Monthly {formatUGX(selectedLoan.summary.monthlyPayment)}
                </Hint>
              )}
            </div>
          )}

          <div>
            <label className={labelClass}>Amount</label>
            <MoneyInput name="amount" value={formData.amount} onChange={handleAmountChange} className={inputClass} />
            <FieldError message={errors.amount} />
            {formData.type === TransactionType.MEMBERSHIP_FEE && (
              <Hint>Standard membership fee is {formatUGX(MEMBERSHIP_FEE_AMOUNT)}</Hint>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 bg-custom-bg-secondary text-custom-text-primary rounded-lg hover:bg-custom-interactive-hover border border-custom-bg-tertiary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 h-10 bg-green-500 text-gray-900 font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
