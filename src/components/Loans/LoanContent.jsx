import React, { useEffect, useState } from 'react'
import TransactionTable from './LoanTable'
import TransTypes from './TransTypes'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import LoanTable from './LoanTable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLoans } from '../../reducers/loansReducer'
import { fetchLoanapps } from '../../reducers/loanappsReducer'

function LoanContent() {
    const loans1 = [
        {
            id:'2',
            name:'Mitchell Nsimbi',
            amount:2300000,
            interest:'23000',
            balance:'30000',
            status:'pending',
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
            status:'rejected',
            award_date:'23/04/2024',
            installments:'10',
            closure_date:'23/06/2025',
            account:'34',
            history:'none',
        },{
            id:'1',
            name:'Rogers Mukiibi',
            amount:5000000,
            interest:'500000',
            balance:'450000',
            status:'approved',
            award_date:'23/04/2022',
            installments:'30',
            closure_date:'23/06/2024',
            account:'231',
            history:'none',
        }
    ]
    const laps = [
        {
            "id": 11,
            "account_no": 1,
            "account_details": {
                "id": 1,
                "owner": {
                    "id": 1,
                    "first_name": "Mitchell",
                    "last_name": "Nsimbi",
                    "other_names": "Blasio",
                    "date_of_birth": "2000-12-12",
                    "sex": "M",
                    "contact": "8903834829",
                    "email": "mit@mi.io",
                    "created_on": "2025-03-11T09:00:13.556268Z",
                    "updated_on": "2025-03-11T09:00:13.556298Z"
                },
                "balance": 200000,
                "status": "PA",
                "created_on": "2025-03-11T09:03:02.084409Z",
                "updated_on": "2025-03-11T09:03:02.084442Z"
            },
            "amount_requested": 560000,
            "status": "P",
            "created_on": "2025-03-12T10:38:08.403693Z"
        },
        {
            "id": 12,
            "account_no": 2,
            "account_details": {
                "id": 2,
                "owner": {
                    "id": 2,
                    "first_name": "Joan",
                    "last_name": "Masinde",
                    "other_names": "",
                    "date_of_birth": "2001-05-12",
                    "sex": "F",
                    "contact": "6987512365",
                    "email": "jo@jo.io",
                    "created_on": "2025-03-11T09:01:29.341302Z",
                    "updated_on": "2025-03-11T09:01:29.341318Z"
                },
                "balance": 5000000,
                "status": "PA",
                "created_on": "2025-03-11T09:03:17.555960Z",
                "updated_on": "2025-03-11T09:03:17.555980Z"
            },
            "amount_requested": 9060000,
            "status": "P",
            "created_on": "2025-03-12T10:38:18.820791Z"
        },
        {
            "id": 13,
            "account_no": 3,
            "account_details": {
                "id": 3,
                "owner": {
                    "id": 3,
                    "first_name": "Timothy",
                    "last_name": "Ssemwogerere",
                    "other_names": "",
                    "date_of_birth": "2003-01-07",
                    "sex": "M",
                    "contact": "7458932658",
                    "email": "tim@ti.io",
                    "created_on": "2025-03-11T09:02:22.937676Z",
                    "updated_on": "2025-03-11T09:02:22.937692Z"
                },
                "balance": 9000000,
                "status": "PA",
                "created_on": "2025-03-11T09:03:30.574737Z",
                "updated_on": "2025-03-11T09:03:30.574753Z"
            },
            "amount_requested": 3550000,
            "status": "A",
            "created_on": "2025-03-12T10:38:38.633776Z"
        },
        {
            "id": 14,
            "account_no": 2,
            "account_details": {
                "id": 2,
                "owner": {
                    "id": 2,
                    "first_name": "Joan",
                    "last_name": "Masinde",
                    "other_names": "",
                    "date_of_birth": "2001-05-12",
                    "sex": "F",
                    "contact": "6987512365",
                    "email": "jo@jo.io",
                    "created_on": "2025-03-11T09:01:29.341302Z",
                    "updated_on": "2025-03-11T09:01:29.341318Z"
                },
                "balance": 5000000,
                "status": "PA",
                "created_on": "2025-03-11T09:03:17.555960Z",
                "updated_on": "2025-03-11T09:03:17.555980Z"
            },
            "amount_requested": 100550000,
            "status": "R",
            "created_on": "2025-03-12T10:38:55.567038Z"
        }
    ]
    const accounts = [
        {
            "id": 1,
            "balance": 200000,
            "status": "PA",
            "created_on": "2025-03-11T09:03:02.084409Z",
            "updated_on": "2025-03-11T09:03:02.084442Z",
            "owner": 1
        },
        {
            "id": 2,
            "balance": 5000000,
            "status": "PA",
            "created_on": "2025-03-11T09:03:17.555960Z",
            "updated_on": "2025-03-11T09:03:17.555980Z",
            "owner": 2
        },
        {
            "id": 3,
            "balance": 9000000,
            "status": "PA",
            "created_on": "2025-03-11T09:03:30.574737Z",
            "updated_on": "2025-03-11T09:03:30.574753Z",
            "owner": 3
        }
    ]

    const [err, setErr] = useState(null)
    const dispatch = useDispatch()
    const {loans, error:loansErr,status:loansStatus} = useSelector(state =>state.loans)
    const {loanapps, error:loanappsErr, status: loanappStatus} = useSelector(state =>state.loanapps)
    useEffect(()=>{
        if(loansStatus==='idle'){
            dispatch(fetchLoans())
        }
        if(loanappStatus === 'idle'){
            dispatch(fetchLoanapps())
        }
    },[loansStatus,loanappStatus,dispatch])
    const {id} = useParams()
    const selectedLoan = id 
        ? loans.find(loan => loan.id == id)
        : <p className='bg-dblack-900'>No Transaction selected</p>

    return (
        <>
        <div className='col-span-8 row-span-4 bg-dblack-900 overflow-x-auto px-3'>
            <LoanTable loans={loanapps} accounts={accounts} />
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
