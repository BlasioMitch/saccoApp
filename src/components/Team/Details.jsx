import React from 'react'
import { useOutletContext } from 'react-router-dom'
import moment from 'moment'

function Details() {
    const member = useOutletContext()

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
            <div className='bg-dblack-800 col-span-4 row-span-2 rounded p-4'>
                <div className='flex flex-col border-b-2 px-1 pb-2 
                border-b-dblack-300 gap-3 rounded-b-lg'>
                    <h2 className='text-xl text-dcyan-600 font-bold py-2 mb-2'>Details</h2>
                    {/* <Detail title='account no' value={member.id}/> */}
                    <Detail title='name' value={`${member.first_name} ${member.last_name} ${member.other_names ? member.other_names : ''}`}/>
                    <Detail title='gender' value={member.sex =='F'? 'Female':'Male'}/>
                    <Detail title='contact' value={member.contact}/>
                    <Detail title='email' value={member.email} />
                    <Detail title='membership' value={compareDates(member.created_on)} />


                </div>
            </div>
        </>
    )
}

export default Details

const Detail = ({title, value}) => {

    return(
        <>
            <div className='flex  py-2 even:bg-dblack-400'>
                <p className='flex-1 px-2 uppercase text-sm font-medium
                 text-dcyan-900'>{title}</p>
                <p className='flex-1 capitalize text-sm'>{value}</p>
            </div>
        </>
    )
}