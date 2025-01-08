import React from 'react'
import { FiBarChart2, FiBook, FiBookOpen, FiCornerRightDown, FiCreditCard, FiUserPlus } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

function QuickActions() {
    return (
        <>
            <div className='col-span-4 bg-dblack-900 p-4 flex flex-col gap-3 hover:border hover:border-dblack-500 rounded '>
                <div className='flex items-center justify-between border-b pb-2 my-2'>

                <h1 className='text-dcyan-300 text-lg capitalize'>
                    quick actions
                </h1>
                <FiCornerRightDown className='mr-3'/>
                </div>

                <div className='flex justify-between items-center 
                p-2 rounded bg-dblack-800 text-dcyan-700 
                hover:cursor-pointer hover:text-dcyan-500 hover:bg-dblack-700'>
                    <NavLink to={'../team/add'} className='text-sm capitalize'>Create User</NavLink>
                    <FiUserPlus />
                </div>
                <div className='flex justify-between items-center 
                p-2 rounded bg-dblack-800 text-dcyan-700 
                hover:cursor-pointer hover:text-dcyan-500 hover:bg-dblack-700'>
                    <NavLink className='text-sm capitalize'>create loan</NavLink>
                    <FiCreditCard />
                </div>
                <div className='flex justify-between items-center 
                p-2 rounded bg-dblack-800 text-dcyan-700 
                hover:cursor-pointer hover:text-dcyan-500 hover:bg-dblack-700'>
                    <NavLink className='text-sm capitalize'>create transaction</NavLink>
                    <FiBookOpen />
                </div>
                <div className='flex justify-between items-center 
                p-2 rounded bg-dblack-800 text-dcyan-700 
                hover:cursor-pointer hover:text-dcyan-500 hover:bg-dblack-700'>
                    <NavLink className='text-sm capitalize'>create report</NavLink>
                    <FiBarChart2 />
                </div>
                
            </div>
        </>
    )
}

export default QuickActions
