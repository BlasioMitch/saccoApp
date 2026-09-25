import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users, Wallet, CheckCircle2, BarChart3, Loader2 } from 'lucide-react'
import { StatGrid } from '../../components/ui/StatCard'
import { PageShell, Panel } from '../../components/layout/PageShell'
import AccountsTable from '../../components/tables/AccountsTable'
import { fetchAccounts } from '../../reducers/accountsReducer'
import { toast } from 'sonner'
import { formatUGX } from '../../utils/currency'

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

  const stats = useMemo(() => {
    const totalBalance = accounts?.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0) || 0
    return [
      {
        title: 'Total Accounts',
        value: accounts?.length || 0,
        icon: Users,
        tone: 'blue',
      },
      {
        title: 'Total Balance',
        value: formatUGX(totalBalance),
        icon: Wallet,
        tone: 'green',
      },
      {
        title: 'Active Accounts',
        value: accounts?.filter(acc => acc.status === 'ACTIVE').length || 0,
        icon: CheckCircle2,
        tone: 'purple',
      },
      {
        title: 'Average Balance',
        value: formatUGX(accounts?.length ? totalBalance / accounts.length : 0),
        icon: BarChart3,
        tone: 'yellow',
      },
    ]
  }, [accounts])

  return (
    <PageShell>
      <StatGrid stats={stats} />
      <Panel>
        {status === 'loading' ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-custom-brand-primary" />
          </div>
        ) : (
          <AccountsTable accounts={accounts || []} />
        )}
      </Panel>
    </PageShell>
  )
}

export default React.memo(Accounts)
