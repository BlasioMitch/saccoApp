import React from 'react'
import { Plus, Download, Filter } from 'lucide-react'

const QuickActions = ({ onNew, onExport, onFilter }) => {
  return (
    <div className="flex items-center space-x-2">
      {onNew && (
        <button
          onClick={onNew}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-light-brand-primary dark:bg-dark-brand-primary text-white hover:bg-light-brand-secondary dark:hover:bg-dark-brand-secondary transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </button>
      )}
      
      {onExport && (
        <button
          onClick={onExport}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      )}
      
      {onFilter && (
        <button
          onClick={onFilter}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      )}
    </div>
  )
}

export default QuickActions
