import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Users, 
  DollarSign, 
  CreditCard,
  Settings,
  FileText,
  HelpCircle,
  Wallet
} from 'lucide-react'
import { ThemeSwitcher } from '../../ui/ThemeSwitcher'
import { useSelector } from 'react-redux'

const Menu = ({ isSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth)
  const isRegularUser = user?.role?.toLowerCase() === 'user'

  const mainMenuItems = isRegularUser 
    ? [
        { icon: <FileText />, label: 'Profile', path: '/home/profile' }
      ]
    : [
        { icon: <Home />, label: 'Dashboard', path: '/home' },
        { icon: <Users />, label: 'Members', path: '/home/members' },
        { icon: <Wallet />, label: 'Accounts', path: '/home/accounts' },
        { icon: <CreditCard />, label: 'Loans', path: '/home/loans' },
        { icon: <DollarSign />, label: 'Transactions', path: '/home/transactions' },
        { icon: <FileText />, label: 'Profile', path: '/home/profile' }
      ]

  const bottomMenuItems = [
    { icon: <Settings />, label: 'Settings', path: '/home/settings' },
    { icon: <HelpCircle />, label: 'Help', path: '/home/help' }
  ]

  const NavItem = ({ item }) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) => `
        flex items-center px-3 py-2 rounded-lg transition-colors
        ${isActive 
          ? 'bg-custom-brand-light dark:bg-custom-brand-dark text-custom-brand-primary' 
          : 'text-custom-text-secondary hover:bg-custom-interactive-hover dark:hover:bg-custom-interactive-hover'
        }
      `}
      title={!isSidebarOpen ? item.label : undefined}
    >
      <span className="w-5 h-5 mr-3">
        {item.icon}
      </span>
      {isSidebarOpen && (
        <span className="text-sm font-medium">
          {item.label}
        </span>
      )}
    </NavLink>
  )

  return (
    <div className="flex flex-col h-full">
      <nav className="space-y-1 px-2 flex-1">
        {mainMenuItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>
      
      <div className="px-2 py-2">
        <div className="border-t border-custom-bg-tertiary my-2" />
        {isSidebarOpen ? (
          <div className="px-3 py-2 mb-2">
            <span className="text-sm font-medium text-custom-text-secondary mb-2 block">Theme</span>
            <ThemeSwitcher />
          </div>
        ) : (
          <div className="px-3 py-2 mb-2 flex justify-center">
            <ThemeSwitcher />
          </div>
        )}
        <nav className="space-y-1">
          {bottomMenuItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Menu