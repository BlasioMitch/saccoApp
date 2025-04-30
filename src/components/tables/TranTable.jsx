import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

function TranTable({rowsData}) {
    const {transactions, error, status} = useSelector(state => state.transactions)
    // const sorted = transactions.sort((a,b)=> b.created_on - a.created_on)
    
    return (
        <>
        <table className='w-full mt-2 table-auto border-separate border-spacing-y-2 '>
            <thead className='uppercase text-sm text-left font-normal bg-dblack-600  text-slate-400'>
                <tr >
                    <th className='py-2 pl-1'>type</th>
                    <th className='py-2 pl-1'>name</th>
                    <th className='py-2 pl-1'>amount</th>
                    <th className='py-2 pl-1'>date</th>
                    <th className='py-2 pl-1'>time</th>

                </tr>

            </thead>
            <tbody>
                {
                    transactions.map(r => <TranRow 
                        type={r.type}
                        account_no={r.account_no}
                        amount={r.amount}
                        date={r.created_on}
                        key={r.id}
                         />)
                }
            </tbody>
        </table>
        </>        
    )
}

export default TranTable

const TranRow = ({type,account_no,amount,date}) => {
    return (
        <>
            <tr  className='text-dcyan-300 text-sm 
            even:bg-dblack-800 hover:cursor-pointer even:hover:bg-transparent odd:hover:bg-dblack-700
            capitalize'>
                <td className='pl-1.5 py-1'>{type}</td>
                <td className='pl-1.5 py-1'>{account_no}</td>
                <td className='pl-1.5 py-1'>{amount}</td>
                <td className='pl-1.5 py-1'>{moment(date).format('DD-MMM-YYYY')}</td>
                <td className='pl-1.5 py-1'>{moment(date).format('HH:MM')}</td>
            </tr>
        </>
    )
}