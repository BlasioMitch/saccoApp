import React from 'react';
// import { format } from 'date-fns';
import moment from 'moment';
import { formatUGX } from '../../utils/currency';
import StatusBadge from '../ui/StatusBadge';

const Transactions = ({ transactions = {} }) => {
  // Combine all transaction types into a single array
  const allTransactions = Object.entries(transactions).reduce((acc, [type, txs]) => {
    return [...acc, ...txs.map(tx => ({ ...tx, type }))];
  }, []);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...allTransactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'SAVINGS_DEPOSIT':
        return 'Savings Deposit';
      case 'SAVINGS_WITHDRAWAL':
        return 'Savings Withdrawal';
      case 'LOAN_PAYMENT':
        return 'Loan Payment';
      case 'LOAN_DISBURSEMENT':
        return 'Loan Disbursement';
      case 'MEMBERSHIP_PAYMENT':
        return 'Membership Payment';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-900/50 text-green-300';
      case 'PENDING':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'FAILED':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-gray-900/50 text-gray-300';
    }
  };

  const getAmountColor = (type, amount) => {
    if (type === 'ACCOUNT_WITHDRAW' || type === 'CLOSURE_WITHDRAW') {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-custom-text-primary dark:text-custom-text-primary">Transaction History</h3>
        <span className="text-sm text-custom-text-secondary dark:text-custom-text-secondary">
          {sortedTransactions.length} transactions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-custom-bg-tertiary">
          <thead className="bg-custom-bg-secondary">
            <tr>
              <th className="h-10 px-4 text-left text-xs font-medium text-custom-text-secondary dark:text-custom-text-secondary uppercase tracking-wider">
                Date
              </th>
              <th className="h-10 px-4 text-left text-xs font-medium text-custom-text-secondary dark:text-custom-text-secondary uppercase tracking-wider">
                Type
              </th>
              <th className="h-10 px-4 text-left text-xs font-medium text-custom-text-secondary dark:text-custom-text-secondary uppercase tracking-wider">
                Amount
              </th>
              <th className="h-10 px-4 text-left text-xs font-medium text-custom-text-secondary dark:text-custom-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="h-10 px-4 text-left text-xs font-medium text-custom-text-secondary dark:text-custom-text-secondary uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="bg-custom-bg-primary divide-y divide-custom-bg-tertiary">
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-custom-bg-secondary dark:hover:bg-custom-interactive-hover">
                <td className="h-12 px-4 whitespace-nowrap text-sm text-custom-text-primary dark:text-custom-text-primary">
                  {moment(transaction.createdAt).format('ddd DD-MMM , yyyy HH:mm')}
                </td>
                <td className="h-12 px-4 whitespace-nowrap text-sm text-custom-text-primary dark:text-custom-text-primary">
                  {getTransactionTypeLabel(transaction.type)}
                </td>
                <td className={`h-12 px-4 whitespace-nowrap text-sm font-semibold tabular-nums ${getAmountColor(transaction.type, transaction.amount)}`}>
                  {formatUGX(transaction.amount)}
                </td>
                <td className="h-12 px-4 whitespace-nowrap">
                  <StatusBadge status={transaction.status} />
                </td>
                <td className="h-12 px-4 whitespace-nowrap text-sm text-custom-text-secondary dark:text-custom-text-secondary">
                  {transaction.reference || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-custom-text-secondary dark:text-custom-text-secondary">No transactions found</p>
        </div>
      )}
    </div>
  );
};

export default Transactions; 