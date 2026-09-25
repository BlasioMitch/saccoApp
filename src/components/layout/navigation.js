import { Home, Users, DollarSign, CreditCard, Settings, FileText, HelpCircle, Wallet } from 'lucide-react'

// Single source of truth for the sidebar menu and the TopBar page title
export const MAIN_NAV = [
  { icon: Home, label: 'Dashboard', path: '/home', adminOnly: true },
  { icon: Users, label: 'Members', path: '/home/members', adminOnly: true },
  { icon: Wallet, label: 'Accounts', path: '/home/accounts', adminOnly: true },
  { icon: CreditCard, label: 'Loans', path: '/home/loans', adminOnly: true },
  { icon: DollarSign, label: 'Transactions', path: '/home/transactions', adminOnly: true },
  { icon: FileText, label: 'Profile', path: '/home/profile' },
]

export const BOTTOM_NAV = [
  { icon: Settings, label: 'Settings', path: '/home/settings' },
  { icon: HelpCircle, label: 'Help', path: '/home/help' },
]

export const getPageTitle = (pathname) => {
  const path = pathname.replace(/\/+$/, '')
  const item = [...MAIN_NAV, ...BOTTOM_NAV].find(navItem => navItem.path === path)
  return item?.label || 'Dashboard'
}
