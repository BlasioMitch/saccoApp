import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatUGX } from '../../utils/currency';
import moment from 'moment';

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black-900/90 p-6 rounded-lg w-full max-w-3xl border border-black-700 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-50">Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Transaction Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200 border-b border-black-700 pb-2">Transaction Information</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Transaction ID</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {transaction.id}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Type</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {transaction.type}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Amount</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {formatUGX(transaction.amount)}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200 border-b border-black-700 pb-2">Account Information</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Account Number</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {transaction.account?.accountNumber}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Owner</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {transaction.account?.owner ? `${transaction.account.owner.first_name} ${transaction.account.owner.last_name}` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4 col-span-2">
              <h3 className="text-lg font-medium text-gray-200 border-b border-black-700 pb-2">Additional Details</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
                  {transaction.description || 'No description provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Date</label>
                <div className="p-2 bg-black-800/90 text-gray-100 rounded-md border border-black-700">
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