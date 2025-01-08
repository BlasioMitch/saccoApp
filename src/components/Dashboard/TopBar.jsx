import React from 'react'
import { FiCalendar,FiBell } from 'react-icons/fi'
import Search from '../Sidebar/Search'

function TopBar({expa}) {
    return (
        <>
            <div className='border-b px-4 mb-4 mt-2 pb-4 border-stone-200'>
                <div className='flex items-center justify-between p-0.5'>
                    <div>
                        <span className='text-sm font-bold  text-dcyan-300 block'>Good morning, Mitchell</span>
                        <span className='text-xs block text-dcyan-400'>Tuesday, 26 Nov 2024</span>
                    </div>
                    {
                        !expa
                        ?<Search />
                        :''
                    }

                    <div className='flex text-sm items-center gap-1 bg-dblack-900
                    transition-colors hover:bg-slate-400  rounded hover:cursor-pointer hover:stroke-black
                    '>
                        <div className=' mx-2 p-1 hover:stroke-dblack-900'>
                            <FiBell className=''/>
                        </div>
                        <span className='text-dblack-800 text-xs p-2 bg-dcyan-800 rounded hover:text-dcyan-400 hover:bg-dblack-600'>2 New</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopBar
