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
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Grid />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path="members" element={<Team />} />
          <Route path="transactions" element={<Transactions />}>
          </Route> 
          <Route path="loans" element={<Loans />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="profile" element={<Profiles />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}

export default App