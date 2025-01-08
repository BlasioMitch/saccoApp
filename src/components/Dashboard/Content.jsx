import React from 'react'
import { FiFilter } from 'react-icons/fi'
import TranTable from './TranTable'

const data = [
    {
        id:1,
        name:'mitchell blasio',
        amount:300000,
        type:'Loan',
        date:'23/12/2024'
    },
    {
        id:1,
        name:'Joan Nsimbi',
        amount:4000000,
        type:'deposit',
        date:'23/12/2025'
    }
]

function Content() {
    return (
        <>
        <div className='col-span-8 row-span-2 p-4 rounded bg-dblack-900'>
            <div className='flex items-center justify-between border-b pb-2 mt-2 mb-4 
                '>
                <p className='text-dcyan-300 text-lg capitalize'>recent transactions</p>
                <FiFilter className=' hover:stroke-dcyan-700 ' />
            </div>
            <TranTable rowsData={data}/>
        </div>
        </>
    )
}

export default Content
