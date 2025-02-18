import React,{ useState} from 'react'
import {  FiPlus } from 'react-icons/fi'
import { HiPencil, HiTrash } from 'react-icons/hi2'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTransactiontype, fetchtransactiontypes, createTransactiontype, updateTransactiontype } from '../../reducers/transactiontypesReducer'
import { MdClose } from 'react-icons/md'

const TransTypes = ({types}) => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormdata] = useState({id:'',name:'',description:''})
    const [isOpen,setIsOpen] = useState(false)

    const handleOpen = (transType = {id:'',name:'',description:''}) => {
        // setFormdata({
        //     id:transType.id,
        //     name:transType.name,
        //     description:transType.description
        // })
        setFormdata(transType)
        setIsOpen(true)
    }

    const handleClose = () => setIsOpen(false)
    
    const handleChange = (e) => setFormdata({...formData,[e.target.name]:e.target.value})

    const handleCreate = async (e) => {
        e.preventDefault()
        const {id, ...dataWithoutId} = formData
        try{
            if(!formData.id){
                await dispatch(createTransactiontype({...formData,created_by:2}))
                setFormdata({name:'',description:''})
                setIsOpen(false)
            }else {
                await dispatch(updateTransactiontype({id:formData.id,objData:{...formData}})).unwrap()
                setFormdata({name:'',description:'',id:''})
                setIsOpen(false)
            }
        } catch(err) {
            alert(`Error: ${err}`)
        }
    }
    // TODO: Need to handle editing


    return (
        <>
        <div className='bg-dblack-900 col-span-4 row-span-2 flex flex-col gap-1 overflow-y-auto'>
            <p className='capitalize text-lg p-2 mb-3 border-b-[1px] flex items-center justify-between sticky top-0'>transasction types
                <span>
                    <FiPlus onClick={() => handleOpen()} className='hover:bg-dblack-400 size-6 bg-dblack-300 rounded hover:cursor-pointer' />
                </span>
            </p>
            {
                types.map(t => <TransType id={t.id} key={t.id} name={t.name} HandleEdit={() => handleOpen(t)}/>)
            }
            <div className={`fixed top-0 right-0 h-full w-96 bg-dblack-700 shadow-lg transition-transform duration-300 ease-in-out
                     transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-left ring-dcyan-900`}>
                <div className='p-5'>
                    <MdClose onClick={handleClose} className='absolute right-3 hover:cursor-pointer size-6' />

                    <div className='bg-dblack-900 col-span-4 row-span-2 mt-16 rounded-md hover:border'>
                        <p className='text-center py-2 text-lg'>{formData.id ? 'Edit Transaction Type':'Create trasaction type'}</p>
                        <form className='flex flex-col gap-3 p-2 items-center'>
                        {/* Input for transaction type */}
                            <input 
                                type="text" 
                                name="name" 
                                id="transaction_type"  
                                placeholder='Transaction Type' 
                                className='bg-dblack-600 rounded-md py-3 px-2 w-full max-w-md'
                                onChange={handleChange}
                                value={formData.name}
                                />
                            
                            {/* Textarea for description */}
                            <textarea 
                                name="description" 
                                id="description"  
                                placeholder='Description...' 
                                className='bg-dblack-600 rounded-md py-3 px-2 w-full max-w-md h-36'
                                onChange={handleChange}
                                value={formData.description}>
                            </textarea>
                            <button onClick={handleCreate} className='bg-dblack-500 rounded-md px-6 py-3 text-gray-200 hover:bg-dcyan-600 hover:text-dblack-800 transition duration-300'>
                                {formData.id ? 'Save' : 'Create'}</button>
                        </form>  
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}

export default TransTypes

const TransType = ({id,name, HandleEdit}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    // const HandleEdit = (id) => {
    //     console.log(id,' Edit button clicked')
    //     navigate(`/transactions/types/edit/${id}/`)
    // }

    const HandleDelete = (id) => {
        console.log('Delete button clicked')
        dispatch(deleteTransactiontype(id))
            .then(() => dispatch(fetchtransactiontypes())) //TODO To remove find efficient way
    }


    return(
        <>
        <div className='flex items-center justify-between p-1 even:bg-dblack-700'>
            <NavLink to={`/transactions/types/${id}`} className={'capitalize  text-lg'}>
            {name}
            </NavLink>
            <div className='flex gap-3 items-cente'>
                <HiPencil onClick={HandleEdit} className='size-5 hover:cursor-pointer'/> 
                <HiTrash onClick={()=>HandleDelete(id)} className='size-5 hover:cursor-pointer'/> 
            </div>
        </div>
        </>
    )
}