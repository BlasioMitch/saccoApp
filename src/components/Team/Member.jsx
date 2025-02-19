import React ,{ useEffect, useState} from 'react'
import MemberTable from './MemberTable'
import { FiFilter, FiUserPlus } from 'react-icons/fi'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createUser, fetchUsers, patchUser } from '../../reducers/userReducer'
import { MdClose } from 'react-icons/md'


function Member() {
    
    const [formData,setFormData] = useState({
        id:'',
        first_name:'',
        last_name:'',
        other_names:'',
        date_of_birth:'',
        sex:'',
        contact:'',
        email:''
    })
    const [isOpen, setIsOpen] = useState(false)
    
    const dispatch = useDispatch()

    const {status, error, users} = useSelector(state => state.users)

    useEffect(() =>{
        if (status === 'idle'){
            dispatch(fetchUsers())
        }
    },[status, dispatch])

    const members = users

    const handleOpen = (member = {id:'',first_name:'',last_name:'',other_names:'',date_of_birth:'',sex:'',contact:'',email:''}) => {
        setFormData(member)
        setIsOpen(true)}
    
    const handleClose = () => setIsOpen(false)

    const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {id, ...dataWithoutId} = formData
        try{
            if(!formData.id){
                console.log(dataWithoutId, ' for create')
                await dispatch(createUser({...dataWithoutId, created_by:1}))
            }else{
                console.log(formData,' for edit')
                await dispatch(patchUser({id:formData.id, objData:{...formData}})).unwrap()
            }
            setFormData({
                first_name:'',
                last_name:'',
                other_names:'',
                date_of_birth:'',
                sex:'',
                contact:'',
                email:'',
                id:''
        
            })
            setIsOpen(false)
        } catch (err){
            alert(`Error: ${err}`)
        }
    }

    const {id} = useParams()

    const selectedMember = id
        ? members.find(member => member.id == id)
        : null
    return (
        <>
        <div className='col-span-8 row-span-2 p-4 rounded bg-dblack-900 overflow-x-auto'>
            <div className='flex items-center justify-between border-b pb-2 mt-2 mb-4 
                '>
                <p className='text-dcyan-300 text-lg capitalize'>Members</p>
                {/* <FiFilter className=' hover:stroke-dcyan-700 ' /> */}
                <button onClick={() =>handleOpen()} className='flex items-center gap-2 border rounded p-2 hover:bg-dblack-700'>
                    <FiUserPlus /> Add member</button>
            </div>
            <MemberTable members={members} dataToEdit={handleOpen}/>
        </div>
        {/* To render details, form, cmponents */}
        <Outlet context={selectedMember}/>
        <div className={`fixed top-0 right-0 h-full w-96 bg-dblack-700 shadow-lg transition-transform duration-300 ease-in-out
                     transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-left ring-dcyan-900`}>
            <div className='p-6'>
                <MdClose onClick={handleClose} className='absolute right-3 hover:cursor-pointer size-6' />
                
                <div className='bg-dblack-900 col-span-4 row-span-2 p-2 mt-9 rounded-lg'>
                    <p className='text-center  text-3xl text-dcyan-700 my-3'>{formData.id ? 'Edit':'Create'} Member</p>
                    <form action="" className='flex flex-col gap-3 items-center'>
                        <input type="text" name="first_name" id=""  placeholder='First Name' 
                        className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md ' value={formData.first_name} onChange={handleChange}/>
                        <input type="text" name="last_name" id="" placeholder='Last Name' 
                        className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md' value={formData.last_name} onChange={handleChange}/>
                        <input type="text" name="other_names" id=""  placeholder='Other Name' 
                        className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md ' value={formData.other_names} onChange={handleChange}/>
                        <div className='flex flex-col items-start w-full max-w-md'>
                            <p className='text-gray-300'>Gender:</p>
                            <div className='flex items-center gap-4'>
                                <label className='flex items-center gap-2'>
                                    <input 
                                        type="radio" 
                                        name="sex" 
                                        value="M" 
                                        checked={formData.sex === 'M'}
                                        onChange={handleChange}
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
                                        onChange={handleChange}
                                        className='accent-dcyan-700'
                                    />
                                    <span className='text-gray-300'>Female</span>
                                </label>
                            
                            </div>
                        </div>
                        <input type="date" name="date_of_birth" id="" placeholder='Date of Birth' 
                        className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md' value={formData.date_of_birth} onChange={handleChange}/>
                        <input type="text" name="contact" id=""  placeholder='Contact' 
                        className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md ' value={formData.contact} onChange={handleChange}/>
                        <input type="email" name="email" id="" placeholder='Email' 
                        className='bg-dblack-600 rounded-md py-3 px-2  w-full max-w-md' value={formData.email} onChange={handleChange}/>
                        <button onClick={handleSubmit} className='bg-dblack-300 rounded-md px-6 py-3 text-gray-200 hover:bg-dcyan-700
                        hover:text-dblack-800 transition duration-300'>
                        {formData.id ? 'Save':'Create'} member</button>
                    </form>
                </div>
            </div>

        </div>
        </>
    )
}    

export default Member
