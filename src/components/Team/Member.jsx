import React from 'react'
import MemberTable from './MemberTable'
import { FiFilter, FiUserPlus } from 'react-icons/fi'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

function Member() {
    const members = [
        {
            id:1,
            name:'mitchell blasio',
            amount:300000,
            duration:'2 years',
            paid:true
            
        },
        {
            id:2,
            name:'Joan Nsimbi',
            amount:4000000,
            duration:'4 years',
            paid:false
        }
    ]
    const navigate = useNavigate()
    const openForm = () => {
        navigate('add/')
    }
    const {id} = useParams()
    console.log(id,' is Id')
    const selectedMember = id
        ? members.find(member => member.id == id)
        : null
    console.log(selectedMember, ' smmmm')
    return (
        <>
        <div className='col-span-8 row-span-2 p-4 rounded bg-dblack-900'>
            <div className='flex items-center justify-between border-b pb-2 mt-2 mb-4 
                '>
                <p className='text-dcyan-300 text-lg capitalize'>Members</p>
                {/* <FiFilter className=' hover:stroke-dcyan-700 ' /> */}
                <button onClick={openForm} className='flex items-center gap-2 border rounded p-2 hover:bg-dblack-700'>
                    <FiUserPlus />                    Add member</button>
            </div>
            <MemberTable members={members}/>
        </div>
        {/* To render details, form, cmponents */}
        <Outlet context={selectedMember}/>
        </>
    )
}    

export default Member
