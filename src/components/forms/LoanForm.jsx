import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLoan, patchLoan } from '../../reducers/loansReducer';
import { toast } from 'sonner';
import { FiX } from 'react-icons/fi';
import { formatUGX } from '../../utils/currency';

const LoanForm = ({ isOpen, onClose, loanToEdit }) => {
  const dispatch = useDispatch();
  const { accounts } = useSelector(state => state.accounts);
  const { status } = useSelector(state => state.loans);
  
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    interestRate: '',
    term: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE'
  });
  const [loanSummary, setLoanSummary] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    sumToPay:0
  });
  const [errors, setErrors] = useState({});

  // Get accounts that don't have loans
  const accountsWithoutLoans = React.useMemo(() => {
    if (!accounts) return [];
    return accounts.filter(account => !account.hasLoan);
  }, [accounts]);

  useEffect(() => {
    if (loanToEdit) {
      setFormData({
        accountId: loanToEdit.accountId,
        amount: loanToEdit.amount,
        interestRate: loanToEdit.interestRate,
        term: loanToEdit.term,
        startDate: new Date(loanToEdit.startDate).toISOString().split('T')[0],
        endDate: new Date(loanToEdit.endDate).toISOString().split('T')[0],
        status: loanToEdit.status
      });
    } else {
      setFormData({
        accountId: '',
        amount: '',
        interestRate: '',
        term: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE'
      });
    }
    setErrors({});
  }, [loanToEdit]);

  useEffect(() => {
    if (formData.amount && formData.interestRate && formData.term) {
      const principal = Number(formData.amount);
      const rate = Number(formData.interestRate) / 100 ; 
      const numberOfPayments = Number(formData.term);

      // Monthly payment calculation using the loan amortization formula
      // const monthlyPayment = principal * (rate * Math.pow(1 + rate, numberOfPayments)) / (Math.pow(1 + rate, numberOfPayments) - 1);
      const monthlyPayment = principal * (1 + rate ) / numberOfPayments
      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - principal;

      setLoanSummary({
        monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
        totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
        totalPayment: isNaN(totalPayment) ? 0 : totalPayment
      });
    }
  }, [formData.amount, formData.interestRate, formData.term]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.accountId) newErrors.accountId = 'Account is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.interestRate) newErrors.interestRate = 'Interest rate is required';
    if (isNaN(formData.interestRate) || Number(formData.interestRate) < 0) {
      newErrors.interestRate = 'Interest rate must be a non-negative number';
    }
    if (!formData.term) newErrors.term = 'Term is required';
    if (isNaN(formData.term) || Number(formData.term) <= 0) {
      newErrors.term = 'Term must be a positive number';
    }
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (loanToEdit) {
        await dispatch(patchLoan({ id: loanToEdit.id, loanData: formData })).unwrap();
        toast.success('Loan updated successfully');
      } else {
        await dispatch(createLoan(formData)).unwrap();
        toast.success('Loan created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black-900/60 p-6 rounded-lg w-full max-w-md border border-black-700 shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-50">
            {loanToEdit ? 'Edit Loan' : 'Create New Loan'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Account</label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
              disabled={loanToEdit}
            >
              <option value="">Select Account</option>
              {accountsWithoutLoans.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {account.owner?.first_name} {account.owner?.last_name}
                </option>
              ))}
            </select>
            {errors.accountId && (
              <p className="text-red-300 text-sm mt-1">{errors.accountId}</p>
            )}
            {accountsWithoutLoans.length === 0 && !loanToEdit && (
              <p className="text-yellow-300 text-sm mt-1">No accounts available for new loans</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
              />
              {errors.amount && (
                <p className="text-red-300 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
              />
              {errors.interestRate && (
                <p className="text-red-300 text-sm mt-1">{errors.interestRate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Term (months)</label>
            <input
              type="number"
              name="term"
              value={formData.term}
              onChange={handleChange}
              className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
            />
            {errors.term && (
              <p className="text-red-300 text-sm mt-1">{errors.term}</p>
            )}
          </div>

          {/* Loan Summary Section */}
          {(formData.amount && formData.interestRate && formData.term) && (
            <div className="bg-black-800/90 p-4 rounded-md space-y-2 border border-black-700">
              <h3 className="text-sm font-semibold text-dcyan-400">Loan Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Monthly Payment</p>
                  <p className="text-dcyan-300 font-medium">
                    {formatUGX(loanSummary.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total Interest</p>
                  <p className="text-dcyan-300 font-medium">
                    {formatUGX(loanSummary.totalInterest)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total Payment</p>
                  <p className="text-dcyan-300 font-medium">
                    {formatUGX(loanSummary.totalPayment)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
              />
              {errors.startDate && (
                <p className="text-red-300 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Proposed End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
              />
              {errors.endDate && (
                <p className="text-red-300 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 bg-black-800/90 text-gray-800 rounded-md border border-black-700 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="DEFAULTED">Defaulted</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-green-500 text-gray-900 py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Saving...' : (loanToEdit ? 'Update' : 'Create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanForm;
