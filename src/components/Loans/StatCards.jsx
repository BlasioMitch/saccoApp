import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLoans } from '../../reducers/loansReducer'

function StatCards() {
    const dispatch = useDispatch()
    const { loans, status } = useSelector((state) => state.loans)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchLoans())
        }
    }, [status, dispatch])

    // Calculate loan statistics
    const totalLoanAmount = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0)
    const totalInterest = loans.reduce((sum, loan) => sum + (loan.interest || 0), 0)
    const awardedLoans = loans.filter(loan => loan.status === 'APPROVED').length
    const totalApplications = loans.length

    return (
        <>
        <Card titleText='Loans in Cash' 
            cardText={
                <div className='flex justify-between -mt-2'>
                    <div className='flex-1 border-r border-r-dblack-50'>
                        <p className='text-center text-sm text-dcyan-700'>Amount (UGX)</p>
                        <p className='text-center text-dcyan'>{totalLoanAmount.toLocaleString()}</p>
                    </div>
                    <div className='flex-1 border-l'>
                        <p className='text-center text-sm text-green-300'>Interest (UGX)</p>
                        <p className='text-center text-white'>{totalInterest.toLocaleString()}</p>
                    </div>
                </div>}/>
        <Card titleText='Loans' cardText={
            <div className='flex justify-between -mt-2'>
                    <div className='flex-1 border-r'>
                        <p className='text-center text-sm text-dcyan-400'>Awarded</p>
                        <p className='text-center text-white'>{awardedLoans}</p>
                    </div>
                    <div className='flex-1 border-l border-r-dblack-50'>
                        <p className='text-center text-sm text-dcyan-400'>Applications</p>
                        <p className='text-center text-dcyan-300'>{totalApplications}</p>
                    </div>
            </div>
        }/>
        <div className='bg-dblack-900 rounded col-span-4 flex flex-col '>
            <p className='text-xl px-2 my-2'>Related Links</p>
            <button className='text-sm text-dcyan-600 my-0.5 px-2 text-left hover:text-dcyan-800'>Reports</button>
            <button className='text-sm text-dcyan-600 my-0.5 px-2 text-left hover:text-dcyan-800'>Transactions</button>
            <button className='text-sm text-dcyan-600 my-0.5 px-2 text-left hover:text-dcyan-800'>Balance Sheet</button>
        </div>
        </>
    )
}

export default StatCards

const Card = ({titleText, cardText}) => {
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