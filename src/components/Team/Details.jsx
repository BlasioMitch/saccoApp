import React from 'react'
import { useOutletContext } from 'react-router-dom'

function Details() {
    const member = useOutletContext()

    return (
        <>
            <div className='bg-dblack-800 col-span-4 row-span-2 rounded p-4'>
                <div className='flex flex-col border-b-2 px-1 pb-2 
                border-b-dblack-300 gap-3 rounded-b-lg'>
                    <h2 className='text-xl text-dcyan-600 font-bold py-2 mb-2'>Details</h2>
                    <Detail title='account no' value={member.id}/>
                    <Detail title='name' value={member.name}/>
                    <Detail title='amount' value={member.amount}/>
                    <Detail title='duration' value={member.duration}/>
                    <Detail title='paid' value={member.paid? 'Yes': 'No'} />
                    <Detail title='time' value='12:00pm' />


                </div>
            </div>
        </>
    )
}

export default Details

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