import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Menu from './Menu'
import Search from './Search'
import BrandMark from '../../ui/BrandMark'

const SidebarHeader = ({ isSidebarOpen }) => {
  return (
    <div className={`flex h-16 shrink-0 items-center gap-2 border-b border-custom-bg-tertiary ${
      isSidebarOpen ? 'px-4' : 'justify-center'
    }`}>
      {/* The logo stays visible when collapsed */}
      <BrandMark className="h-9 w-9 text-custom-brand-primary" />
      {isSidebarOpen && (
        <span className="truncate text-lg font-semibold leading-6 text-custom-text-primary">
          Green Sprout
        </span>
      )}
    </div>
  )
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    // 192px fits the longest item ("Loan Payments") with icon and padding; 64px collapsed.
    // .app-sidebar keeps the brand green in both themes (tokens re-pointed in index.css)
    <aside className={`app-sidebar relative z-20 flex h-full shrink-0 flex-col border-r border-custom-bg-tertiary bg-custom-bg-secondary shadow-sidebar transition-all duration-300 ${
      isSidebarOpen ? 'w-48' : 'w-16'
    }`}>
      <SidebarHeader isSidebarOpen={isSidebarOpen} />
      {isSidebarOpen && <Search />}
      <div className="min-h-0 flex-1">
        <Menu isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Round toggle on the corner where the header's bottom border meets the right border */}
      <button
        onClick={toggleSidebar}
        // Straddles the sidebar edge: page-surface colours keep it visible against both sides
        className="absolute -right-4 top-16 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gs-border)] bg-[var(--gs-surface)] text-[var(--gs-text-muted)] shadow-md transition-colors hover:text-[var(--gs-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gs-text-primary)]"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${
          !isSidebarOpen ? 'rotate-180' : ''
        }`} />
      </button>
    </aside>
  )
}

export default Sidebar
