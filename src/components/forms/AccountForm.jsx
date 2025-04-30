import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAccount, patchAccount, clearSuccess, clearError } from '../../reducers/accountsReducer'
import { fetchUsers } from '../../reducers/userReducer'
import { toast } from 'sonner'

const AccountForm = ({ isOpen, onClose, accountToEdit }) => {
  const dispatch = useDispatch()
  const { users, status: usersStatus } = useSelector(state => state.users)
  const { accounts } = useSelector(state => state.accounts)
  const { success, error, status } = useSelector(state => state.accounts)
  
  const [formData, setFormData] = useState({
    userId: '',
    balance: '',
    status: 'ACTIVE',
    paidMembership: false
  })
  const [errors, setErrors] = useState({})

  // Fetch users if not already loaded
  useEffect(() => {
    if (isOpen && usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [isOpen, usersStatus, dispatch])

  // Update form data when editing an account
  useEffect(() => {
    if (accountToEdit) {
      setFormData({
        userId: accountToEdit.userId,
        balance: accountToEdit.balance,
        status: accountToEdit.status,
        paidMembership: accountToEdit.paidMembership
      })
    } else {
      setFormData({
        userId: '',
        balance: '',
        status: 'ACTIVE',
        paidMembership: false
      })
    }
    setErrors({})
  }, [accountToEdit])



  // Get users without accounts for creation, or all users for editing
  const usersWithNoAccount = React.useMemo(() => {
    if (!users || !accounts) return []
    
    if (accountToEdit) {
      // When editing, show all users but disable the select
      return users
    }
    
    // Get all user IDs that have accounts
    const userIdsWithAccounts = new Set(accounts.map(acc => acc.userId))
    
    // Filter users who don't have accounts
    return users.filter(user => !userIdsWithAccounts.has(user.id))
  }, [users, accounts, accountToEdit])

  // Get the selected user's name for display
  const selectedUserName = React.useMemo(() => {
    if (!accountToEdit) return null
    const user = users?.find(u => u.id === accountToEdit.userId)
    return user ? `${user.first_name} ${user.last_name} ${user.other_name || ''}`.trim() : ''
  }, [accountToEdit, users])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.userId) newErrors.userId = 'User is required'
    if (!formData.balance) newErrors.balance = 'Balance is required'
    if (isNaN(formData.balance)) newErrors.balance = 'Balance must be a number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (accountToEdit) {
        // Only send the fields that can be updated
        const updatedData = {
          balance: formData.balance,
          status: formData.status,
          paidMembership: formData.paidMembership
        }
        await dispatch(patchAccount({ id: accountToEdit.id, accountData: updatedData })).unwrap()
      } else {
        await dispatch(createAccount(formData)).unwrap()
      }
      onClose()
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dblack-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {accountToEdit ? 'Edit Account' : 'Create New Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {accountToEdit ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder</label>
                <input
                  type="text"
                  value={selectedUserName}
                  readOnly
                  className="w-full p-2 bg-dblack-600 rounded-md opacity-75 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountToEdit.accountNumber}
                  readOnly
                  className="w-full p-2 bg-dblack-600 rounded-md opacity-75 cursor-not-allowed"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">User</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full p-2 bg-dblack-600 rounded-md focus:outline-none focus:ring-2 focus:ring-dcyan-500"
                disabled={usersStatus === 'loading'}
              >
                <option value="">Select User</option>
                {usersWithNoAccount.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} {user.other_name ? user.other_name : ''}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
              )}
              {usersStatus === 'loading' && (
                <p className="text-gray-400 text-sm mt-1">Loading users...</p>
              )}
              {usersWithNoAccount.length === 0 && !accountToEdit && (
                <p className="text-yellow-500 text-sm mt-1">No users available for new accounts</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Balance</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="w-full p-2 bg-dblack-600 rounded-md focus:outline-none focus:ring-2 focus:ring-dcyan-500"
            />
            {errors.balance && (
              <p className="text-red-500 text-sm mt-1">{errors.balance}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 bg-dblack-600 rounded-md focus:outline-none focus:ring-2 focus:ring-dcyan-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1">
              <input
                type="checkbox"
                name="paidMembership"  
                checked={formData.paidMembership}
                onChange={handleChange}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-dcyan-500"
              />
              Paid Membership
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-dblack-600 text-white rounded-md hover:bg-dblack-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dcyan-500 text-white rounded-md hover:bg-dcyan-600"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : (accountToEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AccountForm 