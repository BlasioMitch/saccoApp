import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Menu from './Menu'
import Search from './Search'
import bkImg from '../../../assets/bk.jpg'

const SidebarHeader = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`flex h-16 shrink-0 items-center border-b border-custom-bg-tertiary ${
      isSidebarOpen ? 'justify-between px-4' : 'justify-center'
    }`}>
      {isSidebarOpen && (
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
            <img
              src={bkImg}
              alt="SaccoApp Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="truncate text-lg font-semibold leading-6 text-custom-text-primary">
            SaccoApp
          </span>
        </div>
      )}
      <button
        onClick={toggleSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-custom-text-secondary transition-colors hover:bg-custom-interactive-hover hover:text-custom-brand-primary"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${
          !isSidebarOpen ? 'rotate-180' : ''
        }`} />
      </button>
    </div>
  )
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside className={`flex h-full shrink-0 flex-col border-r border-custom-bg-tertiary bg-custom-bg-secondary transition-all duration-300 ${
      isSidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <SidebarHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && <Search />}
      <div className="min-h-0 flex-1">
        <Menu isSidebarOpen={isSidebarOpen} />
      </div>
    </aside>
  )
}

export default Sidebar
