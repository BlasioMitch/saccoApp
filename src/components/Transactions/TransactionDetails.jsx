import React from 'react'
import moment from 'moment'
import { useOutletContext } from 'react-router-dom'

function TransactionDetails() {
    const transaction = useOutletContext()

    return (
        <>
            <div className='bg-dblack-900 col-span-4 row-span-2 rounded p-4'>
                <div className='flex flex-col px-1 pb-2 
                border-b-dblack-300 gap-3 rounded-b-lg'>
                    <h2 className='text-xl text-dcyan-600 font-bold py-2 mb-2 sticky top-0 bg-dblack-900'>Details</h2>
                    <Detail title='trn id' value={transaction.id}/>
                    <Detail title='account' value={transaction.account_no}/>
                    <Detail title='type' value={transaction.type}/>
                    <Detail title='amount' value={transaction.amount}/>
                    <Detail title='status' value={transaction.status} />
                    <Detail title='trn date' value={moment(transaction.created_on).format('DD-MMM-YYYY')} />
                    <Detail title='by' value={transaction.created_by} />

                </div>
            </div>
        </>
    )
}

export default TransactionDetails

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