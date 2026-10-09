import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../reducers/authReducer'
import LoginForm from '../../components/forms/LoginForm'
import { toast } from 'sonner'
import BrandMark from '../../components/ui/BrandMark'

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
      {/* Left side - Landing content, on the brand green (same as the sidebar, both themes) */}
      <div className="app-sidebar hidden md:flex w-2/3 bg-custom-bg-secondary text-custom-text-primary p-8 flex-col justify-center">
        <BrandMark className="mb-6 h-20 w-20 text-custom-brand-primary" />
        <h1 className="text-3xl xl:text-4xl font-bold mb-4">Welcome to Green Sprout</h1>
        <p className="text-lg mb-6 text-custom-text-secondary">Your trusted platform for managing savings and loans efficiently.</p>
        <div className="flex gap-4">
          <button 
            // onClick={() => navigate('/register')}
            className="w-full md:w-auto h-12 px-6 bg-custom-brand-primary text-custom-interactive-active-text rounded-lg hover:bg-custom-brand-dark transition-colors"
          >
            Get Started
          </button>
          <button 
            // onClick={() => navigate('/about')}
            className="w-full md:w-auto h-12 px-6 border border-custom-brand-primary text-custom-brand-primary rounded-lg hover:bg-custom-interactive-hover transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-custom-bg-primary p-8">
        <div className="w-full max-w-md">
          <h2 className="text-xl xl:text-2xl font-bold mb-6 text-center text-custom-text-primary">Login to Your Account</h2>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default Login
