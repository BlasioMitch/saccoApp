import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import { GET_LOAN_APPLICATIONS } from '../../../graphql/queries'
import { ThemeSwitcher } from '../../ui/ThemeSwitcher'
import { useTheme } from '../../ui/ThemeProvider'
import DropdownMenu from '../../ui/DropdownMenu'
import { MAIN_NAV, BOTTOM_NAV, visibleNav } from '../navigation'

const itemClass = (isActive) => isActive
  ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text'
  : 'text-custom-text-secondary hover:bg-custom-interactive-hover hover:text-custom-text-primary'

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
        ${itemClass(isActive)}
      `}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {isSidebarOpen && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

const isGroupActive = (group, pathname) => group.children.some(child => child.path === pathname)

const CountBadge = ({ count, className = '' }) => count > 0
  ? <span className={`ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white ${className}`}>{count}</span>
  : null

// Expanded sidebar: accordion header with its pages indented under a guide line
const NavGroup = ({ group, pathname, open, onToggle, badges }) => {
  const active = isGroupActive(group, pathname)
  const Icon = group.icon

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-4 rounded-lg px-4 text-sm font-medium transition-colors hover:bg-custom-interactive-hover ${
          active ? 'text-custom-text-primary' : 'text-custom-text-secondary hover:text-custom-text-primary'
        }`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 truncate text-left">{group.label}</span>
        {!open && <CountBadge count={group.children.reduce((total, child) => total + (badges[child.badge] || 0), 0)} />}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <div className="ml-6 mt-1 space-y-1 border-l border-custom-bg-tertiary pl-2">
          {group.children.map(child => (
            <NavLink
              key={child.path}
              to={child.path}
              end
              className={({ isActive }) => `flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors ${itemClass(isActive)}`}
            >
              <span className="truncate">{child.label}</span>
              <CountBadge count={badges[child.badge] || 0} />
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

// Collapsed sidebar: the group icon opens a flyout of its pages
const NavGroupFlyout = ({ group, pathname, badges }) => {
  const navigate = useNavigate()
  const active = isGroupActive(group, pathname)
  const Icon = group.icon
  return (
    <DropdownMenu
      placement="right"
      ariaLabel={`${group.label} menu`}
      title={group.label}
      size="md"
      triggerClassName={`h-10 w-full px-0 ${active ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text hover:bg-custom-interactive-active-bg' : ''}`}
      label={<Icon className="h-5 w-5" />}
      items={group.children.map(child => ({
        key: child.path,
        label: badges[child.badge] ? `${child.label} (${badges[child.badge]})` : child.label,
        icon: child.icon,
        active: child.path === pathname,
        onClick: () => navigate(child.path),
      }))}
    />
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
  const { pathname } = useLocation()
  const isAdmin = user?.role?.toLowerCase() !== 'user'
  const mainMenuItems = visibleNav(MAIN_NAV, { isAdmin })
  const currentPath = pathname.replace(/\/+$/, '')

  // Pending member loan applications, shown as a count next to "Applications"
  const { data: pending } = useQuery(GET_LOAN_APPLICATIONS, {
    variables: { status: 'PENDING' },
    skip: !isAdmin,
    pollInterval: 60_000,
    fetchPolicy: 'cache-and-network',
  })
  const badges = { pendingApplications: pending?.getLoanApplications?.length || 0 }

  // One group open at a time keeps the menu within the viewport (the sidebar never scrolls);
  // navigating into a group opens it
  const activeGroup = mainMenuItems.find(item => item.children && isGroupActive(item, currentPath))?.label || null
  const [openGroup, setOpenGroup] = useState(activeGroup)
  useEffect(() => {
    if (activeGroup) setOpenGroup(activeGroup)
  }, [activeGroup])

  return (
    <div className="flex h-full flex-col px-2 py-2">
      <nav className="flex-1 space-y-1">
        {mainMenuItems.map((item) => {
          if (!item.children) return <NavItem key={item.path} item={item} isSidebarOpen={isSidebarOpen} />
          return isSidebarOpen
            ? (
              <NavGroup
                key={item.label}
                group={item}
                pathname={currentPath}
                open={openGroup === item.label}
                badges={badges}
                onToggle={() => setOpenGroup(openGroup === item.label ? null : item.label)}
              />
            )
            : <NavGroupFlyout key={item.label} group={item} pathname={currentPath} badges={badges} />
        })}
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
