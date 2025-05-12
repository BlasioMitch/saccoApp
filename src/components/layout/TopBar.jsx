import React, { useState, useEffect } from 'react'
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, initializeAuth } from '../../reducers/authReducer'
import { toast } from 'sonner'

const UserDropdown = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-custom-bg-secondary border border-custom-bg-tertiary">
      <div className="py-1" role="menu">
        <button
          onClick={() => window.location.href = '/profile'}
          className="flex w-full items-center px-4 py-2 text-sm text-custom-text-primary hover:bg-custom-interactive-hover"
          role="menuitem"
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </button>
        <button
          onClick={() => window.location.href = '/settings'}
          className="flex w-full items-center px-4 py-2 text-sm text-custom-text-primary hover:bg-custom-interactive-hover"
          role="menuitem"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-custom-interactive-hover"
          role="menuitem"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

const UserAvatar = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  if (!user) return null;

  // Handle missing name data gracefully
  const firstName = user?.firstName || user?.first_name?.split(' ')[0] || 'User'
  const lastName = user?.lastName || user?.last_name?.split(' ')[1] || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
  const userRole = user?.role?.toLowerCase() || 'user'
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 hover:bg-custom-interactive-hover rounded-full py-1 px-2 transition-colors"
      >
        <div className="relative inline-flex items-center">
          <div className="w-10 h-10 rounded-full bg-custom-brand-primary flex items-center justify-center text-custom-interactive-active-text font-medium">
            {initials || 'U'}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-custom-bg-secondary bg-green-500"></span>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-custom-text-primary text-left">
            {fullName}
          </p>
          <p className="text-xs text-custom-text-secondary text-left">
            {userRole}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-custom-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      <UserDropdown 
        isOpen={isDropdownOpen} 
        onClose={() => setIsDropdownOpen(false)}
        onLogout={() => {
          onLogout();
          setIsDropdownOpen(false);
        }}
      />
    </div>
  )
}

const TopBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Initialize auth state from localStorage on component mount
    dispatch(initializeAuth())
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logged out successfully')
<<<<<<< HEAD
      navigate('/login')
=======
      navigate('/')
>>>>>>> frontend
    } catch (error) {
      toast.error(error || 'Logout failed')
    }
  }

  return (
    <div className="h-16 px-4 border-b border-custom-bg-tertiary bg-custom-bg-secondary">
      <div className="h-full flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-custom-text-primary">
            Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">          
          <button className="p-2 rounded-full hover:bg-custom-interactive-hover text-custom-text-secondary">
            <Bell className="w-5 h-5" />
          </button>
          
          {isAuthenticated && user && <UserAvatar user={user} onLogout={handleLogout} />}
        </div>
      </div>
    </div>
  )
}

export default TopBar
