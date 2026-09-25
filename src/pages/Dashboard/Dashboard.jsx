import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import { StatGrid } from '../../components/ui/StatCard';
import { PageShell } from '../../components/layout/PageShell';
import Button from '../../components/ui/Button';

// Theme-aware chart chrome so axis labels stay legible in light and dark mode
const axisProps = {
  tick: { fill: 'var(--custom-text-secondary)', fontSize: 12 },
  stroke: 'var(--custom-bg-tertiary)',
};
const tooltipProps = {
  contentStyle: {
    background: 'var(--custom-bg-primary)',
    border: '1px solid var(--custom-bg-tertiary)',
    borderRadius: 8,
    color: 'var(--custom-text-primary)',
    fontSize: 12,
  },
};

const selectClass = 'h-10 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary';

const ChartCard = ({ title, children }) => (
  <div className="flex min-h-0 flex-col rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6">
    <h3 className="mb-4 shrink-0 text-base font-semibold leading-6 text-custom-text-primary">{title}</h3>
    <div className="min-h-0 flex-1">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

function Dashboard() {
  const [dateRange, setDateRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [summaryData, setSummaryData] = useState({
    totalDepositsToday: 0,
    totalDepositsMonth: 0,
    totalWithdrawalsToday: 0,
    totalWithdrawalsMonth: 0,
    activeUsers: 0,
    newAccounts: 0,
    loanDisbursals: 0,
    transactionVolume: 0
  });

  const loanRepaymentData = [
    { name: 'Jan', value: 75 },
    { name: 'Feb', value: 82 },
    { name: 'Mar', value: 90 },
    { name: 'Apr', value: 88 },
    { name: 'May', value: 95 },
    { name: 'Jun', value: 92 }
  ];

  const accountBalanceData = [
    { date: '2024-01', balance: 1000000 },
    { date: '2024-02', balance: 1200000 },
    { date: '2024-03', balance: 1500000 },
    { date: '2024-04', balance: 1800000 },
    { date: '2024-05', balance: 2000000 },
    { date: '2024-06', balance: 2200000 }
  ];

  const handleExport = (format) => {
    // TODO: Implement export functionality
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
    }).format(amount);
  };

  const stats = [
    {
      title: 'Total Deposits Today',
      value: formatCurrency(summaryData.totalDepositsToday),
      note: `This Month: ${formatCurrency(summaryData.totalDepositsMonth)}`,
      icon: ArrowUpRight,
      tone: 'green',
    },
    {
      title: 'Total Withdrawals Today',
      value: formatCurrency(summaryData.totalWithdrawalsToday),
      note: `This Month: ${formatCurrency(summaryData.totalWithdrawalsMonth)}`,
      icon: ArrowDownRight,
      tone: 'red',
    },
    {
      title: 'Active Users',
      value: summaryData.activeUsers,
      note: `New Accounts: ${summaryData.newAccounts}`,
      icon: Users,
      tone: 'blue',
    },
    {
      title: 'Loan Disbursals',
      value: formatCurrency(summaryData.loanDisbursals),
      note: `Transaction Volume: ${formatCurrency(summaryData.transactionVolume)}`,
      icon: Wallet,
      tone: 'purple',
    },
  ];

  return (
    <PageShell>
      <StatGrid stats={stats} />

      {/* Filters */}
      <div className="flex h-14 shrink-0 items-center gap-4 rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary px-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-custom-text-secondary" />
          <select
            className={selectClass}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Date range"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-custom-text-secondary" />
          <select
            className={selectClass}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Category"
          >
            <option value="all">All Categories</option>
            <option value="savings">Savings</option>
            <option value="loans">Loans</option>
            <option value="transactions">Transactions</option>
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="secondary" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Charts fill the remaining height */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Loan Repayment Progress">
          <LineChart data={loanRepaymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--custom-bg-tertiary)" />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipProps} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Account Balance History">
          <LineChart data={accountBalanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--custom-bg-tertiary)" />
            <XAxis dataKey="date" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(value) => value.toLocaleString()} width={80} />
            <Tooltip {...tooltipProps} formatter={(value) => formatCurrency(value)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="balance" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ChartCard>
      </div>
    </PageShell>
  );
}

export default Dashboard;
