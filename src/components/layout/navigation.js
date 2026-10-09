import {
  Home, Users, UserRound, IdCard, DollarSign, CreditCard, Settings, HelpCircle,
  Wallet, PiggyBank, CalendarRange, BookOpen, HandCoins, ClipboardCheck,
} from 'lucide-react'

// Single source of truth for the sidebar menu and the TopBar title.
// Entries are pages ({ path }) or groups ({ children }); routes never change, only how they are grouped.
export const MAIN_NAV = [
  { icon: Home, label: 'Dashboard', path: '/home', adminOnly: true },
  {
    icon: Users,
    label: 'Members',
    children: [
      { icon: UserRound, label: 'Member List', path: '/home/members', adminOnly: true },
      { icon: IdCard, label: 'Member Profile', path: '/home/profile' },
    ],
  },
  {
    icon: PiggyBank,
    label: 'Savings',
    children: [
      { icon: Wallet, label: 'Accounts', path: '/home/accounts', adminOnly: true },
      { icon: CalendarRange, label: 'Savings Timeline', path: '/home/savings', adminOnly: true },
    ],
  },
  {
    icon: CreditCard,
    label: 'Lending',
    children: [
      { icon: BookOpen, label: 'Loan Book', path: '/home/loans', adminOnly: true },
      // badge: live count supplied by the menu (pending member applications)
      { icon: ClipboardCheck, label: 'Applications', path: '/home/loan-applications', adminOnly: true, badge: 'pendingApplications' },
      { icon: HandCoins, label: 'Repayments', path: '/home/loan-payments', adminOnly: true },
    ],
  },
  { icon: DollarSign, label: 'Transactions', path: '/home/transactions', adminOnly: true },
]

export const BOTTOM_NAV = [
  { icon: Settings, label: 'Settings', path: '/home/settings' },
  { icon: HelpCircle, label: 'Help', path: '/home/help' },
]

// Menu as a given user sees it: hidden pages dropped, empty groups removed,
// and a group left with a single page shown as that page (e.g. a member sees just "Member Profile")
export const visibleNav = (items, { isAdmin }) => items.flatMap(item => {
  if (!item.children) return !item.adminOnly || isAdmin ? [item] : []
  const children = item.children.filter(child => !child.adminOnly || isAdmin)
  if (children.length === 0) return []
  if (children.length === 1) return [children[0]]
  return [{ ...item, children }]
})

// Every page with the group it belongs to (if any)
export const flattenNav = (items) => items.flatMap(item => item.children
  ? item.children.map(child => ({ ...child, group: item.label }))
  : [{ ...item, group: null }])

// Title and group as the user's own menu shows them (a member's flat "Member Profile" has no group)
export const getPageTitle = (pathname, { isAdmin = true } = {}) => {
  const path = pathname.replace(/\/+$/, '')
  const page = flattenNav([...visibleNav(MAIN_NAV, { isAdmin }), ...BOTTOM_NAV]).find(item => item.path === path)
  return page ? { title: page.label, group: page.group } : { title: 'Dashboard', group: null }
}
