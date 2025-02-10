import React from 'react'
import {  FiPlus } from 'react-icons/fi'
import { HiPencil, HiTrash } from 'react-icons/hi2'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTransactiontype, fetchtransactiontypes } from '../../reducers/transactiontypesReducer'
const TransTypes = ({types}) => {
    const trans = [{id:1,name:'deposit'},{id:2,name:'loan payment'}]
    const dispatch = useDispatch()
    
    // const {error, transactiontypes, status} = useSelector(state => state.transactiontypes)

    const navigate = useNavigate()
    const handleClick = () =>{
        navigate('add-type/')
    }

    const HandleDelete = (id) => {
        dispatch(deleteTransactiontype(id))
            .then(() => dispatch(fetchtransactiontypes())) //TODO To remove find efficient way
    }
    return (
        <>
        <div className='bg-dblack-900 col-span-4 row-span-2 flex flex-col gap-1 overflow-y-auto'>
            <p className='capitalize text-lg p-2 mb-3 border-b-[1px] flex items-center justify-between sticky top-0'>transasction types
                <span>
                    <FiPlus onClick={handleClick} className='hover:bg-dblack-400 size-6 bg-dblack-300 rounded hover:cursor-pointer' />
                </span>
            </p>
            {
                types.map(t => <TransType id={t.id} key={t.id} name={t.name} HandleDelete={() =>HandleDelete(t.id)}/>)
            }
        </div>
        </>
    )
}

export default TransTypes

const TransType = ({id,name, HandleDelete}) => {
    
    // const HandleDelete =()=>{
    //     console.log('Delete button clicked')
    // }

    return(
        <>
        <div className='flex items-center justify-between p-1 even:bg-dblack-700'>
            <NavLink to={`/transactions/types/${id}`} className={'capitalize  text-lg'}>
            {name}
            </NavLink>
            <div className='flex gap-3 items-cente'>
                <HiPencil className='size-5 hover:cursor-pointer'/> 
                <HiTrash onClick={HandleDelete} className='size-5 hover:cursor-pointer'/> 
            </div>
        </div>
        </>
    )
}