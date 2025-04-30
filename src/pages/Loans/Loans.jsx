import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatCards from '../../components/ui/StatCards';
import LoanTable from '../../components/tables/LoanTable';
import { fetchLoans } from '../../reducers/loansReducer';

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
      console.log('Error in Loan component:', error)
      toast.error(error)
    }
  }, [error])
  

  const stats = useMemo(() => {
    if (!loans || loans.length === 0) return [];

    const totalLoans = loans.length;
    const activeLoans = loans.filter(loan => loan.status === 'Active').length;
    const totalAmount = loans.reduce((sum, loan) => sum + (Number(loan.amount) || 0), 0);
    const defaultedLoans = loans.filter(loan => loan.status === 'Defaulted').length;
    const defaultRate = totalLoans ? (defaultedLoans / totalLoans) * 100 : 0;

    return [
      {
        title: 'Total Loans',
        value: totalLoans.toString(),
        change: `${((activeLoans / totalLoans) * 100).toFixed(1)}%`,
        trend: 'up'
      },
      {
        title: 'Active Loans',
        value: activeLoans.toString(),
        change: `${activeLoans} active`,
        trend: 'up'
      },
      {
        title: 'Total Amount',
        value: `UGX ${totalAmount.toLocaleString()}`,
        change: `${(totalAmount / totalLoans).toLocaleString()} avg`,
        trend: 'up'
      },
      {
        title: 'Default Rate',
        value: `${defaultRate.toFixed(1)}%`,
        change: `${defaultedLoans} loans`,
        trend: defaultRate > 5 ? 'down' : 'up'
      }
    ];
  }, [loans]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] p-4">
      <div className="flex justify-between items-center px-2 border-b border-custom-bg-tertiary pb-4">
        <h1 className="text-2xl font-semibold text-custom-text-primary">Loans</h1>
      </div>
      <div className="mb-6 pt-4">
        <StatCards stats={stats} />
      </div>
      <div className="flex-1 bg-custom-bg-secondary rounded-lg overflow-hidden min-h-0">
        <LoanTable />
      </div>
    </div>
  );
}

export default Loans;
