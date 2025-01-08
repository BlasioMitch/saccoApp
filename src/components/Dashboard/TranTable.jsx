import React from 'react'

function TranTable({rowsData}) {
    return (
        <>
        <table className='w-full mt-2 table-auto border-separate border-spacing-y-2 '>
            <thead className='uppercase text-sm text-left font-normal bg-dblack-600  text-slate-400'>
                <tr >
                    <th className='py-2 pl-1'>type</th>
                    <th className='py-2 pl-1'>name</th>
                    <th className='py-2 pl-1'>amount</th>
                    <th className='py-2 pl-1'>date</th>
                </tr>
            </thead>
            <tbody>
                {
                    rowsData.map(r => <TranRow 
                        type={r.type}
                        name={r.name}
                        amount={r.amount}
                        date={r.date}
                        id={r.id}
                         />)
                }
            </tbody>
        </table>
        </>        
    )
}

export default TranTable

const TranRow = ({type,name,amount,date,id}) => {
    return (
        <>
            <tr key={id} className='text-dcyan-300 text-sm 
            even:bg-dblack-800 hover:cursor-pointer even:hover:bg-transparent odd:hover:bg-dblack-700
            capitalize'>
                <td className='pl-1.5 py-1'>{type}</td>
                <td className='pl-1.5 py-1'>{name}</td>
                <td className='pl-1.5 py-1'>{amount}</td>
                <td className='pl-1.5 py-1'>{date}</td>
            </tr>
        </>
    )
}