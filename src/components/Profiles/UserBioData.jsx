import React from 'react';
import { Loader2 } from 'lucide-react';
import moment from 'moment'
import { formatUGX } from '../../utils/currency'
import StatusBadge from '../ui/StatusBadge';

const UserBioData = ({ user, account, statistics }) => {
  if (!user) return null;

  return (
    <div className="bg-custom-bg-primary p-6 rounded-lg">
      <h2 className="text-lg leading-6 font-semibold mb-4 text-custom-text-primary">Member Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-custom-text-secondary">Full Name</p>
            <p className="text-custom-text-primary">
              {`${user.first_name} ${user.last_name} ${user.other_name || ''}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-custom-text-secondary">Email</p>
            <p className="text-custom-text-primary">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-custom-text-secondary">Contact</p>
            <p className="text-custom-text-primary">{user.contact || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-custom-text-secondary">Member Since</p>
            <p className="text-custom-text-primary">
              {user.joinDate 
                ? moment(user.joinDate).format('DD-MMM-YYYY')
                : 'Not available'}
            </p>
          </div>
          <div>
            <p className="text-sm text-custom-text-secondary">Gender</p>
            <p className="text-custom-text-primary">{user.gender || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-custom-text-secondary">Date of Birth</p>
            <p className="text-custom-text-primary">
              {user.dob 
                ? moment(user.dob).format('DD-MMM-YYYY')
                : 'Not provided'}
            </p>
          </div>
        </div>

        <div className="border-t border-custom-bg-tertiary pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4 text-custom-text-primary">Account Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-custom-text-secondary">Account Number</p>
              <p className="text-custom-text-primary">{account?.accountNumber || 'No account'}</p>
            </div>
            <div>
              <p className="text-sm text-custom-text-secondary">Account Status</p>
              <StatusBadge status={account?.status} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-custom-bg-secondary p-4 rounded-lg">
              <p className="text-sm text-custom-text-secondary">Current Balance</p>
              <p className="text-xl font-semibold text-custom-brand-primary">
                {account?.balance
                  ? formatUGX(account.balance)
                  : 'UGX 0'}
              </p>
            </div>
            <div className="bg-custom-bg-secondary p-4 rounded-lg">
              <p className="text-sm text-custom-text-secondary">Active Loans</p>
              <p className="text-xl font-semibold text-custom-brand-primary">
                {statistics?.activeLoans || 0}
              </p>
            </div>
            <div className="bg-custom-bg-secondary p-4 rounded-lg">
              <p className="text-sm text-custom-text-secondary">Monthly Avg Savings</p>
              <p className="text-xl font-semibold text-custom-brand-primary">
                {statistics?.monthlySavingsAvg
                  ? formatUGX(statistics.monthlySavingsAvg)
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