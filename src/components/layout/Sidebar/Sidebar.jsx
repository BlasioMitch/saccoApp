import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Menu from './Menu'
import Search from './Search'
import bkImg from '../../../assets/bk.jpg'

const SidebarHeader = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-custom-bg-tertiary">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img 
              src={bkImg} 
              alt="SaccoApp Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {isSidebarOpen && (
          <span className="text-lg font-semibold text-custom-text-primary">
            SaccoApp
          </span>
        )}
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg  text-custom-text-secondary hover:bg-custom-interactive-hover hover:text-custom-brand-primary transition-colors"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${
          !isSidebarOpen ? 'rotate-180' : ''
        }`} />
      </button>
    </div>
  )
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`flex flex-col h-full transition-all duration-300 bg-custom-bg-secondary dark:bg-custom-bg-secondary border-r border-custom-bg-tertiary ${
      isSidebarOpen ? 'w-64' : 'w-20'
    }`}>
      <SidebarHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Search isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 overflow-y-auto">
        <Menu isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  )
}

export default Sidebar