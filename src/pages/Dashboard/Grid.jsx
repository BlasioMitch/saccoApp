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
    <div className="flex h-screen overflow-hidden bg-custom-bg-primary">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        {/* Pages fill this area exactly; only tables/lists scroll inside their own containers */}
        <main className="min-h-0 flex-1 overflow-hidden bg-custom-bg-secondary p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Grid
