import React from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

function StatCards() {
    return (
        <>
        <Card titleText='Members' cardText='26'/>
        <Card titleText='Online members' cardText='6'/>
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
                <h1 className='text-slate-100 text-lg capitalize '>
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