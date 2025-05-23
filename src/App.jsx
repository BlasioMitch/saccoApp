import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Grid from './pages/Dashboard/Grid'
import Team from './pages/Team/Team'
import Transactions from './pages/Transactions/Transactions'
import Loans from './pages/Loans/Loans'
import { Toaster } from 'sonner'
import { useSelector } from 'react-redux'
import Accounts from './pages/Accounts/Accounts'
import Profiles from './pages/Profiles/Profiles'
import { ThemeProvider } from './components/ui/ThemeProvider'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const UserProfileRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const isRegularUser = user?.role?.toLowerCase() === 'user'
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (isRegularUser) {
    // For regular users, we'll pass their own ID to the Profiles component
    return <Profiles userId={user.id} isRegularUser={true} />
  }
  
  return children
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Grid />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Team />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="loans" element={<Loans />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="profile" element={
            <UserProfileRoute>
              <Profiles />
            </UserProfileRoute>
          } />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}

export default App