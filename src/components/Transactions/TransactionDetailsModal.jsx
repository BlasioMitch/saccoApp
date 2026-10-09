import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatUGX } from '../../utils/currency';
import moment from 'moment';
import DetailsTitle from '../ui/DetailsTitle';
import { ownerName } from '../../utils/names';
import StatusBadge from '../ui/StatusBadge';

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-3xl border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg leading-6 font-semibold text-custom-text-primary"><DetailsTitle label="Transaction Details" value={transaction.id} mono /></DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Transaction Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-custom-text-primary border-b border-custom-bg-tertiary pb-2">Transaction Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Status</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  <StatusBadge status={transaction.status} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Type</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {transaction.type}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Amount</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {formatUGX(transaction.amount)}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-custom-text-primary border-b border-custom-bg-tertiary pb-2">Account Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Account Number</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {transaction.account?.accountNumber}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Owner</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {ownerName(transaction.account?.owner)}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4 col-span-2">
              <h3 className="text-lg font-medium text-custom-text-primary border-b border-custom-bg-tertiary pb-2">Additional Details</h3>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Description</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {transaction.description || 'No description provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-custom-text-secondary">Date</label>
                <div className="p-2 bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary">
                  {moment(transaction.createdAt).format('DD/MMM/YYYY')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal; 