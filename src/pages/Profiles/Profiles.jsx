import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../reducers/userReducer';
import { FetchProfile } from '../../reducers/profileReducer';
import UserSearch from '../../components/Profiles/UserSearch';
import UserBioData from '../../components/Profiles/UserBioData';
import SavingsHistory from '../../components/Profiles/SavingsHistory';
import LoanHistory from '../../components/Profiles/LoanHistory';
import { Loader2 } from 'lucide-react';

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
    <div className="flex flex-col h-full p-4 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-semibold text-slate-100">Member Profile</h1>
        <UserSearch users={users} onSelect={handleUserSelect} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-dcyan-500" />
        </div>
      ) : selectedUser ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <UserBioData user={selectedUser} statistics={userStatistics} />
            <SavingsHistory />
          </div>
          <div>
            <LoanHistory />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-slate-400">Search for a member to view their profile</p>
        </div>
      )}
    </div>
  );
};

export default Profiles;