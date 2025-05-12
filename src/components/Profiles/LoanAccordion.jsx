import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import moment from 'moment';
import { formatUGX } from '../../utils/currency';
import { Loader2 } from 'lucide-react';

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
              <p className="text-sm text-slate-400">Amount</p>
              <p className="text-slate-200">
                {formatUGX(loan.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Term</p>
              <p className="text-slate-200">{loan.term} months</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Interest Rate</p>
              <p className="text-slate-200">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Paid</p>
              <p className="text-slate-200">
                {formatUGX(totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Remaining Balance</p>
              <p className="text-slate-200">
                {formatUGX(Number(remainingBalance))}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(loan.status)}`}>
                {loan.status}
              </span>
            </div>

          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-slate-100">Payment History</h3>
            {loanPayments.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-dblack-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dblack-700">
                    {loanPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-dblack-800">
                        <td className="px-4 py-2 text-sm text-slate-300">
                          {moment(payment.createdAt).format('DD/MMM/YYYY')}
                        </td>
                        <td className="px-4 py-2 text-sm text-slate-300">
                          {formatUGX(payment.amount)}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-slate-400 py-4">No payments made yet</p>
            )}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="bg-dblack-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Loans</h2>
      {loans.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {loanItems.map((item) => (
            <AccordionItem key={item.id} value={item.id.toString()}>
              <AccordionTrigger className="text-slate-200  hover:text-slate-100">
                {item.title} 
                <span className={`${getStatusColor(item.status)} rounded-lg px-2`}>{item.status}</span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-slate-400 py-4">No loans found</p>
      )}
    </div>
  );
};

export default LoanAccordion; 