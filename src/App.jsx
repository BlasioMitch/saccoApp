import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login/Login'
import Grid from './pages/Dashboard/Grid'
import { Toaster } from 'sonner'
import { useSelector } from 'react-redux'
import { ThemeProvider } from './components/ui/ThemeProvider'
import { STAFF_ROLES } from './components/layout/navigation'
import { useOfflineSync } from './offline/useOfflineSync'

// Pages load on first visit (a skeleton of the page shows meanwhile, see Grid)
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Team = lazy(() => import('./pages/Team/Team'))
const Transactions = lazy(() => import('./pages/Transactions/Transactions'))
const Loans = lazy(() => import('./pages/Loans/Loans'))
const Accounts = lazy(() => import('./pages/Accounts/Accounts'))
const Savings = lazy(() => import('./pages/Savings/Savings'))
const LoanPayments = lazy(() => import('./pages/LoanPayments/LoanPayments'))
const Settings = lazy(() => import('./pages/Settings/Settings'))
const LoanApplications = lazy(() => import('./pages/LoanApplications/LoanApplications'))
const Profiles = lazy(() => import('./pages/Profiles/Profiles'))
const PasswordResets = lazy(() => import('./pages/PasswordResets/PasswordResets'))
const Reports = lazy(() => import('./pages/Reports/Reports'))
const AuditTrail = lazy(() => import('./pages/AuditTrail/AuditTrail'))

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Pages for some roles only (the sidebar hides them too); anyone else lands on their own profile
const RoleRoute = ({ roles, children }) => {
  const role = useSelector(state => state.auth.user?.role)
  return roles.includes(String(role || '').toUpperCase()) ? children : <Navigate to="/home/profile" replace />
}

const staff = (element) => <RoleRoute roles={STAFF_ROLES}>{element}</RoleRoute>

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
  // Changes made offline are sent once the server can be reached again
  useOfflineSync()
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
          <Route index element={staff(<Dashboard />)} />
          <Route path="members" element={staff(<Team />)} />
          <Route path="transactions" element={staff(<Transactions />)} />
          <Route path="loans" element={staff(<Loans />)} />
          <Route path="loan-payments" element={staff(<LoanPayments />)} />
          <Route path="loan-applications" element={staff(<LoanApplications />)} />
          <Route path="settings" element={<Settings />} />
          <Route path="accounts" element={staff(<Accounts />)} />
          <Route path="savings" element={staff(<Savings />)} />
          <Route path="password-resets" element={staff(<PasswordResets />)} />
          <Route path="reports" element={staff(<Reports />)} />
          <Route path="audit" element={<RoleRoute roles={['ADMIN']}><AuditTrail /></RoleRoute>} />
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