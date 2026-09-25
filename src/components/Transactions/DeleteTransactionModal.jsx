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
      <div className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-md border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg leading-6 font-semibold text-custom-text-primary">Delete Transaction</h2>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-custom-text-secondary">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>

          <div className="space-y-2">
            <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
              <div className="text-sm text-custom-text-secondary">Account</div>
              <div>{transaction.account?.accountNumber}</div>
            </div>
            <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
              <div className="text-sm text-custom-text-secondary">Amount</div>
              <div>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(transaction.amount)}
              </div>
            </div>
            <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
              <div className="text-sm text-custom-text-secondary">Type</div>
              <div>
                <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ${
                  transaction.type === 'DEPOSIT'
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                    : transaction.type === 'WITHDRAWAL'
                    ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                    : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {transaction.type}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-custom-text-secondary">
              Type "delete" to confirm
            </label>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              className="w-full h-10 px-4 text-sm bg-custom-bg-secondary text-red-500 rounded-lg border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
              placeholder="Type 'delete' to confirm"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 h-10 bg-custom-bg-secondary text-custom-text-primary rounded-lg hover:bg-custom-interactive-hover border border-custom-bg-tertiary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleteText.toLowerCase() !== 'delete'}
              className="px-4 h-10 bg-red-500 text-gray-900 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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