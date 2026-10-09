import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar/Sidebar'
import TopBar from '../../components/layout/TopBar'

const SIDEBAR_KEY = 'sidebarOpen'

// A manual toggle is remembered; otherwise the sidebar starts collapsed on narrower screens (e.g. 1366px laptops)
const initialSidebarOpen = () => {
  try {
    const saved = localStorage.getItem(SIDEBAR_KEY)
    if (saved !== null) return saved === 'true'
  } catch { /* storage unavailable */ }
  return window.innerWidth >= 1280
}

function Grid() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialSidebarOpen)

  const toggleSidebar = () => {
    setIsSidebarOpen(open => {
      try { localStorage.setItem(SIDEBAR_KEY, String(!open)) } catch { /* storage unavailable */ }
      return !open
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-custom-bg-secondary">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Attached to the top and to the sidebar's edge (collapsed or not) */}
        <TopBar />
        {/* Pages fill this area exactly; only tables/lists scroll inside their own containers */}
        <main className="min-h-0 flex-1 overflow-hidden p-[var(--page-padding)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Grid
