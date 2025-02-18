import React from 'react'
import TransactionTable from './TransactionTable'
import TransTypes from './TransTypes'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

function TransContent() {
    // const transactions = [
    //     {by:'mitchell nsimbi',id:1,account:234,type:'Loan Disb',amount:2000000,trndate:'12/9/2004',status:'success'},
    //     {by:'mitchell nsimbi',id:2,account:234,type:'Loan Payt',amount:160000,trndate:'23/8/2014',status:'failed'},
    //     {by:'mitchell nsimbi',id:3,account:234,type:'Membership Fee',amount:20000,trndate:'12/4/2024',status:'pending'}

    // ]
    const {transactions} = useSelector(state => state.transactions)
    const {transactiontypes} = useSelector(state => state.transactiontypes)
    const location = useLocation()

    const {id} = useParams()
       
    let selectedItem = null
    
    if(id){
        if(location.pathname.startsWith('/transactions/types')){
        selectedItem = transactiontypes.find(type => type.id == id)
        } else if (location.pathname.startsWith('/transactions')){    
         selectedItem = transactions.find(tran => tran.id == id)
        }
    }

    return (
        <>
        <div className='col-span-8 row-span-4 bg-dblack-900 overflow-x-auto px-3'>
            <TransactionTable transactions={transactions} />
        </div>
        <div className='overflow-y-auto col-span-4 row-span-2'>
            { 
            selectedItem 
            ?  <Outlet context={selectedItem}/>
            :''
        }

        </div>
        <TransTypes types={transactiontypes} />
        </>
    )
}

export default TransContent
