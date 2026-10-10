import React, { useEffect } from 'react'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout, initializeAuth } from '../../reducers/authReducer'
import { toast } from 'sonner'
import DropdownMenu from '../ui/DropdownMenu'
import Avatar from '../ui/Avatar'
import { getPageTitle } from './navigation'
import NotificationBell from '../notifications/NotificationBell'
import OfflineStatus from '../offline/OfflineStatus'
import { clearOfflineData } from '../../offline/persist'
import { getOutbox } from '../../offline/outbox'

const UserMenu = ({ user, onLogout }) => {
  const navigate = useNavigate()

  // Handle missing name data gracefully
  const firstName = user?.firstName || user?.first_name?.split(' ')[0] || 'User'
  const lastName = user?.lastName || user?.last_name?.split(' ')[1] || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const userRole = user?.role?.toLowerCase() || 'user'

  return (
    <DropdownMenu
      ariaLabel="Account menu"
      size="md"
      triggerClassName="h-12 gap-2 px-2 text-left"
      label={
        <>
          <span className="relative inline-flex">
            <Avatar user={user} className="h-8 w-8" textClassName="text-xs" />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-custom-bg-primary" />
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
  const page = getPageTitle(pathname, { isAdmin: user?.role?.toLowerCase() !== 'user', role: user?.role })

  useEffect(() => {
    // Initialize auth state from localStorage on component mount
    dispatch(initializeAuth())
  }, [dispatch])

  const handleLogout = async () => {
    const waiting = getOutbox().filter(item => item.userId === user?.id && !item.error).length
    try {
      await dispatch(logout()).unwrap()
      await clearOfflineData()
      if (waiting) toast.info(`${waiting} change${waiting === 1 ? '' : 's'} made offline will be sent after you sign in again`)
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error(error || 'Logout failed')
    }
  }

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-custom-bg-tertiary bg-custom-bg-primary px-6 shadow-raised">
      <h1 className="flex min-w-0 items-baseline gap-2 truncate text-lg font-semibold leading-8 text-custom-text-primary xl:text-xl">
        {page.group && (
          <>
            <span className="text-base font-medium text-custom-text-secondary">{page.group}</span>
            <span className="text-base font-medium text-custom-text-muted" aria-hidden="true">/</span>
          </>
        )}
        <span className="truncate">{page.title}</span>
      </h1>

      <div className="flex items-center gap-2">
        {isAuthenticated && user && <OfflineStatus />}
        {isAuthenticated && user && <NotificationBell />}
        {isAuthenticated && user && <UserMenu user={user} onLogout={handleLogout} />}
      </div>
    </header>
  )
}

export default TopBar
