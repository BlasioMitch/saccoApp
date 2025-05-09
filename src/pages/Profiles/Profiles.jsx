import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchUserById } from '../../reducers/userReducer';
import UserSearch from '../../components/Profiles/UserSearch';
import UserBioData from '../../components/Profiles/UserBioData';
import SavingsHistory from '../../components/Profiles/SavingsHistory';
import LoanAccordion from '../../components/Profiles/LoanAccordion';
import Transactions from '../../components/Profiles/Transactions';
import { Loader2, X, User2, Wallet, CreditCard, History, Receipt } from 'lucide-react';

const Profiles = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('savings');
  const { users, status: usersStatus, profile } = useSelector((state) => state.users);

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersStatus]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  };

  const handleClearProfile = () => {
    setSelectedUser(null);
  };

  // Calculate user statistics from the profile data
  const userStatistics = useMemo(() => {
    if (!profile?.transactions) return null;

    const savingsTransactions = profile.transactions.SAVINGS_DEPOSIT || [];
    const totalSavings = savingsTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    const activeLoans = (profile.loans || []).filter(
      (l) => l.status === 'ACTIVE'
    ).length;

    // Calculate monthly average savings
    const monthlyTotals = savingsTransactions.reduce((acc, t) => {
      const date = new Date(t.createdAt);
      const monthYear = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
      acc[monthYear] = (acc[monthYear] || 0) + Number(t.amount);
      return acc;
    }, {});

    const monthlySavingsAvg = Object.keys(monthlyTotals).length > 0
      ? Object.values(monthlyTotals).reduce((sum, val) => sum + val, 0) / Object.keys(monthlyTotals).length
      : 0;

    return {
      totalSavings,
      activeLoans,
      monthlySavingsAvg,
      accountBalance: profile.account?.balance || 0,
      accountNumber: profile.account?.accountNumber || '',
      accountStatus: profile.account?.status || '',
    };
  }, [profile]);

  const isLoading = usersStatus === 'loading';

  const tabs = [
    { id: 'savings', label: 'Savings', icon: <Wallet className="w-4 h-4" /> },
    { id: 'loans', label: 'Loans', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <History className="w-4 h-4" /> },
    // { id: 'membership', label: 'Membership', icon: <Receipt className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Member Profile</h1>
          {selectedUser && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <User2 className="w-4 h-4" />
              <span>{selectedUser.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-80">
            <UserSearch users={users} onSelect={handleUserSelect} />
          </div>
          {selectedUser && (
            <button
              onClick={handleClearProfile}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Section */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-dcyan-500" />
        </div>
      ) : profile ? (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
          {/* Left Column - User Info */}
          <div className="col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-full">
              <UserBioData 
                user={profile.user} 
                account={profile.account}
                statistics={userStatistics} 
              />
            </div>
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full flex flex-col">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === tab.id
                          ? 'border-dcyan-500 text-dcyan-500'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 pb-2">
                {activeTab === 'savings' && (
                  <SavingsHistory transactions={profile.transactions?.SAVINGS_DEPOSIT || []} />
                )}
                {activeTab === 'loans' && (
                  <LoanAccordion 
                    loans={profile.loans || []} 
                    transactions={profile.transactions || {}} 
                  />
                )}
                {activeTab === 'transactions' && (
                  <Transactions transactions={profile.transactions || {}} />
                )}
                {activeTab === 'membership' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Membership Payments</h3>
                    {/* Add your membership payments component here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">Search for a member to view their profile</p>
        </div>
      )}
    </div>
  );
};

export default Profiles;