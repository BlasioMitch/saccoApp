import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../reducers/userReducer';
import { FetchProfile } from '../../reducers/profileReducer';
import UserSearch from '../../components/Profiles/UserSearch';
import UserBioData from '../../components/Profiles/UserBioData';
import SavingsHistory from '../../components/Profiles/SavingsHistory';
import LoanAccordion from '../../components/Profiles/LoanAccordion';
import Transactions from '../../components/Profiles/Transactions';
import { Loader2, X, User2, Wallet, CreditCard, History } from 'lucide-react';

const Profiles = ({ userId, isRegularUser }) => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('savings');
  const { users, status: usersStatus } = useSelector((state) => state.users);
  const { profile, status: profileStatus } = useSelector((state) => state.profile);
  const { user: currentUser } = useSelector((state) => state.auth);

  // Load initial data
  useEffect(() => {
    if (isRegularUser && currentUser?.id) {
      dispatch(FetchProfile(currentUser.id));
      setSelectedUser(currentUser);
    } else if (!isRegularUser && usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [isRegularUser, currentUser?.id, usersStatus, dispatch]);

  const handleUserSelect = (user) => {
    if (user?.id) {
      setSelectedUser(user);
      dispatch(FetchProfile(user.id));
    }
  };

  const handleClearProfile = () => {
    setSelectedUser(null);
  };

  // Calculate user statistics from the profile data
  const userStatistics = useMemo(() => {
    if (!profile) return null;
    const savingsTransactions = (profile.account?.transactions || []).filter(t => t.type === 'SAVINGS_DEPOSIT');
    const totalSavings = savingsTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );
    const activeLoans = (profile.account?.loans || []).filter(
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

  const isLoading = profileStatus === 'loading';

  const tabs = [
    { id: 'savings', label: 'Savings', icon: <Wallet className="w-4 h-4" /> },
    { id: 'loans', label: 'Loans', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <History className="w-4 h-4" /> },
  ];

  // Prepare transactions by type for tabbed components
  const transactionsByType = useMemo(() => {
    if (!profile?.account?.transactions) return {};
    return profile.account.transactions.reduce((acc, tx) => {
      if (!acc[tx.type]) acc[tx.type] = [];
      acc[tx.type].push(tx);
      return acc;
    }, {});
  }, [profile]);

  return (
    <div className="flex flex-col h-full p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isRegularUser ? 'My Profile' : 'Member Profile'}
          </h1>
          {selectedUser && !isRegularUser && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <User2 className="w-4 h-4" />
              <span>{selectedUser.name || `${selectedUser.first_name} ${selectedUser.last_name}`}</span>
            </div>
          )}
        </div>
        {!isRegularUser && (
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
        )}
      </div>

      {/* Main Content Section */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-dcyan-500" />
        </div>
      ) : (selectedUser || isRegularUser) && profile ? (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
          {/* Left Column - User Info */}
          <div className="col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-full">
              <UserBioData 
                user={profile}
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
                  <SavingsHistory transactions={transactionsByType.SAVINGS_DEPOSIT || []} />
                )}
                {activeTab === 'loans' && (
                  <LoanAccordion 
                    loans={profile.account?.loans || []} 
                    transactions={transactionsByType} 
                  />
                )}
                {activeTab === 'transactions' && (
                  <Transactions transactions={transactionsByType} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">
            {isRegularUser ? 'Loading your profile...' : 'Search for a member to view their profile'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profiles;