import React from 'react'
// import { Table } from '@tremor/react'

const AccountsTable = ({ accounts, onRowClick }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-light-border dark:border-dark-border">
      <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
        <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Account Number
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Account Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Balance
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-light-bg-primary dark:bg-dark-bg-primary divide-y divide-light-border dark:divide-dark-border">
          {accounts.map((account) => (
            <tr
              key={account.id}
              onClick={() => onRowClick(account)}
              className="hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-primary dark:text-dark-text-primary">
                {account.accountNumber}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-primary dark:text-dark-text-primary">
                {account.type}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-primary dark:text-dark-text-primary">
                {account.balance}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  account.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {account.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AccountsTable