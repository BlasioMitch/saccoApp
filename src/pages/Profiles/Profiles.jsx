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
import { PageShell, Panel } from '../../components/layout/PageShell';
import Button from '../../components/ui/Button';

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
    <PageShell>
      {/* Toolbar: member search (staff only) */}
      {!isRegularUser && (
        <div className="flex h-10 shrink-0 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-sm text-custom-text-secondary">
            <User2 className="h-4 w-4 shrink-0" />
            {selectedUser ? (
              <span className="truncate font-medium text-custom-text-primary">
                {selectedUser.first_name} {selectedUser.last_name}
              </span>
            ) : (
              <span>No member selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-80">
              <UserSearch users={users} onSelect={handleUserSelect} />
            </div>
            {selectedUser && (
              <Button variant="secondary" onClick={handleClearProfile}>
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Section */}
      {isLoading ? (
        <Panel className="items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-custom-brand-primary" />
        </Panel>
      ) : (selectedUser || isRegularUser) && profile ? (
        <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
          {/* Left Column - User Info */}
          <div className="col-span-4 min-h-0 overflow-y-auto rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6">
            <UserBioData
              user={profile}
              account={profile.account}
              statistics={userStatistics}
            />
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="col-span-8 flex min-h-0 flex-col overflow-hidden rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary">
            {/* Tabs */}
            <nav className="flex h-12 shrink-0 gap-6 border-b border-custom-bg-tertiary px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    -mb-px flex items-center gap-2 border-b-2 text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'border-custom-brand-primary text-custom-brand-primary'
                      : 'border-transparent text-custom-text-secondary hover:border-custom-bg-tertiary hover:text-custom-text-primary'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Tab Content: the only scrolling area on this page */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6">
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
      ) : (
        <Panel className="items-center justify-center">
          <p className="text-sm text-custom-text-secondary">
            {isRegularUser ? 'Loading your profile...' : 'Search for a member to view their profile'}
          </p>
        </Panel>
      )}
    </PageShell>
  );
};

export default Profiles;
