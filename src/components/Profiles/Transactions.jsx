import React from 'react';
// import { format } from 'date-fns';
import moment from 'moment';
import { formatUGX } from '../../utils/currency';

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
      return 'text-red-400';
    }
    return 'text-green-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Transaction History</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sortedTransactions.length} transactions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {moment(transaction.createdAt).format('ddd DD-MMM , yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {getTransactionTypeLabel(transaction.type)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getAmountColor(transaction.type, transaction.amount)}`}>
                  {formatUGX(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTransactionStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {transaction.reference || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        </div>
      )}
    </div>
  );
};

export default Transactions; 