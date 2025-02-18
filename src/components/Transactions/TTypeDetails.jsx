import React from 'react'
import moment from 'moment'
import { useOutletContext } from 'react-router-dom'

const TTypeDetails = () => {
    const transactiontype = useOutletContext()
    return (
        <>
            <div className='bg-dblack-900 col-span-4 row-span-2 rounded p-4'>
                <div className='flex flex-col px-1 pb-2 
                border-b-dblack-300 gap-3 rounded-b-lg'>
                    <h2 className='text-xl text-dcyan-600 font-bold py-2 mb-2 sticky top-0 bg-dblack-900'>Details</h2>
                    <Detail title='type id' value={transactiontype.id}/>
                    <Detail title='name' value={transactiontype.name}/>
                    <Detail title='description' value={transactiontype.description}/>
                    <Detail title='created by' value={transactiontype.created_by}/>
                    <Detail title='created on' value={moment(transactiontype.created_on).format('DD-MMM-YYYY')}/>


                </div>
            </div>
        </>
    )
}

export default TTypeDetails

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