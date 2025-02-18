import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

function MemberTable({members}) {

    return (
        <>
        <table className='w-full mt-2 table-auto border-separate border-spacing-y-2 '>
            <thead className='uppercase text-sm text-left font-normal bg-dblack-600  text-slate-400'>
                <tr >
                    <th className='py-2 pl-1'>Name</th>
                    <th className='py-2 pl-1'>DOB</th>
                    <th className='py-2 pl-1'>Gender</th>
                    <th className='py-2 pl-1'>Membership</th>
                </tr>
            </thead>
            <tbody>
                {
                    members.map(member => <MemberRow 
                        since={member.created_on}
                        dob={member.date_of_birth}
                        first_name={member.first_name}
                        last_name={member.last_name}
                        other_names={member.other_names}
                        gender={member.sex}
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




const MemberRow = ({since,first_name, last_name, other_names,gender,dob,id}) => {
    const navigate = useNavigate()
    const handleSelect = (id) => navigate(`/team/${id}`)

    const compareDates = (inputDate) => {
        const today = moment();
        const date = moment(inputDate);
      
        // Ensure the input date is valid
        if (!date.isValid()) {
          throw new Error("Invalid date");
        }
      
        // Get the difference in years, months, and days
        const years = today.diff(date, 'years');
        const months = today.diff(date, 'months');
        const days = today.diff(date, 'days');
      
        // Return the most appropriate unit based on hierarchy
        if (years > 0) {
          return `${years} year${years > 1 ? 's' : ''} ago`;
        } else if (months > 0) {
          return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (days > 0) {
          return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
          return "Today";
        }
      }
   
    return (
        <>
            <tr className='text-dcyan-300 text-sm 
            even:bg-dblack-800 hover:cursor-pointer even:hover:bg-transparent odd:hover:bg-dblack-700
            capitalize' onClick={() => handleSelect(id)}>
                <td className='pl-1.5 py-2'>{first_name} {last_name} {other_names? other_names : ''}</td>
                <td className='pl-1.5'>{moment(dob).format('Do-MMM-YYYY')}</td>
                <td className='pl-1.5'>{gender}</td>
                <td className='pl-1.5'>{compareDates(since)}</td>
            </tr>
        </>
    )
}
