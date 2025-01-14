import { Routes, Link, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard'
import Grid from './components/Dashboard/Grid'
import Team from './components/Team/Team'
import Details from './components/Team/Details'
import MemberForm from './components/Team/MemberForm'
import Transactions from './components/Transactions/Transactions'
import TransactionTypeForm from './components/Transactions/TransactionTypeForm'
import TransactionDetails from './components/Transactions/TransactionDetails'
import Loans from './components/Loans/Loans'
import LoanDetails from './components/Loans/LoanDetails'

const App = () => {

  return(
    <>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          {/* Child routes Team and Grid */}
            <Route path='home/' element={<Grid />}/>
            <Route path='team/' element={<Team />}>
              {/* Child routes for Team */}
              <Route path=':id' element={<Details />} />
              <Route path='add/' element={<MemberForm />} />
            </Route>
            <Route path='transactions/' element={<Transactions />}>
              <Route path='add-type/' element={<TransactionTypeForm />} />
              <Route path=':id/' element={<TransactionDetails />} />
            </Route> 
            <Route path='loans/' element={<Loans /> }>
                <Route path=':id' element={<LoanDetails />} />
            </Route>
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
     
    </>
  )
}

export default App