import React from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const UserBioData = ({ user, statistics }) => {
  const { profile, status: profileStatus } = useSelector((state) => state.profile);
  
  if (profileStatus === 'loading') {
    return (
      <div className="bg-dblack-900 p-6 rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-dcyan-500" />
      </div>
    );
  }

  if (!profile?.user) return null;

  const profileData = profile.user;
  const accountData = profile.account;

  return (
    <div className="bg-dblack-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Member Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400">Full Name</p>
            <p className="text-slate-200">
              {`${profileData.first_name} ${profileData.last_name} ${profileData.other_name || ''}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-slate-200">{profileData.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Contact</p>
            <p className="text-slate-200">{profileData.contact || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Member Since</p>
            <p className="text-slate-200">
              {profileData.joinDate 
                ? new Date(profileData.joinDate).toLocaleDateString()
                : 'Not available'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Gender</p>
            <p className="text-slate-200">{profileData.gender || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Date of Birth</p>
            <p className="text-slate-200">
              {profileData.dob 
                ? new Date(profileData.dob).toLocaleDateString()
                : 'Not provided'}
            </p>
          </div>
        </div>

        <div className="border-t border-dblack-700 pt-4 mt-4">
          <h3 className="text-lg font-medium mb-3 text-slate-100">Account Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-400">Account Number</p>
              <p className="text-slate-200">{accountData?.accountNumber || 'No account'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Account Status</p>
              <span className={`px-2 py-1 rounded-full text-xs ${
                accountData?.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {accountData?.status || 'N/A'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-dblack-800 p-4 rounded-lg">
              <p className="text-sm text-slate-400">Current Balance</p>
              <p className="text-xl font-semibold text-dcyan-500">
                {accountData?.balance
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'UGX',
                    }).format(accountData.balance)
                  : 'UGX 0'}
              </p>
            </div>
            <div className="bg-dblack-800 p-4 rounded-lg">
              <p className="text-sm text-slate-400">Active Loans</p>
              <p className="text-xl font-semibold text-dcyan-500">
                {statistics?.activeLoans || 0}
              </p>
            </div>
            <div className="bg-dblack-800 p-4 rounded-lg">
              <p className="text-sm text-slate-400">Monthly Avg Savings</p>
              <p className="text-xl font-semibold text-dcyan-500">
                {statistics?.monthlySavingsAvg
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'UGX',
                      maximumFractionDigits: 0,
                    }).format(statistics.monthlySavingsAvg)
                  : 'UGX 0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBioData;