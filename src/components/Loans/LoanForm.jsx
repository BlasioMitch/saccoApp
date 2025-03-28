import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux';
import { createLoan } from '../../reducers/loansReducer';


const LoanForm = ({loanApplication, onClose}) => {
    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    const [formData, setFormData] = useState({
        amount_approved:'',
        interest_rate:'',
        repayment_period:1,
        start_date:today,
        loan_application:'',
        // completed_on:''
    })
    const [custName, setCustName] = useState('')

    const dispatch = useDispatch()

    useEffect(() =>{
        setCustName(`${loanApplication?.account_details.owner.first_name} ${loanApplication.account_details.owner.last_name} ${loanApplication.account_details.owner.other_names}`)
        setFormData({...formData,
            ["amount_approved"]:loanApplication.amount_requested,
            ["interest_rate"]:10,
            ["loan_application"]:loanApplication.id,
        })
    },[dispatch])

    const handleChange = (e) => setFormData({...formData, [e.target.name]:e.target.value})
    
    const handleCreateLoan = (e) =>{
        const formattedDate = moment(formData.start_date).format('YYYY-MM-DD')
        const loanObj = {...formData,['start_date']:formattedDate}
        console.log('loan creation in process for ', {...formData,['start_date']:formattedDate})
        dispatch(createLoan(loanObj)).then(() => {
            console.log('Loan created');
            setCustName('');
            setFormData({
                amount_approved:'',
                interest_rate:'',
                repayment_period:1,
                start_date:today,
                loan_application:'',
                // completed_on:''
            });
            onClose();
        });
    }

    return (
        <>
        <div className='capitalize p-2 m-2 mt-9 flex flex-col'>
            <h2 className='p-2 m-2 font-bold text-2xl'>Loan Form</h2>
            <form className='p-3'>
                <div className='flex flex-col gap-1'>
                    <label className=' text-lg pl-3 font-semibold'>Name</label>
                    <input className='p-2 pl-4 rounded-lg disabled:bg-dblack-500 disabled:cursor-not-allowed' type="text" name="amount_approved" id="" disabled value={custName} onChange={(e)=>setCustName(e.target.value)}/>
                </div>

                <div className='flex flex-col gap-1'>
                    <label className=' text-lg pl-3 font-semibold'>Amount</label>
                    <input className='p-2 pl-4 rounded-lg disabled:bg-dblack-500 disabled:cursor-not-allowed' type="number" name="amount_approved" id="" disabled value={formData.amount_approved} onChange={handleChange}/>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-lg pl-3 font-semibold' htmlFor="">interest rate</label>
                    <input className='p-2 pl-4 rounded-lg disabled:bg-dblack-500 disabled:cursor-not-allowed' type="text" name="interest_rate" id="" disabled value={`${formData.interest_rate}%`} onChange={handleChange}/>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-lg pl-3 font-semibold' htmlFor="">Period</label>
                    <input className='p-2 pl-4 rounded-lg' type="number" name="repayment_period" id=""  value={Number(formData.repayment_period)} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-lg pl-3 font-semibold' htmlFor="">Start date</label>
                    <input className='p-2 pl-4 rounded-lg' type="date" name="start_date" id="" value={formData.start_date} onChange={handleChange} />
                </div>
            </form>
            <button onClick={()=>handleCreateLoan()} className='w-1/3 mt-5 border text-xl p-2 capitalize rounded-lg mx-auto hover:bg-dblack-600'>create</button>
        </div>
        
        </>
    )
}

export default LoanForm
