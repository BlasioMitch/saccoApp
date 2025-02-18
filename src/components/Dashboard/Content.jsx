import React from 'react'
import { FiFilter } from 'react-icons/fi'
import TranTable from './TranTable'



function Content() {
    return (
        <>
        <div className='col-span-8 row-span-2 p-4 rounded bg-dblack-900'>
            <div className='flex items-center justify-between border-b pb-2 mt-2 mb-4 
                '>
                <p className='text-dcyan-300 text-lg capitalize'>recent transactions</p>
                <FiFilter className=' hover:stroke-dcyan-700 ' />
            </div>
            <TranTable />
        </div>
        </>
    )
}

export default Content
