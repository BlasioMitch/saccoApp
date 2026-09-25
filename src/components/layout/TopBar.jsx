import React, { useEffect } from 'react'
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout, initializeAuth } from '../../reducers/authReducer'
import { toast } from 'sonner'
import DropdownMenu from '../ui/DropdownMenu'
import { getPageTitle } from './navigation'

const UserMenu = ({ user, onLogout }) => {
  const navigate = useNavigate()

  // Handle missing name data gracefully
  const firstName = user?.firstName || user?.first_name?.split(' ')[0] || 'User'
  const lastName = user?.lastName || user?.last_name?.split(' ')[1] || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
  const userRole = user?.role?.toLowerCase() || 'user'

  return (
    <DropdownMenu
      ariaLabel="Account menu"
      size="md"
      triggerClassName="h-12 gap-2 px-2 text-left"
      label={
        <>
          <span className="relative inline-flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-custom-brand-primary text-xs font-semibold text-custom-interactive-active-text">
              {initials || 'U'}
            </span>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-custom-bg-secondary" />
          </span>
          <span className="hidden md:block">
            <span className="block text-sm font-medium leading-5 text-custom-text-primary">{fullName}</span>
            <span className="block text-xs capitalize leading-4 text-custom-text-secondary">{userRole}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-custom-text-secondary" />
        </>
      }
      items={[
        { label: 'Profile', icon: User, onClick: () => navigate('/home/profile') },
        { label: 'Settings', icon: Settings, onClick: () => navigate('/home/settings') },
        { label: 'Logout', icon: LogOut, danger: true, onClick: onLogout },
      ]}
    />
  )
}

const TopBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Initialize auth state from localStorage on component mount
    dispatch(initializeAuth())
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error(error || 'Logout failed')
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary bg-custom-bg-secondary px-6">
      <h1 className="truncate text-xl font-semibold leading-8 text-custom-text-primary">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-custom-text-secondary transition-colors hover:bg-custom-interactive-hover hover:text-custom-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        {isAuthenticated && user && <UserMenu user={user} onLogout={handleLogout} />}
      </div>
    </header>
  )
}

export default TopBar
