import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../reducers/userReducer';
import { FetchProfile } from '../../reducers/profileReducer';
import UserSearch from '../../components/Profiles/UserSearch';
import UserBioData from '../../components/Profiles/UserBioData';
import SavingsHistory from '../../components/Profiles/SavingsHistory';
import LoanAccordion from '../../components/Profiles/LoanAccordion';
import { Loader2, X } from 'lucide-react';

const Profiles = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, status: usersStatus } = useSelector((state) => state.users);
  const { profile, status: profileStatus } = useSelector((state) => state.profile);

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersStatus]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user?.id) {
      dispatch(FetchProfile(user.id));
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
    };
  }, [profile]);

  const isLoading = usersStatus === 'loading';

  return (
    <div className="flex flex-col h-full p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Member Profile</h1>
            {selectedUser && (
              <button
                onClick={handleClearProfile}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Profile
              </button>
            )}
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <UserSearch users={users} onSelect={handleUserSelect} />
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-dcyan-500" />
        </div>
      ) : selectedUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* User Bio Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <UserBioData user={selectedUser} statistics={userStatistics} />
            </div>

            {/* Savings History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <SavingsHistory />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Loans Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <LoanAccordion 
                loans={profile?.loans || []} 
                loanPayments={profile?.transactions?.LOAN_PAYMENT || []} 
              />
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