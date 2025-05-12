import React from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const LoanHistory = () => {
  const { profile, status: profileStatus } = useSelector((state) => state.profile);

  if (profileStatus === 'loading') {
    return (
      <div className="bg-dblack-900 p-6 rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-dcyan-500" />
      </div>
    );
  }

  const loans = profile?.loans || [];

  return (
    <div className="bg-dblack-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Loan History</h2>
      <div className="space-y-4">
        {loans.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-dblack-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dblack-700">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-dblack-800">
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'UGX',
                      }).format(loan.amount)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        loan.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : loan.status === 'ACTIVE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {loan.interestRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-4">No loan history found</p>
        )}
      </div>
    </div>
  );
};

export default LoanHistory;