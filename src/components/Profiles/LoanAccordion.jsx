import React, { useState, useEffect } from 'react'
import {  useSelector } from 'react-redux'
// import { fetchLoanDetails } from '../../reducers/loanReducer'
// import { fetchTransactions } from '../../reducers/transactionReducer'
// import { formatCurrency } from '../../utils/formatCurrency'
import Accordion from '../ui/accordion'
import moment from 'moment';
import { formatUGX } from '../../utils/currency';

const LoanAccordion = ({ loanId }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MMM/YYYY');
  };
  const { loans } = useSelector((state) => state.loans)
  const loanDetails = loans.find(loan => loan.id === loanId);
  const { transactions } = useSelector((state) => state.transactions);

  return (
    <div className="space-y-4">
      <Accordion
        items={[
          {
            title: 'Loan Details',
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount</label>
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {formatCurrency(loanDetails?.amount)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate</label>
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {loanDetails?.interestRate}%
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Term (months)</label>
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {loanDetails?.term}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        loanDetails?.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : loanDetails?.status === 'PAID'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {loanDetails?.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          },
          {
            title: 'Payment Schedule',
            content: (
              <div className="space-y-4">
                {loanDetails?.paymentSchedule?.map((payment, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                        <div className="mt-1">{new Date(payment.dueDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <div className="mt-1">{formatCurrency(payment.amount)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            payment.status === 'PAID'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : payment.status === 'OVERDUE'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          },
          {
            title: 'Transaction History',
            content: (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <div className="mt-1">{new Date(transaction.date).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === 'PAYMENT'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {transaction.type}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <div className="mt-1">{formatCurrency(transaction.amount)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : transaction.status === 'FAILED'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        ]}
      />
    </div>
  )
}

export default LoanAccordion 