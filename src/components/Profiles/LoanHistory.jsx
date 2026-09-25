import React from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const LoanHistory = () => {
  const { profile, status: profileStatus } = useSelector((state) => state.profile);

  if (profileStatus === 'loading') {
    return (
      <div className="bg-custom-bg-primary p-6 rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-custom-brand-primary" />
      </div>
    );
  }

  const loans = profile?.loans || [];

  return (
    <div className="bg-custom-bg-primary p-6 rounded-lg">
      <h2 className="text-lg leading-6 font-semibold mb-4 text-custom-text-primary">Loan History</h2>
      <div className="space-y-4">
        {loans.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-custom-bg-secondary">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-secondary">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-secondary">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-secondary">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-secondary">Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-custom-bg-tertiary">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-custom-bg-secondary">
                    <td className="px-4 py-2 text-sm text-custom-text-secondary">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-custom-text-secondary">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'UGX',
                      }).format(loan.amount)}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-4 py-2 text-sm text-custom-text-secondary">
                      {loan.interestRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-custom-text-secondary py-4">No loan history found</p>
        )}
      </div>
    </div>
  );
};

export default LoanHistory;