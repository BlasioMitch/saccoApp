import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const DeleteTransactionModal = ({ isOpen, onClose, onConfirm, transaction }) => {
  const [deleteText, setDeleteText] = useState('');
  
  if (!isOpen || !transaction) return null;

  const handleConfirm = () => {
    if (deleteText.toLowerCase() === 'delete') {
      onConfirm(transaction);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black-900/90 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-50">Delete Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>

          <div className="space-y-2">
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <div className="text-sm text-gray-400">Account</div>
              <div>{transaction.account?.accountNumber}</div>
            </div>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <div className="text-sm text-gray-400">Amount</div>
              <div>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(transaction.amount)}
              </div>
            </div>
            <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
              <div className="text-sm text-gray-400">Type</div>
              <div>
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Type "delete" to confirm
            </label>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              className="w-full p-2 bg-black-800/90 text-red-500 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
              placeholder="Type 'delete' to confirm"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black-800/90 text-gray-50 rounded-md hover:bg-black-700 border border-black-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleteText.toLowerCase() !== 'delete'}
              className="px-4 py-2 bg-red-500 text-gray-900 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTransactionModal; 