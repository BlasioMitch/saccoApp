import React from 'react'
import { useNavigate } from 'react-router-dom'

function MemberTable({members}) {

    return (
        <>
        <table className='w-full mt-2 table-auto border-separate border-spacing-y-2 '>
            <thead className='uppercase text-sm text-left font-normal bg-dblack-600  text-slate-400'>
                <tr >
                    <th className='py-2 pl-1'>aavata</th>
                    <th className='py-2 pl-1'>name</th>
                    <th className='py-2 pl-1'>duration</th>
                    <th className='py-2 pl-1'>Paid</th>
                </tr>
            </thead>
            <tbody>
                {
                    members.map(member => <MemberRow 
                        duration={member.duration}
                        amount={member.amount}
                        name={member.name}
                        paid={member.paid}
                        id={member.id}
                        key={member.id}
                            />)
                }
            </tbody>
        </table>
        </>        
    )
     
}

export default MemberTable




const MemberRow = ({duration,name,amount,paid,id}) => {
    const navigate = useNavigate()
    const handleSelect = (id) => navigate(`/team/${id}`)
   
    return (
        <>
            <tr key={id} className='text-dcyan-300 text-sm 
            even:bg-dblack-800 hover:cursor-pointer even:hover:bg-transparent odd:hover:bg-dblack-700
            capitalize' onClick={() => handleSelect(id)}>
                <td className='pl-1.5 py-2'>{name}</td>
                <td className='pl-1.5'>{amount}</td>
                <td className='pl-1.5'>{duration}</td>
                <td className='pl-1.5'>{paid}</td>
            </tr>
        </>
    )
}
