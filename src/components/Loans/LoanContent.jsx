import React from 'react'
import TransactionTable from './LoanTable'
import TransTypes from './TransTypes'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import LoanTable from './LoanTable'

function LoanContent() {
    const loans = [
        {
            id:'2',
            name:'Mitchell Nsimbi',
            amount:2300000,
            interest:'23000',
            balance:'30000',
            status:'active',
            award_date:'23/04/2023',
            installments:'20',
            closure_date:'23/06/2024',
            account:'23',
            history:'none',
        },
        {
            id:'3',
            name:'Joan Nsimbi',
            amount:300000,
            interest:'3000',
            balance:'25000',
            status:'active',
            award_date:'23/04/2024',
            installments:'10',
            closure_date:'23/06/2025',
            account:'34',
            history:'none',
        },{
            id:'4',
            name:'Rogers Mukiibi',
            amount:5000000,
            interest:'500000',
            balance:'450000',
            status:'active',
            award_date:'23/04/2022',
            installments:'30',
            closure_date:'23/06/2024',
            account:'231',
            history:'none',
        }
    ]
    const {id} = useParams()
    const selectedLoan = id 
        ? loans.find(loan => loan.id == id)
        : <p className='bg-dblack-900'>No Transaction selected</p>

    return (
        <>
        <div className='col-span-8 row-span-4 bg-dblack-900 overflow-x-auto px-3'>
            <LoanTable loans={loans} />
        </div>
        <div className='overflow-y-auto col-span-4 row-span-4'>
            { 
            selectedLoan 
            ?  <Outlet context={selectedLoan}/>
            : <p>No Transaction has been selected</p>    
        }

        </div>
        {/* <TransTypes /> */}
        </>
    )
}

export default LoanContent
