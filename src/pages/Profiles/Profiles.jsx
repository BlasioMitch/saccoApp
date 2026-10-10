import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../reducers/userReducer';
import { FetchProfile } from '../../reducers/profileReducer';
import UserSearch from '../../components/Profiles/UserSearch';
import ProfileHeader from '../../components/Profiles/ProfileHeader';
import SavingsTimeline from '../../components/Profiles/SavingsTimeline';
import LoanTimeline from '../../components/Profiles/LoanTimeline';
import Transactions from '../../components/Profiles/Transactions';
import { activityYears, currentYear, memberFigures } from '../../utils/memberTimeline';
import { X, User2, Wallet, CreditCard, History, CalendarDays } from 'lucide-react';
import { PageSkeleton } from '../../components/ui/Skeleton'
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

  const account = profile?.account;
  const transactions = account?.transactions || [];
  const loans = account?.loans || [];

  // Timelines show one year at a time; the current year by default, reset when another member is opened
  const [year, setYear] = useState(currentYear);
  useEffect(() => {
    setYear(currentYear());
  }, [profile?.id]);
  const years = useMemo(() => activityYears(transactions, loans), [transactions, loans]);
  const figures = useMemo(() => memberFigures(account, year), [account, year]);

  const isLoading = profileStatus === 'loading';

  const tabs = [
    { id: 'savings', label: 'Savings', icon: Wallet },
    { id: 'loans', label: 'Loans', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: History },
  ];

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
        <PageSkeleton variant="profile" />
      ) : (selectedUser || isRegularUser) && profile ? (
        <>
          <ProfileHeader user={profile} account={account} figures={figures} year={year} />

          <Panel>
            {/* Tabs on the left, the year they show on the right */}
            <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary px-[var(--card-padding)]">
              <nav className="flex h-full gap-6" aria-label="Tabs">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    aria-current={activeTab === id ? 'page' : undefined}
                    className={`-mb-px flex items-center gap-2 border-b-2 text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'border-custom-brand-primary text-custom-text-primary'
                        : 'border-transparent text-custom-text-secondary hover:border-custom-bg-tertiary hover:text-custom-text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
              <label className="flex items-center gap-2 text-sm text-custom-text-secondary">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Year</span>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="h-8 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-2 text-sm font-medium text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
                >
                  {years.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>

            {!account ? (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-custom-text-secondary">
                This member has no SACCO account yet.
              </div>
            ) : activeTab === 'savings' ? (
              <SavingsTimeline transactions={transactions} year={year} />
            ) : activeTab === 'loans' ? (
              <LoanTimeline loans={loans} transactions={transactions} year={year} />
            ) : (
              <Transactions transactions={transactions} year={year} />
            )}
          </Panel>
        </>
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
