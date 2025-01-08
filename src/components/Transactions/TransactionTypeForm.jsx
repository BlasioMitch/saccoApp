import React from 'react'

function TransactionTypeForm() {
    return (
        <>
        <div className='bg-dblack-900 col-span-4 row-span-2 rounded-md hover:border'>
            <p className='text-center py-2 text-lg'>Add Transaction type</p>
        <form className='flex flex-col gap-3 p-2 items-center'>
        {/* Input for transaction type */}
        <input 
            type="text" 
            name="transaction_type" 
            id="transaction_type"  
            placeholder='Transaction Type' 
            className='bg-dblack-600 rounded-md py-3 px-2 w-full max-w-md'
        />
        
        {/* Textarea for description */}
        <textarea 
            name="description" 
            id="description"  
            placeholder='Description...' 
            className='bg-dblack-600 rounded-md py-3 px-2 w-full max-w-md h-36'
        ></textarea>
            <button className='bg-dblack-500 rounded-md px-6 py-3 text-gray-200 hover:bg-dcyan-600 hover:text-dblack-800 transition duration-300'>
                Add Transaction</button>
    </form>  
        </div></>
    )
}

export default TransactionTypeForm
