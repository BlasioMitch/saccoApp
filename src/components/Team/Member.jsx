import React ,{ useEffect, useState} from 'react'
import MemberTable from './MemberTable'
import { FiFilter, FiUserPlus } from 'react-icons/fi'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../../reducers/userReducer'


function Member() {
    const dispatch = useDispatch()

    const {status, error, users} = useSelector(state => state.users)

    useEffect(() =>{
        if (status === 'idle'){
            dispatch(fetchUsers())
        }
    },[status, dispatch])

    const members = users
        
    const navigate = useNavigate()
    const openForm = () => {
        navigate('add/')
    }
    const {id} = useParams()

    const selectedMember = id
        ? members.find(member => member.id == id)
        : null

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
