import React, { useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../reducers/transactionReducer'
import formatUGX from '../../utils/currency'

function StatCards() {
    const dispatch = useDispatch()

    const { status, error, transactions } = useSelector(state => state.transactions)
    useEffect(() => {
        dispatch(fetchTransactions())
    },[ dispatch])
    
    // create filtered data on transactions
    const success = transactions.filter(transaction => transaction.status === 'S')
    const pending = transactions.filter(transaction => transaction.status === 'P')
    const rejected = transactions.filter(transaction => transaction.status === 'R')


    return (
        <>
        <Card titleText='Transactions' 
            cardText={
                <div className='flex justify-between -mt-2'>
                    <div className='flex-1 border-r border-r-dblack-50'>
                        <p className='text-center text-sm text-dcyan-700'>Successful</p>
                        <p className='text-center text-dcyan-300'>{success.length}</p>
                    </div>
                    <div className='flex-1 border-l border-r-dblack-50'>
                        <p className='text-center text-sm text-slate-300'>pending</p>
                        <p className='text-center text-white'>{pending.length}</p>
                    </div>

                    <div className='flex-1 border-l'>
                        <p className='text-center text-sm text-red-400'>failed</p>
                        <p className='text-center text-white'>{rejected.length}</p>
                    </div>
                </div>}/>
        <Card titleText='Transaction types' cardText={
            <div className='flex justify-between -mt-2'>
                    <div className='flex-1 border-r border-r-dblack-50'>
                        <p className='text-center text-sm text-dcyan-400'>Dep</p>
                        <p className='text-center text-dcyan-300'>250</p>
                    </div>
                    <div className='flex-1 border-l'>
                        <p className='text-center text-sm text-dcyan-400'>Loan</p>
                        <p className='text-center text-white'>6</p>
                    </div>
                    <div className='flex-1 border-l'>
                        <p className='text-center text-sm text-dcyan-400'>Mem</p>
                        <p className='text-center text-white'>100</p>
                    </div>
                    <div className='flex-1 border-l'>
                        <p className='text-center text-sm text-dcyan-400'>With</p>
                        <p className='text-center text-white'>56</p>
                    </div>

            </div>
        }/>
        {/* <Card titleText='Transactions' cardText='100'/> */}
        <div className='bg-dblack-900 rounded col-span-4 flex flex-col '>
            <p className='text-xl px-2 my-2'>Quick links...</p>
            <NavLink to={'../home/'} className='text-sm text-dcyan-600 my-0.5 px-2 underline hover:text-dcyan-800 hover:no-underline'>Home</NavLink>
            <NavLink to={'../transactions/'} className='text-sm text-dcyan-600 my-0.5 px-2 underline hover:text-dcyan-800 hover:no-underline'>Transactions</NavLink>
            <NavLink to={'../reports/'} className='text-sm text-dcyan-600 my-0.5 px-2 underline hover:text-dcyan-800 hover:no-underline'>Balance Sheet</NavLink>

        </div>

        </>
    )
}

export default StatCards


const Card = ({titleText,cardText}) => {
    return (
    <>
     <div className='p-4 bg-dblack-900 col-span-4 rounded '>
        <div className='flex flex-col mb-0 justify-between gap-1 '>
            <div className='border-b-2 pb-2 my-2 border-dblack-600 flex flex-nowrap justify-between '>
                <h1 className='text-slate-100 text-lg capitalize flex-1 text-center'>
                    {titleText}
                </h1>
                
            </div>
            <div>
                <h1 className='text-slate-400 text-base capitalize'>
                    {cardText}
                </h1>
            </div>

        </div>
     </div>
    </>)
}