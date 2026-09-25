import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Activity, Wallet, AlertTriangle } from 'lucide-react';
import { StatGrid } from '../../components/ui/StatCard';
import { PageShell, Panel } from '../../components/layout/PageShell';
import LoanTable from '../../components/tables/LoanTable';
import { fetchLoans } from '../../reducers/loansReducer';
import { toast } from 'sonner'


const Loans = () => {
  const dispatch = useDispatch();
  const { loans, status, error } = useSelector((state) => state.loans);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLoans());
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // console.log('Error in Loan component:', error)
      toast.error(error)
    }
  }, [error])


  const stats = useMemo(() => {
    if (!loans || loans.length === 0) return [];

    const totalLoans = loans.length;
    const activeLoans = loans.filter(loan => loan.status === 'ACTIVE').length;
    const totalAmount = loans.reduce((sum, loan) => sum + (Number(loan.amount) || 0), 0);
    const defaultedLoans = loans.filter(loan => loan.status === 'DEFAULTED').length;
    const defaultRate = totalLoans ? (defaultedLoans / totalLoans) * 100 : 0;

    return [
      {
        title: 'Total Loans',
        value: totalLoans.toString(),
        meta: `${((activeLoans / totalLoans) * 100).toFixed(1)}% active`,
        trend: 'up',
        icon: CreditCard,
        tone: 'blue'
      },
      {
        title: 'Active Loans',
        value: activeLoans.toString(),
        icon: Activity,
        tone: 'green'
      },
      {
        title: 'Total Amount',
        value: `UGX ${totalAmount.toLocaleString()}`,
        note: `UGX ${Math.round(totalAmount / totalLoans).toLocaleString()} average`,
        icon: Wallet,
        tone: 'purple'
      },
      {
        title: 'Default Rate',
        value: `${defaultRate.toFixed(1)}%`,
        meta: `${defaultedLoans} loans`,
        trend: defaultRate > 5 ? 'down' : 'up',
        icon: AlertTriangle,
        tone: 'red'
      }
    ];
  }, [loans]);

  return (
    <PageShell>
      <StatGrid stats={stats} />
      <Panel>
        <LoanTable />
      </Panel>
    </PageShell>
  );
}

export default Loans;
