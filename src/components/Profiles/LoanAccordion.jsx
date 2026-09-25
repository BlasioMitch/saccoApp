import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import moment from 'moment';
import { formatUGX } from '../../utils/currency';
import { Loader2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const LoanAccordion = ({ loans = [], transactions = {} }) => {
  const getLoanPayments = (loanId) => {
    return (transactions.LOAN_PAYMENT || []).filter(
      (payment) => payment.loanId === loanId
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'DEFAULTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const loanItems = loans.map((loan) => {
    const loanPayments = getLoanPayments(loan.id);
    const totalPaid = loanPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const remainingBalance = (Number(loan.amount) + Number(loan.summary.totalInterest)) - totalPaid;

    return {
      id: loan.id,
      status: loan.status,
      title: `Loan amounting to ${formatUGX(Number(loan.amount) + Number(loan.summary.totalInterest))}`,
      content: (
        <div className="space-y-6">
          {/* Loan Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-custom-text-secondary">Amount</p>
              <p className="text-custom-text-primary">
                {formatUGX(loan.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-custom-text-secondary">Term</p>
              <p className="text-custom-text-primary">{loan.term} months</p>
            </div>
            <div>
              <p className="text-sm text-custom-text-secondary">Interest Rate</p>
              <p className="text-custom-text-primary">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-custom-text-secondary">Total Paid</p>
              <p className="text-custom-text-primary">
                {formatUGX(totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-custom-text-secondary">Remaining Balance</p>
              <p className="text-custom-text-primary">
                {formatUGX(Number(remainingBalance))}
              </p>
            </div>
            <div>
              <p className="text-sm text-custom-text-secondary">Status</p>
              <StatusBadge status={loan.status} />
            </div>

          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-custom-text-primary">Payment History</h3>
            {loanPayments.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-custom-bg-secondary">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-secondary">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-secondary">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-custom-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-custom-bg-tertiary">
                    {loanPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-custom-bg-secondary">
                        <td className="px-4 py-2 text-sm text-custom-text-secondary">
                          {moment(payment.createdAt).format('DD/MMM/YYYY')}
                        </td>
                        <td className="px-4 py-2 text-sm text-custom-text-secondary">
                          {formatUGX(payment.amount)}
                        </td>
                        <td className="px-4 py-2">
                          <StatusBadge status={payment.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-custom-text-secondary py-4">No payments made yet</p>
            )}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="bg-custom-bg-primary p-6 rounded-lg">
      <h2 className="text-lg leading-6 font-semibold mb-4 text-custom-text-primary">Loans</h2>
      {loans.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {loanItems.map((item) => (
            <AccordionItem key={item.id} value={item.id.toString()}>
              <AccordionTrigger className="text-custom-text-primary hover:text-custom-text-primary">
                {item.title} 
                <StatusBadge status={item.status} />
              </AccordionTrigger>
              <AccordionContent className="text-custom-text-secondary">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-custom-text-secondary py-4">No loans found</p>
      )}
    </div>
  );
};

export default LoanAccordion; 