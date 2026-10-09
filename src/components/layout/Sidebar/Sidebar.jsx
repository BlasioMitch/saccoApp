import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Menu from './Menu'
import Search from './Search'
import bkImg from '../../../assets/bk.jpg'

const SidebarHeader = ({ isSidebarOpen }) => {
  return (
    <div className={`flex h-16 shrink-0 items-center gap-2 border-b border-custom-bg-tertiary ${
      isSidebarOpen ? 'px-4' : 'justify-center'
    }`}>
      {/* The logo stays visible when collapsed */}
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
        <img
          src={bkImg}
          alt="SaccoApp Logo"
          className="h-full w-full object-cover"
        />
      </div>
      {isSidebarOpen && (
        <span className="truncate text-lg font-semibold leading-6 text-custom-text-primary">
          SaccoApp
        </span>
      )}
    </div>
  )
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    // 192px fits the longest item ("Loan Payments") with icon and padding; 64px collapsed
    <aside className={`relative z-20 flex h-full shrink-0 flex-col border-r border-custom-bg-tertiary bg-custom-bg-secondary transition-all duration-300 ${
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
        className="absolute -right-4 top-16 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-custom-bg-tertiary bg-custom-bg-primary text-custom-text-secondary shadow-md transition-colors hover:text-custom-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-brand-primary"
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
