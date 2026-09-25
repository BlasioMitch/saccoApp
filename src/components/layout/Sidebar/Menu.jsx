import React from 'react'
import { NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useSelector } from 'react-redux'
import { ThemeSwitcher } from '../../ui/ThemeSwitcher'
import { useTheme } from '../../ui/ThemeProvider'
import { MAIN_NAV, BOTTOM_NAV } from '../navigation'

const NavItem = ({ item, isSidebarOpen }) => {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      end
      title={!isSidebarOpen ? item.label : undefined}
      className={({ isActive }) => `
        flex h-10 items-center rounded-lg text-sm font-medium transition-colors
        ${isSidebarOpen ? 'gap-4 px-4' : 'justify-center'}
        ${isActive
          ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text'
          : 'text-custom-text-secondary hover:bg-custom-interactive-hover hover:text-custom-text-primary'
        }
      `}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {isSidebarOpen && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

const CompactThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-10 w-full items-center justify-center rounded-lg text-custom-text-secondary transition-colors hover:bg-custom-interactive-hover hover:text-custom-text-primary"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title="Theme"
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  )
}

const Menu = ({ isSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth)
  const isRegularUser = user?.role?.toLowerCase() === 'user'
  const mainMenuItems = MAIN_NAV.filter(item => !(isRegularUser && item.adminOnly))

  return (
    <div className="flex h-full flex-col px-2 py-2">
      <nav className="flex-1 space-y-1">
        {mainMenuItems.map((item) => (
          <NavItem key={item.path} item={item} isSidebarOpen={isSidebarOpen} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-custom-bg-tertiary pt-2">
        {isSidebarOpen ? (
          <div className="flex h-10 items-center justify-between px-4">
            <span className="text-xs font-medium uppercase tracking-wide text-custom-text-secondary">Theme</span>
            <ThemeSwitcher />
          </div>
        ) : (
          <CompactThemeToggle />
        )}
        <nav className="space-y-1">
          {BOTTOM_NAV.map((item) => (
            <NavItem key={item.path} item={item} isSidebarOpen={isSidebarOpen} />
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Menu
