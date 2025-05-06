import React from 'react'
import StatCards from '../../components/ui/StatCards'
import Content from '../../components/ui/Content'
import QuickActions from '../../components/ui/QuickActions'

function Grid() {
    return (
        <div className='px-4 flex-r1 grid gap-3 grid-cols-12 grid-rows-[auto_repeat(2,minmax(0,1fr))]'>
            <StatCards />
            <Content />
            <QuickActions />

        </div>
    )
}

export default Grid
