import React from 'react'
import { Search as SearchIcon } from 'lucide-react'

const Search = () => {
  return (
    <div className="px-3 py-2">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-custom-text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-custom-bg-tertiary text-custom-text-primary placeholder-custom-text-muted border border-custom-brand-light dark:border-custom-brand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-brand-primary transition-colors"
        />
      </div>
    </div>
  )
}

export default Search