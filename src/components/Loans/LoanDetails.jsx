import React from 'react'
import { useOutletContext } from 'react-router-dom'

function LoanDetails() {
    const loan = useOutletContext()

    return (
        <>
            <div className='bg-dblack-900 col-span-4 row-span-2 rounded p-4'>
                <div className='flex flex-col px-1 pb-2 
                border-b-dblack-300 gap-3 rounded-b-lg'>
                    <h2 className='text-xl text-dcyan-600 font-bold py-2 mb-2 sticky z-0 top-0 bg-dblack-900'>Details</h2>
                    <Detail title='loan id' value={loan.id}/>
                    <Detail title='name' value={loan.name} />
                    <Detail title='amount' value={loan.amount}/>
                    <Detail title='interest' value={loan.interest}/>
                    <Detail title='balance' value={loan.balance}/>
                    <Detail title='status' value={loan.status} />
                    <Detail title='installments' value={loan.installments}/>
                    <Detail title='award date' value={loan.award_date}/>
                    <Detail title='closure date' value={loan.closure_date}/>
                    <Detail title='account' value={loan.account}/>
                    <Detail title='history' value={loan.history}/>

                </div>
            </div>
        </>
    )
}

export default LoanDetails

const Detail = ({title, value}) => {

    return(
        <>
            <div className='flex  py-2 even:bg-dblack-400'>
                <p className='flex-1 px-2 uppercase text-sm font-medium
                 text-dcyan-900'>{title}</p>
                <p className='flex-1 capitalize text-sm'>{value}</p>
            </div>
        </>
    )
}