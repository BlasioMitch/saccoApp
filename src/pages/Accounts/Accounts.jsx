import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StatCards from '../../components/cards/StatCards'
import AccountsTable from '../../components/tables/AccountsTable'
import { fetchAccounts } from '../../reducers/accountsReducer'
import { toast } from 'sonner'

const Accounts = () => {
  const dispatch = useDispatch()
  const { accounts, status, error } = useSelector(state => state.accounts)

  useEffect(() => {
    dispatch(fetchAccounts())
  }, [dispatch])

  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error, {
        duration: 5000,
        position: 'top-center',
      });
    }
  }, [status, error]);

  const stats = useMemo(() => [
    {
      title: 'Total Accounts',
      value: accounts?.length || 0,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Balance',
      value: accounts?.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      }) || '$0',
      icon: '💰',
      color: 'bg-green-500',
    },
    {
      title: 'Active Accounts',
      value: accounts?.filter(acc => acc.status === 'ACTIVE').length || 0,
      icon: '✅',
      color: 'bg-purple-500',
    },
    {
      title: 'Average Balance',
      value: accounts?.length ? (accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0) / accounts.length).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      }) : '$0',
      icon: '📊',
      color: 'bg-yellow-500',
    },
  ], [accounts])

  return (
    <div className="flex flex-col h-full p-4 py-2">
      <div className='py-2'>
        <p className='capitalize text-2xl font-semibold'>Accounts</p>
      </div>

      <div className="mb-6">
        <StatCards stats={stats} />
      </div>
      
      <div className="flex-1 bg-dblack-900 rounded-lg overflow-hidden">
        {status === 'loading' ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dcyan-500"></div>
          </div>
        ) : (
          <AccountsTable accounts={accounts || []} />
        )}
      </div>
    </div>
  )
}

export default React.memo(Accounts)