import React from 'react'
import StatCards from './StatCards'
import TransContent from './TransContent'
import TransactionTypeForm from './TransactionTypeForm'
import TransTypes from './TransTypes'

function Transactions() {
    return (
        <>
            <div className='px-4 flex-r1 grid gap-3 grid-cols-12 
        grid-rows-[auto_repeat(4,minmax(0,1fr))] overflow-y-auto'>
                <StatCards />
                <TransContent />
                {/* <TransactionTypeForm /> */}
                {/* <TransTypes /> */}
            </div>
        </>
    )
}

export default Transactions
