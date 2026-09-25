import React from 'react'
import { Search as SearchIcon } from 'lucide-react'

const Search = () => {
  return (
    <div className="shrink-0 px-2 pt-4 pb-2">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-text-secondary" />
        <input
          type="text"
          placeholder="Search..."
          className="h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary pl-10 pr-4 text-sm text-custom-text-primary placeholder:text-custom-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
        />
      </div>
    </div>
  )
}

export default Search
