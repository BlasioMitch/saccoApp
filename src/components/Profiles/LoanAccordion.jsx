import React, { useMemo } from 'react';
import Accordion from '../ui/accordion';
import moment from 'moment';

const LoanAccordion = ({ loans, loanPayments }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY');
  };

  // Sort loans by creation date, newest first
  const sortedLoans = useMemo(() => {
    return [...loans].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [loans]);

  const loanItems = sortedLoans.map((loan) => {
    const loanPaymentsForLoan = loanPayments.filter(
      (payment) => payment.loanId === loan.id
    );

    const totalPaid = loanPaymentsForLoan.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    const remainingBalance = Number(loan.amount) - totalPaid;

    return {
      title: (
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span>Loan #{loan.id.slice(0, 8)}</span>
            <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
              loan.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {loan.status}
            </span>
          </div>
          <span className="text-sm font-normal">
             {formatCurrency(loan.amount)}
          </span>
        </div>
      ),
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{formatDate(loan.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{formatDate(loan.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Interest Rate</p>
              <p className="font-medium">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Term</p>
              <p className="font-medium">{loan.term} months</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Total Paid</span>
              <span className="font-medium">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Remaining Balance</span>
              <span className="font-medium">{formatCurrency(remainingBalance)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-2">Payment History</h4>
            {loanPaymentsForLoan.length > 0 ? (
              <div className="space-y-2">
                {loanPaymentsForLoan.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{formatDate(payment.createdAt)}</span>
                      <span className="text-xs text-gray-500">Transaction ID: {payment.id.slice(0, 8)}</span>
                    </div>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic py-2">
                No payments made yet
              </div>
            )}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Loan History</h3>
      {sortedLoans.length > 0 ? (
        <Accordion items={loanItems} />
      ) : (
        <p className="text-sm text-gray-500">No loans found</p>
      )}
    </div>
  );
};

export default LoanAccordion; 