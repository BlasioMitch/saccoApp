import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loanId }) => {
  const [deleteText, setDeleteText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black-900/60 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-50">Delete Loan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-200 font-medium">
            This action cannot be undone. Type "delete" to confirm.
          </p>
          <input
            type="text"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="w-full p-2 bg-black-800/90 text-red-500 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black-800/90 text-gray-100 rounded-md hover:bg-black-700 border border-black-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(loanId)}
              disabled={deleteText !== 'delete'}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;