import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

const StatCard = ({ title, value, change, trend }) => {
  const isPositive = trend === 'up'
  
  return (
    <div className="p-6 rounded-lg bg-custom-bg-secondary dark:bg-custom-bg-secondary border border-custom-brand-light dark:border-custom-brand-dark">
      <h3 className="text-sm font-medium text-custom-text-secondary">
        {title}
      </h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-custom-text-primary">
          {value}
        </p>
        {change && (
          <p className={`ml-2 flex items-baseline text-sm font-semibold ${
            isPositive 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? <ArrowUpIcon className="w-3 h-3 mr-0.5" /> : <ArrowDownIcon className="w-3 h-3 mr-0.5" />}
            {change}
          </p>
        )}
      </div>
    </div>
  )
}

const StatCards = ({ stats = [] }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title || 'Untitled'}
          value={stat.value || '0'}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}

export default StatCards