import React from 'react';
import { Loader2 } from 'lucide-react';
import {formatUGX} from '../../utils/currency'
import moment from 'moment'
import StatusBadge from '../ui/StatusBadge';

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
    <div className="bg-custom-bg-primary p-6 py-2 rounded-lg">
      <h2 className="text-lg leading-6 font-semibold mb-2 text-custom-text-primary">Savings History</h2>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-custom-bg-secondary">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-primary">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-primary">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-primary">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-primary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-custom-bg-tertiary">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-custom-bg-secondary">
                    <td className="px-4 py-2 text-sm text-custom-text-secondary">
                      {moment(transaction.createdAt).format('DD/MMM/YYYY')}
                    </td>
                    <td className="px-4 py-2 text-sm text-custom-text-secondary">
                      {getTransactionTypeLabel(transaction.type)}
                    </td>
                    <td className="px-4 py-2 text-sm text-custom-text-secondary">
                      {formatUGX  (transaction.amount)}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-custom-text-secondary py-4">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default SavingsHistory;