import React from 'react'
import StatCards from './StatCards'
import Content from './Content'
import QuickActions from './QuickActions'
import Activity from './Activity'

function Grid() {
    return (
        <div className='px-4 flex-r1 grid gap-3 grid-cols-12 grid-rows-[auto_repeat(2,minmax(0,1fr))]'>
            <StatCards />
            <Content />
            <QuickActions />
            <Activity />

        </div>
    )
}

export default Grid
