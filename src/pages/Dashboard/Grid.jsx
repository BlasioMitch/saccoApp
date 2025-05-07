import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar/Sidebar'
import TopBar from '../../components/layout/TopBar'

function Grid() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-custom-bg-primary dark:bg-custom-bg-primary">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-custom-bg-secondary dark:bg-custom-bg-secondary">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Grid
