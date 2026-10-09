import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { formatUGX } from '../../utils/currency';
import { typeLabel, isWithdrawal } from '../../utils/transactionRules';
import { transactionsInYear } from '../../utils/memberTimeline';
import StatusBadge from '../ui/StatusBadge';
import { cn } from '../../lib/utils';

const FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'savings', label: 'Savings', match: (tx) => tx.type === 'SAVINGS_DEPOSIT' },
  { id: 'loans', label: 'Loan payments', match: (tx) => tx.type === 'LOAN_PAYMENT' },
  { id: 'withdrawals', label: 'Withdrawals', match: (tx) => isWithdrawal(tx.type) },
  { id: 'fees', label: 'Fees', match: (tx) => tx.type === 'MEMBERSHIP_FEE' },
];

const th = 'sticky top-0 z-10 h-10 whitespace-nowrap border-b border-custom-bg-tertiary bg-custom-bg-table px-4 text-left text-xs font-semibold uppercase tracking-wide text-custom-text-secondary';
const td = 'h-11 whitespace-nowrap border-b border-custom-bg-tertiary px-4 text-sm';

// Money leaving the savings balance is shown in red with a minus sign
const isMoneyOut = (type) => isWithdrawal(type) || type === 'MEMBERSHIP_FEE';

// All of the member's transactions in the selected year, newest first, filterable by kind
const Transactions = ({ transactions = [], year }) => {
  const [filter, setFilter] = useState('all');
  const inYear = useMemo(() => transactionsInYear(transactions, year), [transactions, year]);
  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map(f => [f.id, inYear.filter(f.match).length])),
    [inYear]
  );
  const rows = inYear.filter(FILTERS.find(f => f.id === filter).match);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap gap-2 border-b border-custom-bg-tertiary px-[var(--card-padding)] py-2" role="tablist" aria-label="Transaction type">
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'inline-flex h-8 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors',
              filter === f.id
                ? 'border-custom-brand-primary bg-custom-interactive-active-bg text-custom-interactive-active-text'
                : 'border-custom-bg-tertiary text-custom-text-secondary hover:bg-custom-interactive-hover hover:text-custom-text-primary'
            )}
          >
            {f.label}
            <span className="tabular-nums opacity-70">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {rows.length ? (
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className={th}>Date</th>
                <th className={th}>Type</th>
                <th className={cn(th, 'text-right')}>Amount</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tx) => (
                <tr key={tx.id} className="transition-colors hover:bg-custom-interactive-hover">
                  <td className={cn(td, 'text-custom-text-secondary')}>{moment(tx.createdAt).format('ddd DD MMM YYYY, HH:mm')}</td>
                  <td className={cn(td, 'font-medium text-custom-text-primary')}>{typeLabel(tx.type)}</td>
                  <td className={cn(td, 'text-right font-semibold tabular-nums', isMoneyOut(tx.type) ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400')}>
                    {isMoneyOut(tx.type) ? '−' : '+'}{formatUGX(tx.amount)}
                  </td>
                  <td className={td}><StatusBadge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-sm text-custom-text-secondary">
            No {filter === 'all' ? '' : FILTERS.find(f => f.id === filter).label.toLowerCase() + ' '}transactions in {year}.
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
