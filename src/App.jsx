import { Routes, Link, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard'
import Grid from './components/Dashboard/Grid'
import Team from './components/Team/Team'
import Details from './components/Team/Details'
import MemberForm from './components/Team/MemberForm'
import Transactions from './components/Transactions/Transactions'

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
            <Route path='transactions/' element={<Transactions />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
     
    </>
  )
}

export default App