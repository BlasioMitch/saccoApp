import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLoan, patchLoan } from '../../reducers/loansReducer';
import { toast } from 'sonner';
import { FiX } from 'react-icons/fi';
import moment from 'moment';
import { formatUGX } from '../../utils/currency';
import { DATE_FORMAT, termInMonths, addMonths, summarize } from '../../utils/loanTerms';
import MoneyInput from '../ui/MoneyInput';

const TERM_PRESETS = [3, 6, 12, 18, 24, 36];

const inputClass = 'w-full h-10 px-4 text-sm bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary disabled:opacity-60';
const labelClass = 'block text-sm font-medium text-custom-text-primary mb-2';

const emptyForm = (accountId = '') => ({
  accountId,
  amount: '',
  interestRate: '',
  startDate: moment().format(DATE_FORMAT),
  endDate: '',
  status: 'ACTIVE',
});

const FieldError = ({ message }) => message
  ? <p className="text-red-600 dark:text-red-400 text-sm mt-1">{message}</p>
  : null;

const LoanForm = ({ isOpen, onClose, loanToEdit, initialValues }) => {
  const dispatch = useDispatch();
  const { accounts } = useSelector(state => state.accounts);
  const { status } = useSelector(state => state.loans);

  const [formData, setFormData] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  // Optional typed duration; it only moves the end date, the term is always derived from the dates
  const [manualDuration, setManualDuration] = useState(false);
  const [manualMonths, setManualMonths] = useState('');

  // Reset whenever the form opens, for a new loan or for the loan being edited
  useEffect(() => {
    if (!isOpen) return;
    if (loanToEdit) {
      setFormData({
        accountId: loanToEdit.accountId,
        amount: loanToEdit.amount,
        interestRate: loanToEdit.interestRate,
        startDate: moment(loanToEdit.startDate).format(DATE_FORMAT),
        endDate: moment(loanToEdit.endDate).format(DATE_FORMAT),
        status: loanToEdit.status,
      });
    } else {
      setFormData(emptyForm(initialValues?.accountId));
    }
    setErrors({});
    setManualDuration(false);
    setManualMonths('');
  }, [isOpen, loanToEdit, initialValues?.accountId]);

  // New loans: accounts without a loan. Edits: the loan's own account (it already has a loan).
  const accountOptions = useMemo(() => {
    const list = accounts || [];
    if (loanToEdit) {
      const own = list.find(account => account.id === loanToEdit.accountId) || loanToEdit.account;
      return own ? [own] : [];
    }
    return list.filter(account => !account.hasLoan || account.id === initialValues?.accountId);
  }, [accounts, loanToEdit, initialValues?.accountId]);

  const term = termInMonths(formData.startDate, formData.endDate);
  const amount = Number(formData.amount) || 0;
  const interestRate = Number(formData.interestRate) || 0;
  const summary = summarize(amount, interestRate, term);
  const showSummary = amount > 0 && formData.interestRate !== '' && term > 0;

  const clearError = (name) => {
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Moving the start date keeps the chosen duration
      if (name === 'startDate' && value && term > 0) {
        return { ...prev, startDate: value, endDate: addMonths(value, term) };
      }
      return { ...prev, [name]: value };
    });
    clearError(name);
  };

  const applyPreset = (months) => {
    setFormData(prev => {
      const startDate = prev.startDate || moment().format(DATE_FORMAT);
      return { ...prev, startDate, endDate: addMonths(startDate, months) };
    });
    setManualMonths(String(months));
    clearError('endDate');
  };

  // Editing the dates directly keeps the typed duration in step with the derived term
  useEffect(() => {
    if (manualDuration && term > 0) setManualMonths(String(term));
  }, [term]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleManualDuration = (e) => {
    setManualDuration(e.target.checked);
    if (e.target.checked) setManualMonths(term > 0 ? String(term) : '');
    clearError('manualMonths');
  };

  const handleManualMonths = (e) => {
    const { value } = e.target;
    setManualMonths(value);
    const months = Number(value);
    if (value !== '' && Number.isInteger(months) && months >= 1) {
      applyPreset(months);
      clearError('manualMonths');
    } else {
      setErrors(prev => ({ ...prev, manualMonths: 'Enter a whole number of months, at least 1' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.accountId) newErrors.accountId = 'Account is required';
    if (!formData.amount || isNaN(formData.amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (!Number.isInteger(amount)) {
      newErrors.amount = 'Amount must be a whole number of shillings';
    }
    if (formData.interestRate === '' || isNaN(formData.interestRate) || interestRate <= 0) {
      newErrors.interestRate = 'Interest rate must be greater than 0';
    }
    if (manualDuration && errors.manualMonths) newErrors.manualMonths = errors.manualMonths;
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) {
      newErrors.endDate = 'Pick an end date or a duration';
    } else if (term < 1) {
      newErrors.endDate = 'End date must be after the start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Inputs always yield strings; GraphQL Money/Int/Float variables need real numbers
    const loanData = {
      accountId: formData.accountId,
      amount,
      interestRate,
      term,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: loanToEdit ? formData.status : 'ACTIVE',
    };

    try {
      if (loanToEdit) {
        await dispatch(patchLoan({ id: loanToEdit.id, loanData })).unwrap();
        toast.success('Loan updated successfully');
      } else {
        await dispatch(createLoan(loanData)).unwrap();
        toast.success('Loan created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error?.message || error || 'Something went wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-lg border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg leading-6 font-semibold text-custom-text-primary">
            {loanToEdit ? 'Edit Loan' : 'Create New Loan'}
          </h2>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary" aria-label="Close">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Account</label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className={inputClass}
              disabled={Boolean(loanToEdit)}
            >
              <option value="">Select Account</option>
              {accountOptions.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {account.owner?.first_name} {account.owner?.last_name}
                </option>
              ))}
            </select>
            <FieldError message={errors.accountId} />
            {accountOptions.length === 0 && !loanToEdit && (
              <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">No accounts available for new loans</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Amount</label>
              <MoneyInput name="amount" value={formData.amount} onChange={(value) => handleChange({ target: { name: 'amount', value } })} className={inputClass} />
              <FieldError message={errors.amount} />
            </div>
            <div>
              <label className={labelClass}>Interest Rate (%)</label>
              <input type="number" step="0.01" min="0" name="interestRate" value={formData.interestRate} onChange={handleChange} className={inputClass} />
              <FieldError message={errors.interestRate} />
            </div>
          </div>

          {/* Repayment period: dates in, term worked out */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClass} />
                <FieldError message={errors.startDate} />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input type="date" name="endDate" min={formData.startDate || undefined} value={formData.endDate} onChange={handleChange} className={inputClass} />
                <FieldError message={errors.endDate} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-custom-text-secondary">Duration</span>
              {TERM_PRESETS.map(months => (
                <button
                  key={months}
                  type="button"
                  onClick={() => applyPreset(months)}
                  className={`h-8 px-4 rounded-full border text-xs font-medium transition-colors ${
                    term === months && formData.endDate === addMonths(formData.startDate, months)
                      ? 'border-custom-brand-primary bg-custom-interactive-focus text-custom-brand-primary'
                      : 'border-custom-bg-tertiary text-custom-text-secondary hover:bg-custom-interactive-hover'
                  }`}
                >
                  {months} mo
                </button>
              ))}
            </div>
            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-custom-text-secondary">
              <input
                type="checkbox"
                checked={manualDuration}
                onChange={toggleManualDuration}
                className="h-4 w-4 rounded border-custom-bg-tertiary accent-custom-brand-primary"
              />
              Enter duration manually
            </label>
            {manualDuration && (
              <div className="w-48">
                <label className={labelClass} htmlFor="manualMonths">Duration (months)</label>
                <input
                  id="manualMonths"
                  type="number"
                  min="1"
                  step="1"
                  value={manualMonths}
                  onChange={handleManualMonths}
                  className={inputClass}
                  placeholder="e.g. 9"
                />
                <FieldError message={errors.manualMonths} />
              </div>
            )}
          </div>

          {/* Loan Summary: term and figures derived from the inputs above */}
          <div className="bg-custom-bg-secondary p-4 rounded-lg space-y-2 border border-custom-bg-tertiary">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-sm font-semibold text-custom-text-primary">Loan Summary</h3>
              <p className="text-sm text-custom-text-secondary">
                Term: <span className="font-semibold text-custom-text-primary">{term > 0 ? `${term} month${term === 1 ? '' : 's'}` : '—'}</span>
                {term > 0 && ` · ${term} monthly payment${term === 1 ? '' : 's'}`}
              </p>
            </div>
            {showSummary ? (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-custom-text-secondary">Monthly Payment</p>
                  <p className="font-semibold tabular-nums text-custom-brand-primary">{formatUGX(summary.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-custom-text-secondary">Total Interest</p>
                  <p className="font-semibold tabular-nums text-custom-text-primary">{formatUGX(summary.totalInterest)}</p>
                </div>
                <div>
                  <p className="text-custom-text-secondary">Total Due</p>
                  <p className="font-semibold tabular-nums text-custom-text-primary">{formatUGX(summary.totalDue)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-custom-text-secondary">Enter the amount, rate and dates to see the repayment figures.</p>
            )}
            {loanToEdit && (
              <p className="text-xs text-custom-text-secondary">
                Saving recalculates the remaining balance against completed payments
                {loanToEdit.summary?.remainingBalance != null && ` (currently ${formatUGX(loanToEdit.summary.remainingBalance)} remaining)`}.
              </p>
            )}
          </div>

          {loanToEdit && (
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                <option value="ACTIVE">Active</option>
                <option value="PAID">Paid</option>
                <option value="DEFAULTED">Defaulted</option>
              </select>
              <p className="text-xs text-custom-text-secondary mt-1">Paid follows the balance: it is set automatically once the balance is cleared, and a loan that still owes money stays Active.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-green-500 text-gray-900 h-10 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Saving...' : (loanToEdit ? 'Update' : 'Create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanForm;
