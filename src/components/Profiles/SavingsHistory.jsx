import React from 'react';
import { Loader2 } from 'lucide-react';
import {formatUGX} from '../../utils/currency'
import moment from 'moment'

const SavingsHistory = ({ transactions = [] }) => {
  if (!transactions) return null;

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'SAVINGS_DEPOSIT':
        return 'Savings Deposit';
      case 'LOAN_PAYMENT':
        return 'Loan Payment';
      case 'MEMBERSHIP_FEE':
        return 'Membership Fee';
      case 'ACCOUNT_WITHDRAW':
        return 'Account Withdrawal';
      case 'CLOSURE_WITHDRAW':
        return 'Closure Withdrawal';
      default:
        return type;
    }
  };

  return (
    <div className="bg-dblack-900 p-6 py-2 rounded-lg">
      <h2 className="text-xl font-semibold mb-2 text-slate-100">Savings History</h2>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-dblack-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-200">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-200">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-200">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-slate-200">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dblack-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-dblack-800">
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {moment(transaction.createdAt).format('DD/MMM/YYYY')}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {getTransactionTypeLabel(transaction.type)}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-300">
                      {formatUGX  (transaction.amount)}
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