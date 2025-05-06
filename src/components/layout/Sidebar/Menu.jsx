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

const Menu = ({ isSidebarOpen }) => {
  const mainMenuItems = [
    { icon: <Home />, label: 'Dashboard', path: '/home' },
    { icon: <Users />, label: 'Members', path: '/members' },
    { icon: <Wallet />, label: 'Accounts', path: '/accounts' },
    { icon: <CreditCard />, label: 'Loans', path: '/loans' },
    { icon: <DollarSign />, label: 'Transactions', path: '/transactions' },
    { icon: <FileText />, label: 'Profile', path: '/profile' },
  ]

  const bottomMenuItems = [
    { icon: <Settings />, label: 'Settings', path: '/settings' },
    { icon: <HelpCircle />, label: 'Help', path: '/help' }
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