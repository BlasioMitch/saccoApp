import React, { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import { FiPlus } from 'react-icons/fi'
import { LuEye, LuUserCircle2 } from 'react-icons/lu'
import { PiXCircle } from 'react-icons/pi'
import { NavLink, useNavigate } from 'react-router-dom'
import LoanForm from './LoanForm'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { createLoanapp, patchLoanapp } from '../../reducers/loanappsReducer'

function LoanTable({loans, accounts}) {
    const { users} = useSelector(state => state.users)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isLoanFormOpen, setisLoanFormOpen] = useState(false)
    const [isDisplayOpen, setIsDisplayOpen] = useState(false)
    const [appAmount, setAppAmount] = useState(50000)
    const [selectedApp, setSelectedApp] = useState(null)
    const [selectedUser, setSelectedUser] = useState('')
    const [err, setErr] = useState(null)

    const dispatch = useDispatch()

    const handleFormOpen = () =>{
        setAppAmount(50000)
        setIsFormOpen(!isFormOpen)
    }

    const handleLoanFormOpen = () => {
        setisLoanFormOpen(!isLoanFormOpen)
    }

    const handleLoanFormClose = () => {
        setisLoanFormOpen(false);
    }
 
    const createLoanApplication = () => {
        const loanAppObj = {
            account_no:Number(selectedUser),
            amount_requested:Number(appAmount)
        }
        console.log('Creating a loan application with ',loanAppObj)
        dispatch(createLoanapp(loanAppObj))
        setAppAmount(50000)
        setSelectedUser('')
    }

    const approveLoanApp = (id) => {
        const loanAppObj={status:'A'}
        dispatch(patchLoanapp({id,loanAppObj}))
    }

    const rejectLoanApp = (id) => {
        const loanAppObj={status:'R'}
        console.log('Reject in progress ...')
        dispatch(patchLoanapp({id,loanAppObj}))
        if(isDisplayOpen){
            setTimeout(setIsDisplayOpen(false),3)
        }
    }

    const viewLoanApplicaiton = (applicationData) => {
        console.log(applicationData,' to view')
        setSelectedApp({...applicationData})
        setIsDisplayOpen(true)
    }

    const handleCreateLoan = (e) => {
        e.preventDefault()
        setisLoanFormOpen(true)
        console.log('selected app is ',selectedApp)
    }

    const handleUserChange = (e) =>{
        const {name,value} = e.target
        let newUser = value
        // get the account assoicated with the user
        const acc = accounts.find(account => account.owner == newUser)
        console.log(acc,' account is')
        setSelectedUser(newUser)
        setSelectedApp(preSel => ({
            ...preSel,
            [name]: acc.id
        }))
    }

    return (
        <>
        <div>
            {/* Error notification */}
            {/* <div className={err ? 'border-red-600' : 'border-green-600'}>
                <p>Something went Wrong!</p>
            </div> */}
            <div className='flex items-end  justify-between'>
              <p className='capitalize text-xl text-dcyan-600'>loan applications</p>  
            <button onClick={handleFormOpen} className='mt-3 p-2 border flex items-center gap-2 rounded hover:bg-dblack-700 capitalize font-semibold'>New application
                <FiPlus />
            </button>
            </div>
            <table className='min-w-full mt-2  table-auto border-separate border-spacing-y-2' >
                <thead className='uppercase  text-sm center font-normal bg-dblack-600  text-slate-400'>
                    <tr>
                    <th className='py-2 px-2 whitespace-nowrap'>accNo</th>
                        <th className='py-2 px-2 whitespace-nowrap'>name</th>
                        <th className='py-2 px-2 whitespace-nowrap'>Amount</th>
                        <th className='py-2 px-2 whitespace-nowrap'>Status</th>
                        <th className='py-2 px-2 whitespace-nowrap'>Request date</th>
                        <th className='py-2 px-2 whitespace-nowrap'>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        loans.map(lap => <LoanRow key={lap.id}
                            id={lap.id} account={lap.account_no} request_date={lap.created_on}
                            amount={lap.amount_requested} name={`${lap.account_details.owner.first_name} ${lap.account_details.owner.last_name} ${lap.account_details.owner.other_names}`}
                            status={lap.status}  handleView={()=>viewLoanApplicaiton(lap)} 
                            handleApprove={()=>approveLoanApp(lap.id)} handleReject={()=>rejectLoanApp(lap.id)}
                        />)
                    }
                </tbody>
            </table>
        </div>
        <div className={`fixed top-0 right-0 bg-dblack-700 h-full w-96 transition-transform duration-300 ease-in-out
            transform ${isFormOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='p-5 '>
                <div className=' transition-all duration-200 hover:border mt-2 mb-4 hover:rounded-md size-10 absolute right-0 flex items-center justify-center'>
                    <FaXmark className='size-8 hover:cursor-pointer' onClick={handleFormOpen}/>
                </div>
                    <p className=' mt-14 uppercase text-lg font-bold'>New Loan application</p>
                <form>
                    <select className='mt-4 w-full p-2 h-12 bg-dblack-800' name="account" value={selectedUser} id="" onChange={handleUserChange}>
                        <option value="">--Select User--</option>
                        {
                            users.map(user=>(
                                <option key={user.id} className='bg-dblack-700 m-6 ' value={user.id}>{user.first_name} {user.last_name} {user.other_names ? user.other_names : ''}</option>
                            ))
                        }
                    </select>
                  <input className='p-2 px-3 w-full h-12 my-4' type="number" name="requested_amount" placeholder='Loan Amount' id="" value={appAmount} onChange={(e) => setAppAmount(e.target.value)}/>
                </form>
                <button onClick={createLoanApplication} className='mt-4 py-2 border rounded px-4 text-lg hover:bg-dblack-300'>Create</button>
            </div>
        </div>
        <div className={`fixed z-10 top-0 right-0 bg-dblack-700 h-full w-96 transition-transform duration-300 ease-in-out
            transform ${isDisplayOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='p-5 '>
                <div className=' transition-all duration-200 hover:border mt-2 mb-4 hover:rounded-md size-10 absolute right-0 flex items-center justify-center'>
                    <FaXmark className='size-8 hover:cursor-pointer' onClick={()=> setIsDisplayOpen(false)}/>
                </div>
                    <p className=' mt-14 mb-4 uppercase text-lg font-bold'>loan application details</p>
                <DetailDiv detail_title={'account holder'} detail_value={`${selectedApp?.account_details?.owner?.first_name} ${selectedApp?.account_details?.owner?.last_name} ${selectedApp?.account_details?.owner?.other_names}`}/>
                <DetailDiv detail_title={'account number'} detail_value={selectedApp?.account_no}/>
                <DetailDiv detail_title={'amount'} detail_value={selectedApp?.amount_requested}/>
                <DetailDiv detail_title={'status'} detail_value={selectedApp?.status == 'P' ? 'Pending' : selectedApp?.status == 'A' ? 'Approved' : 'Rejected'}/>
                {
                    selectedApp?.status=='P' && (<>
                    <div className='flex gap-2 justify-between'>
                        <button onClick={()=>approveLoanApp(selectedApp?.id)} className='mt-4 py-2 border rounded px-4 text-lg bg-green-600 text-black hover:bg-green-700'>Approve</button>
                        <button onClick={()=>rejectLoanApp(selectedApp?.id)} className='mt-4 py-2 border rounded px-4 text-lg bg-red-600 hover:bg-red-700'>Reject</button>
                    </div>

                    </>)
                }
                {
                    selectedApp?.status == 'A' && (<>
                    <div>
                        <button onClick={handleCreateLoan} className='border p-2 capitalize mt-3 font-semibold text-lg rounded-md hover:bg-dblack-600'> proceed to create loan</button>
                    </div>
                    </>)
                }
            </div>
        </div>
        {
            isLoanFormOpen && (<>
                <div className={`fixed z-10 top-0 right-0 bg-dblack-700 h-full w-96 transition-transform duration-300 ease-in-out
                    transform ${isLoanFormOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className=' transition-all duration-200 hover:border mt-2 mb-4 hover:rounded-md size-10 absolute right-0 flex items-center justify-center'>
                            <FaXmark className='size-8 hover:cursor-pointer' onClick={handleLoanFormOpen}/>
                    </div>

                    <LoanForm loanApplication={selectedApp} onClose={handleLoanFormClose} />
                </div>
            </>)
        }

        </>
    )
}

export default LoanTable

const LoanRow = ({id, account,amount,status, name, request_date, handleView, handleApprove, handleReject}) => {
    return(
        <>
            <tr key={id} className='text-dcyan-300 text-sm 
                even:bg-dblack-800 even:hover:bg-transparent odd:hover:bg-dblack-700
                capitalize text-center'>
                <td className='pl-1.5 whitespace-nowrap'>{account}</td>

                <td className='pl-1.5 whitespace-nowrap text-left'>
                    <NavLink to={`/loans/${id}`}>
                    {name}
                    </NavLink>
                    
                    </td>
                <td className='pl-1.5 whitespace-nowrap'>{amount}</td>
                <td className={`pl-1.5 whitespace-nowrap text-center`}>
                    <p className={` rounded-xl px-3 center
                    ${
                        status == 'P' ? 'text-white bg-dblack-50'
                        : status == 'A' ? 'text-green-950 bg-green-500' 
                        : 'text-red-100 bg-red-500'}`}>{
                            status == 'P' ? 'Pending'
                            : status == 'A' ? 'Approved'
                            : 'Rejected'
                        }</p>
                            </td>
                <td className='pl-1.5 whitespace-nowrap'>{moment(request_date).format('DD-MMM-YYYY')}</td>
                <td className='pl-1.5 whitespace-nowrap  flex place-content-between items-center'>
                    <LuEye onClick={handleView} className='size-6 m-1 fill-blue-300 stroke-blue-950 hover:cursor-pointer'/>
                    {
                        status == 'P' &&(<>
                            <FaCheckCircle onClick={handleApprove} className='size-5 m-1 fill-green-300 stroke-green-900 hover:cursor-pointer'/>
                            <PiXCircle onClick={handleReject} className='size-6 m-1 fill-red-500 hover:cursor-pointer'/>
                        </>)
                    }
                </td>

            </tr>
        </>
    )
}

const DetailDiv = ({detail_title, detail_value}) =>{
    return(
        <>
         <div className='border border-dblack-400 w-full flex items-center height gap-2 my-1'>
                        <p className='flex-1 bg-dblack-800 capitalize text-lg p-2'>{detail_title}</p>
                        <p className='flex-1 text-base capitalize'>{detail_value}</p>
        </div>
        </>
    )
}