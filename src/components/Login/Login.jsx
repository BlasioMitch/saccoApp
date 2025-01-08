import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <>
        <div className='grid grid-cols-7 h-full gap-x-1'>
            <div className='flex col-span-2 m-3 place-items-center'>
                <div className='bg-dblack-800 flex-1 ml-2 rounded-xl py-6'>
                    <p className='text-center pb-2 mb-3 text-3xl text-dcyan-700'>Login</p>
                    <form action="" className='flex flex-col mx-1 gap-4 items-center'>
                        <input type="text" name="" id=""  placeholder='Username' 
                        className='bg-dblack-600 py-2 pl-2 w-3/4 rounded-md mx-2 '/>
                        <input type="password" name="" id="" placeholder='Password' 
                        className='bg-dblack-600 pl-2 py-2 w-3/4 rounded-md mx-2'/>
                        <a href="" className='text-blue-400'>Forgot Password?</a>
                        <button className='bg-dblack-300 m-auto py-2 px-9 rounded-md '>Login</button>
                    </form>
                </div>
            </div>
            <div className=' col-span-5 '>
                <div className='h-full m-2 rounded-xl bg-book-keeper bg-no-repeat bg-cover'>

                </div>
            </div>
        </div>
        </>
    )
}

export default Login
