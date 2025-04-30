import React from 'react'
import { X } from 'lucide-react'

const LoanDetailsModal = ({ loan, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl p-6 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-light-border dark:border-dark-border pb-4">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Loan Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Loan Amount
              </label>
              <p className="mt-1 text-light-text-primary dark:text-dark-text-primary">
                ${loan.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Interest Rate
              </label>
              <p className="mt-1 text-light-text-primary dark:text-dark-text-primary">
                {loan.interestRate}%
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Term Length
              </label>
              <p className="mt-1 text-light-text-primary dark:text-dark-text-primary">
                {loan.termMonths} months
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Status
              </label>
              <p className={`mt-1 inline-flex px-2 py-1 text-sm rounded-full ${
                loan.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : loan.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Purpose
            </label>
            <p className="mt-1 text-light-text-primary dark:text-dark-text-primary">
              {loan.purpose}
            </p>
          </div>

          <div className="pt-4 border-t border-light-border dark:border-dark-border">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanDetailsModal