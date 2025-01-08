import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { HiPencil, HiTrash } from 'react-icons/hi2'
import { MdOutlineDelete } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { NavLink } from 'react-router-dom'

function TransTypes() {
    const trans = [{id:1,name:'deposit'},{id:2,name:'loan payment'}]
    return (
        <>
        <div className='bg-dblack-900 col-span-4 row-span-2 flex flex-col gap-1 '>
            <p className='capitalize text-lg p-2'>transasction types</p>
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