import React from 'react'

function MemberForm() {
    return (
        <div className='bg-dblack-900 col-span-4 row-span-2 p-2 rounded-lg'>
            <p className='text-center  text-3xl text-dcyan-700 my-3'>Add Member</p>
            <form action="" className='flex flex-col gap-3 items-center'>
                <input type="text" name="first_name" id=""  placeholder='First Name' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md '/>
                <input type="text" name="last_name" id="" placeholder='Last Name' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md'/>
                <input type="text" name="other_names" id=""  placeholder='Other Name' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md '/>
                <div className='flex flex-col items-start w-full max-w-md'>
                    <p className='text-gray-300'>Gender:</p>
                    <div className='flex items-center gap-4'>
                        <label className='flex items-center gap-2'>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="male" 
                                className='accent-dcyan-700'
                            />
                            <span className='text-gray-300'>Male</span>
                        </label>
                        <label className='flex items-center gap-2'>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="female" 
                                className='accent-dcyan-700'
                            />
                            <span className='text-gray-300'>Female</span>
                        </label>
                    
                    </div>
                </div>
                <input type="date" name="dob" id="" placeholder='Date of Birth' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md'/>
                <input type="text" name="contact" id=""  placeholder='Contact' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md '/>
                <input type="email" name="email" id="" placeholder='Email' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md'/>
                <button className='bg-dblack-300 rounded-md px-6 py-3 text-gray-200 hover:bg-dcyan-700 hover:text-dblack-800 transition duration-300'>
                Add member</button>
            </form>
        </div>
    )
}

export default MemberForm
