import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

function TransactionTable({transactions}) {
    return (
        <>
        <table className='min-w-full mt-2  table-auto border-separate border-spacing-y-2' >
            <thead className='uppercase text-sm text-left font-normal bg-dblack-600  text-slate-400'>
                <tr>
                    <th className='py-2 px-2 whitespace-nowrap sticky left-0'>TRN ID</th>
                    <th className='py-2 px-2 whitespace-nowrap'>Account</th>
                    <th className='py-2 px-2 whitespace-nowrap'>TRN Type</th>
                    <th className='py-2 px-2 whitespace-nowrap'>Amount</th>
                    <th className='py-2 px-2 whitespace-nowrap'>Status</th>
                    <th className='py-2 px-2 whitespace-nowrap'>TRN Date</th>
                    <th className='py-2 px-2 whitespace-nowrap'>by</th>

                </tr>
            </thead>
            <tbody>
                {
                    transactions.map(transaction => <TransactionRow 
                        id={transaction.id} account={transaction.account_no}
                        amount={transaction.amount} trn_date={transaction.created_on}
                        status={transaction.status} type={transaction.type} by={transaction.created_by}
                        key={transaction.id}
                    />)
                }
            </tbody>
        </table>
        </>
    )
}

export default TransactionTable

const TransactionRow = ({id, account,type,amount,status, trn_date,by}) => {
    const navigate = useNavigate()
    const handleSelect = (id) => navigate(`/transactions/${id}`)

    return(
        <>
            <tr className='text-dcyan-300 text-sm 
                even:bg-dblack-800 hover:cursor-pointer even:hover:bg-transparent odd:hover:bg-dblack-700
                capitalize' onClick={() => handleSelect(id)}>
                <td className='pl-1.5 py-2 sticky left-0 whitespace-nowrap'>{id}</td>
                <td className='pl-1.5 whitespace-nowrap'>{account}</td>
                <td className='pl-1.5 whitespace-nowrap'>{type}</td>
                <td className='pl-1.5 whitespace-nowrap'>{amount}</td>
                <td className='pl-1.5 whitespace-nowrap'>{status}</td>
                <td className='pl-1.5 whitespace-nowrap'>{moment(trn_date).format('DD-MMM-YYYY')}</td>
                <td className='pl-1.5 whitespace-nowrap text-center'>{by}</td>
            </tr>
        </>
    )
}