import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatUGX } from '../../utils/currency';
import moment from 'moment';
import StatusBadge from '../ui/StatusBadge';

const LoanDetailsModal = ({ isOpen, onClose, loan }) => {
  if (!isOpen || !loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-3xl border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg leading-6 font-semibold text-custom-text-primary">Loan Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-custom-text-primary border-b border-custom-bg-tertiary pb-2">Account Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Account Number</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {loan.account?.accountNumber}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Owner</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {loan.account?.owner ? `${loan.account.owner.first_name} ${loan.account.owner.last_name}` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-custom-text-primary border-b border-custom-bg-tertiary pb-2">Loan Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Loan Amount</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                    {formatUGX(loan.amount)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Interest Rate</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                    {loan.interestRate}%
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Term</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                    {loan.term} months
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Status</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                    <StatusBadge status={loan.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-custom-text-primary border-b border-custom-bg-tertiary pb-2">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Monthly Payment</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                    {formatUGX(loan.summary?.monthlyPayment)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Remaining Balance</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                    {formatUGX(loan.summary?.remainingBalance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-custom-text-primary border-b border-custom-bg-tertiary pb-2">Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Start Date</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                    {moment(loan.startDate).format('DD/MMM/YYYY')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Proposed End Date</label>
                  <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
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