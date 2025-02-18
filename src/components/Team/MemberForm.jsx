import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createUser } from '../../reducers/userReducer'


function MemberForm() {
    const [formData,setformData] = useState({
        first_name:'',
        last_name:'',
        other_names:'',
        date_of_birth:'',
        sex:'',
        contact:'',
        email:''
    })
    const dispatch = useDispatch()

    const handle_change = (e) => setformData({...formData,[e.target.name]:e.target.value})

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(formData,' All data collected')
        dispatch(createUser(formData))
            .then(response => 
                setformData({
                    first_name:'',
                    last_name:'',
                    other_names:'',
                    date_of_birth:'',
                    sex:'',
                    contact:'',
                    email:''
            
                })
            ).catch(error => console.log('Error: ', error))
    }

    return (
        <div className='bg-dblack-900 col-span-4 row-span-2 p-2 rounded-lg'>
            <p className='text-center  text-3xl text-dcyan-700 my-3'>Add Member</p>
            <form action="" className='flex flex-col gap-3 items-center'>
                <input type="text" name="first_name" id=""  placeholder='First Name' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md ' value={formData.first_name} onChange={handle_change}/>
                <input type="text" name="last_name" id="" placeholder='Last Name' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md' value={formData.last_name} onChange={handle_change}/>
                <input type="text" name="other_names" id=""  placeholder='Other Name' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md ' value={formData.other_names} onChange={handle_change}/>
                <div className='flex flex-col items-start w-full max-w-md'>
                    <p className='text-gray-300'>Gender:</p>
                    <div className='flex items-center gap-4'>
                        <label className='flex items-center gap-2'>
                            <input 
                                type="radio" 
                                name="sex" 
                                value="M" 
                                checked={formData.sex === 'M'}
                                onChange={handle_change}
                                className='accent-dcyan-700'
                            />
                            <span className='text-gray-300'>Male</span>
                        </label>
                        <label className='flex items-center gap-2'>
                            <input 
                                type="radio" 
                                name="sex" 
                                value="F" 
                                checked={formData.sex === 'F'}
                                onChange={handle_change}
                                className='accent-dcyan-700'
                            />
                            <span className='text-gray-300'>Female</span>
                        </label>
                    
                    </div>
                </div>
                <input type="date" name="date_of_birth" id="" placeholder='Date of Birth' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md' value={formData.date_of_birth} onChange={handle_change}/>
                <input type="text" name="contact" id=""  placeholder='Contact' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md ' value={formData.contact} onChange={handle_change}/>
                <input type="email" name="email" id="" placeholder='Email' 
                className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md' value={formData.email} onChange={handle_change}/>
                <button onClick={handleSubmit} className='bg-dblack-300 rounded-md px-6 py-3 text-gray-200 hover:bg-dcyan-700
                 hover:text-dblack-800 transition duration-300'>
                Add member</button>
            </form>
        </div>
    )
}

export default MemberForm
