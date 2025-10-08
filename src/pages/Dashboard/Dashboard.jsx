import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import TopBar from '../../components/layout/TopBar';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  // BarChart,
  // Bar,
  // ProgressBar
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

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  // Mock data for charts - replace with actual data
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
    // Implement export functionality
    // console.log(`Exporting to ${format}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
    }).format(amount);
  };

  return (
    <div className="flex h-screen bg-custom-bg-primary dark:bg-custom-bg-primary">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-custom-bg-secondary dark:bg-custom-bg-secondary">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Deposits Today</p>
                    <p className="text-2xl font-semibold mt-1">{formatCurrency(summaryData.totalDepositsToday)}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This Month: {formatCurrency(summaryData.totalDepositsMonth)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Withdrawals Today</p>
                    <p className="text-2xl font-semibold mt-1">{formatCurrency(summaryData.totalWithdrawalsToday)}</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                    <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This Month: {formatCurrency(summaryData.totalWithdrawalsMonth)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-semibold mt-1">{summaryData.activeUsers}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  New Accounts: {summaryData.newAccounts}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loan Disbursals</p>
                    <p className="text-2xl font-semibold mt-1">{formatCurrency(summaryData.loanDisbursals)}</p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Transaction Volume: {formatCurrency(summaryData.transactionVolume)}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <select 
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select 
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="savings">Savings</option>
                    <option value="loans">Loans</option>
                    <option value="transactions">Transactions</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button 
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button 
                    onClick={() => handleExport('csv')}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loan Repayment Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Loan Repayment Progress</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loanRepaymentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Account Balance History */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Account Balance History</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accountBalanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;