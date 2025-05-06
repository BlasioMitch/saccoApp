import React from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const SavingsHistory = () => {
  const { profile, status: profileStatus } = useSelector((state) => state.profile);
  
  if (profileStatus === 'loading') {
    return (
      <div className="bg-dblack-900 p-6 rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-dcyan-500" />
      </div>
    );
  }

  if (!profile?.transactions) return null;

  // Flatten all transactions for display
  const allTransactions = [
    ...(profile.transactions.SAVINGS_DEPOSIT || []),
    ...(profile.transactions.LOAN_PAYMENT || [])
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-dblack-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Transaction History</h2>
      <div className="space-y-4">
        {allTransactions.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-dblack-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dblack-700">
                {allTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-dblack-800">
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {transaction.type === 'SAVINGS_DEPOSIT' ? 'Deposit' : 'Loan Payment'}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'UGX',
                      }).format(transaction.amount)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-4">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default SavingsHistory;