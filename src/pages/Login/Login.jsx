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
      navigate('home')
    } catch (error) {
      toast.error(error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-custom-bg-primary dark:bg-custom-bg-primary">
      <div className="w-full max-w-lg px-4">
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default Login
