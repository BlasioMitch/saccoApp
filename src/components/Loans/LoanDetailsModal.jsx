import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatUGX } from '../../utils/currency';
import moment from 'moment';

const LoanDetailsModal = ({ isOpen, onClose, loan }) => {
  if (!isOpen || !loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black-900/90 p-6 rounded-lg w-full max-w-3xl border border-black-700 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-50">Loan Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200 border-b border-black-700 pb-2">Account Information</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Account Number</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {loan.account?.accountNumber}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Owner</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {loan.account?.owner ? `${loan.account.owner.first_name} ${loan.account.owner.last_name}` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200 border-b border-black-700 pb-2">Loan Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Loan Amount</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    {formatUGX(loan.amount)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Interest Rate</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    {loan.interestRate}%
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Term</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    {loan.term} months
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      loan.status === 'PAID'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : loan.status === 'ACTIVE'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200 border-b border-black-700 pb-2">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Monthly Payment</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    {formatUGX(loan.summary?.monthlyPayment)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Remaining Balance</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    {formatUGX(loan.summary?.remainingBalance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200 border-b border-black-700 pb-2">Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Start Date</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    {moment(loan.startDate).format('DD/MMM/YYYY')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Proposed End Date</label>
                  <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                    {moment(loan.endDate).format('DD/MMM/YYYY')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanDetailsModal;