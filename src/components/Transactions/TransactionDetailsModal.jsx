import React from 'react';
import { FiX } from 'react-icons/fi';

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black-900/90 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-50">Transaction Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Account Number</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {transaction.account?.accountNumber}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Account Holder</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {transaction.account?.owner ? `${transaction.account.owner.first_name} ${transaction.account.owner.last_name}` : 'N/A'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Transaction Type</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <span className={`px-2 py-1 text-xs rounded-full ${
                transaction.type === 'DEPOSIT'
                  ? 'bg-green-900/50 text-green-300'
                  : transaction.type === 'WITHDRAWAL'
                  ? 'bg-red-900/50 text-red-300'
                  : 'bg-yellow-900/50 text-yellow-300'
              }`}>
                {transaction.type}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Amount</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(transaction.amount)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Date</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {new Date(transaction.date).toLocaleDateString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <span className={`px-2 py-1 text-xs rounded-full ${
                transaction.status === 'COMPLETED'
                  ? 'bg-green-900/50 text-green-300'
                  : transaction.status === 'PENDING'
                  ? 'bg-yellow-900/50 text-yellow-300'
                  : 'bg-red-900/50 text-red-300'
              }`}>
                {transaction.status}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              {transaction.description || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal; 