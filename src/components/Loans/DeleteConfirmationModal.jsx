import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loanId }) => {
  const [deleteText, setDeleteText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-md border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg leading-6 font-semibold text-custom-text-primary">Delete Loan</h2>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-custom-text-primary font-medium">
            This action cannot be undone. Type "delete" to confirm.
          </p>
          <input
            type="text"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="w-full h-10 px-4 text-sm bg-custom-bg-secondary text-red-500 rounded-lg border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 h-10 bg-custom-bg-secondary text-custom-text-primary rounded-lg hover:bg-custom-interactive-hover border border-custom-bg-tertiary"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(loanId)}
              disabled={deleteText !== 'delete'}
              className="px-4 h-10 bg-red-500 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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