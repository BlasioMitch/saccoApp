import React from 'react'
import StatCards from './StatCards'
import Member from './Member'

function Team() {
    return (
        <>
        <div className='px-4 flex-r1 grid gap-3 grid-cols-12 
        grid-rows-[auto_repeat(2,minmax(0,1fr))]'>
        {/* stats about members */}
        <StatCards />
        {/* form to create team member */}
        {/* table to show members */}
        <Member />
        {/* <MemberForm /> */}
        

        </div>
        </>
    )
}

export default Team
