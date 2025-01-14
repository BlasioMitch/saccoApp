import React from 'react'
import {  FiPlus } from 'react-icons/fi'
import { HiPencil, HiTrash } from 'react-icons/hi2'
import { NavLink, useNavigate } from 'react-router-dom'

function TransTypes() {
    const trans = [{id:1,name:'deposit'},{id:2,name:'loan payment'}]
    const navigate = useNavigate()
    const handleClick = () =>{
        navigate('add-type/')
    }
    return (
        <>
        <div className='bg-dblack-900 col-span-4 row-span-2 flex flex-col gap-1 '>
            <p className='capitalize text-lg p-2 flex items-center justify-between'>transasction types
                <span>
                    <FiPlus onClick={handleClick} className='hover:bg-dblack-400 size-6 bg-dblack-300 rounded hover:cursor-pointer' />
                </span>
            </p>
            {
                trans.map(t => <TransType id={t.id} name={t.name} />)
            }
        </div>
        </>
    )
}

export default TransTypes

const TransType = ({id,name}) => {

    return(
        <>
            <NavLink to={`/${id}`} className={'capitalize flex items-center justify-between p-1 text-lg even:bg-dblack-700'}>
            {name}
            <span className='flex gap-2 items-center'>
                <HiPencil/> 
                <HiTrash /> 
                </span>
            </NavLink>
        </>
    )
}