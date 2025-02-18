import React from 'react'
import StatCards from './StatCards'
import TransContent from './LoanContent'
import TransactionTypeForm from './TransactionTypeForm'
import TransTypes from './TransTypes'
import LoanContent from './LoanContent'

function Loans() {
    return (
        <>
            <div className='px-4 flex-r1 grid gap-3 grid-cols-12 
        grid-rows-[auto_repeat(4,minmax(0,1fr))]'>
                <StatCards />
                <LoanContent />
                {/* <TransactionTypeForm /> */}
                {/* <TransTypes /> */}
            </div>
        </>
    )
}

export default Loans
