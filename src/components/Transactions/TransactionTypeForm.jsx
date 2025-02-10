import React,{useState} from 'react'
import { useDispatch } from 'react-redux'
import { createTransactiontype } from '../../reducers/transactiontypesReducer'

function TransactionTypeForm() {
    const [formData, setFormdata] = useState({name:'',description:''})

    const handleChange = (e) => setFormdata({...formData,[e.target.name]:e.target.value})

    const dispatch = useDispatch()


    const handleCreate = (e) => {
        e.preventDefault()
        dispatch(createTransactiontype({...formData,created_by:2}))
            .then(r => 
                setFormdata({name:'',description:''})
            )
            .catch(err => console.log('Error: ', err))
    }
    return (
        <>
        <div className='bg-dblack-900 col-span-4 row-span-2 rounded-md hover:border'>
            <p className='text-center py-2 text-lg'>Add Transaction type</p>
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
            value={formData.description}
        ></textarea>
            <button onClick={handleCreate} className='bg-dblack-500 rounded-md px-6 py-3 text-gray-200 hover:bg-dcyan-600 hover:text-dblack-800 transition duration-300'>
                Add Transaction</button>
    </form>  
        </div></>
    )
}

export default TransactionTypeForm
