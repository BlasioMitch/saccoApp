import React from 'react'
import { HiSparkles } from 'react-icons/hi2'

const Plan = ({ isSidebarOpen }) => {
  return (
    <div className="p-4 border-t border-light-bg-tertiary dark:border-dark-bg-tertiary">
      {isSidebarOpen ? (
        <div className="p-4 rounded-lg bg-light-brand-light dark:bg-dark-brand-light">
          <div className="flex items-center">
            <HiSparkles className="w-6 h-6 text-light-brand-primary dark:text-dark-brand-primary" />
            <h3 className="ml-2 font-medium text-light-text-primary dark:text-dark-text-primary">
              Upgrade Plan
            </h3>
          </div>
          <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Get more features and benefits
          </p>
          <button className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-light-brand-primary dark:bg-dark-brand-primary rounded-md hover:bg-light-brand-dark dark:hover:bg-dark-brand-dark transition-colors">
            Upgrade Now
          </button>
        </div>
      ) : (
        <button className="p-2 w-full rounded-lg bg-light-brand-light dark:bg-dark-brand-light">
          <HiSparkles className="w-5 h-5 mx-auto text-light-brand-primary dark:text-dark-brand-primary" />
        </button>
      )}
    </div>
  )
}

export default Plan