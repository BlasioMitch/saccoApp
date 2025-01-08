import React from 'react'
import { FiChevronDown } from 'react-icons/fi'

function StatCards() {
    return (
        <>
        <Card value={'5 Active members'} title={'Members'} />
        <Card value={'100,000,000'} title={'Balance'}/>
        <Card title={'Active Loans'} value={'45'}/>
        </>
    )
}

export default StatCards


const Card = ({title, value}) => {
    return (
    <>
     <div className='p-4 bg-dblack-900 col-span-4 rounded '>
        <div className='flex flex-col mb-0 justify-between gap-1 '>
            <div className='border-b-2 pb-2 my-2 border-dblack-600 flex flex-nowrap justify-between '>
                <h1 className='text-slate-100 text-lg capitalize '>
                    {title}
                </h1>
                {/* <p className='text-1xl font-semibold text-slate-400 flex items-center hover:text-dblack-50'>US Dollar 
                    <span className='pl-2'>
                        <FiChevronDown />
                        </span> </p> */}
            </div>
            <div>
                <h1 className='text-slate-400 text-base capitalize'>
                    {value}
                </h1>
                {/* <p className='tet-3xl font-semibold'>{value}</p> */}
            </div>

        </div>
     </div>
    </>)
}