import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../reducers/authReducer'
import LoginForm from '../../components/forms/LoginForm'
import { toast } from 'sonner'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e, formData) => {
    e.preventDefault()
    try {
      await dispatch(login(formData)).unwrap()
      toast.success('Login successful!')
      navigate('/home')
    } catch (error) {
      // console.error('Login error:', error)
      // Handle the error object structure properly
      const errorMessage = error?.message || (typeof error === 'object' ? error.toString() : error) || 'Login failed'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Landing content */}
      <div className="hidden md:flex w-2/3 bg-custom-bg-primary dark:bg-custom-bg-primary p-8 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to SaccoApp</h1>
        <p className="text-lg mb-6">Your trusted platform for managing savings and loans efficiently.</p>
        <div className=" flex gap-4">
          <button 
            // onClick={() => navigate('/register')}
            className="w-full md:w-auto px-6 py-3  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
          <button 
            // onClick={() => navigate('/about')}
            className="w-full md:w-auto px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white dark:bg-gray-800 p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Login
