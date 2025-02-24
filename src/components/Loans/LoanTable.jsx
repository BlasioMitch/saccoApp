import React from 'react'
import { useNavigate } from 'react-router-dom'

function LoanTable({loans}) {
    // const loans = [
    //     {by:'mitchell nsimbi',id:1,account:234,type:'Loan Disb',amount:2000000,trndate:'12/9/2004',status:'success'},
    //     {by:'mitchell nsimbi',id:2,account:234,type:'Loan Payt',amount:160000,trndate:'23/8/2014',status:'failed'},
    //     {by:'mitchell nsimbi',id:3,account:234,type:'Membership Fee',amount:20000,trndate:'12/4/2024',status:'pending'}

    // ]
    return (
        <>
        <table className='min-w-full mt-2  table-auto border-separate border-spacing-y-2' >
            <thead className='uppercase text-sm text-left font-normal bg-dblack-600  text-slate-400'>
                <tr>
                    <th className='py-2 px-2 whitespace-nowrap sticky left-0'>Loan ID</th>
                    <th className='py-2 px-2 whitespace-nowrap'>name</th>
                    <th className='py-2 px-2 whitespace-nowrap'>Amount</th>
                    <th className='py-2 px-2 whitespace-nowrap'>interest</th>
                    <th className='py-2 px-2 whitespace-nowrap'>balance</th>
                    <th className='py-2 px-2 whitespace-nowrap'>Status</th>
                    <th className='py-2 px-2 whitespace-nowrap'>award Date</th>
                    <th className='py-2 px-2 whitespace-nowrap'>installments</th>
                    <th className='py-2 px-2 whitespace-nowrap'>closure date</th>
                    <th className='py-2 px-2 whitespace-nowrap'>Account</th>
                    <th className='py-2 px-2 whitespace-nowrap'>History</th>

                </tr>
            </thead>
            <tbody>
                {
                    loans.map(loan => <LoanRow 
                        id={loan.id} account={loan.account} closure_date={loan.closure_date}
                        amount={loan.amount} name={loan.name} award_date={loan.award_date}
                        status={loan.status}  balance={loan.balance} installments={loan.installments}
                        history={loan.history} interest={loan.interest}
                    />)
                }
            </tbody>
        </table>
        </>
    )
}

export default LoanTable

const LoanRow = ({id, account,amount,status, name, interest, installments, balance,award_date, closure_date,history}) => {
    const navigate = useNavigate()
    const handleSelect = (id) => navigate(`/loans/${id}`)

    return(
        <>
            <tr key={id} className='text-dcyan-300 text-sm 
                even:bg-dblack-800 hover:cursor-pointer even:hover:bg-transparent odd:hover:bg-dblack-700
                capitalize' onClick={() => handleSelect(id)}>
                <td className='pl-1.5 py-2 sticky left-0 whitespace-nowrap'>{id}</td>
                <td className='pl-1.5 whitespace-nowrap'>{name}</td>
                <td className='pl-1.5 whitespace-nowrap'>{amount}</td>
                <td className='pl-1.5 whitespace-nowrap'>{interest}</td>
                <td className='pl-1.5 whitespace-nowrap'>{balance}</td>
                <td className='pl-1.5 whitespace-nowrap'>{status}</td>
                <td className='pl-1.5 whitespace-nowrap'>{award_date}</td>
                <td className='pl-1.5 whitespace-nowrap'>{installments}</td>
                <td className='pl-1.5 whitespace-nowrap'>{closure_date}</td>
                <td className='pl-1.5 whitespace-nowrap'>{account}</td>
                <td className='pl-1.5 whitespace-nowrap'>{history}</td>

            </tr>
        </>
    )
}