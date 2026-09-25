import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiX } from 'react-icons/fi'
import { createUser, patchUser, clearRegError, clearSuccess } from '../../reducers/userReducer'
import { toast } from 'sonner'

const UserForm = ({ isOpen, onClose, userToEdit }) => {
  const dispatch = useDispatch()
  const { status, error, success } = useSelector(state => state.users)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    other_name: '',
    email: '',
    contact: '',
    gender: '',
    dob: '',
    role: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (userToEdit) {
      const formattedData = {
        first_name: userToEdit.first_name || '',
        last_name: userToEdit.last_name || '',
        other_name: userToEdit.other_name || '',
        email: userToEdit.email || '',
        contact: userToEdit.contact || '',
        gender: userToEdit.gender || '',
        dob: userToEdit.dob || '',
        role: userToEdit.role || ''
      }
      setFormData(formattedData)
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        other_name: '',
        email: '',
        contact: '',
        gender: '',
        dob: '',
        role: ''
      })
    }
    setErrors({})
  }, [userToEdit])

  useEffect(() => {
    if (success) {
      toast.success(success)
      dispatch(clearSuccess())
      setFormData({
        first_name: '',
        last_name: '',
        other_name: '',
        email: '',
        contact: '',
        gender: '',
        dob: '',
        role: ''
      })
      onClose()
    }
    if (error) {
      toast.error(error)
      dispatch(clearRegError())
    }
  }, [success, error, dispatch, onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required'
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
    }
    if (!formData.role) {
      newErrors.role = 'Role is required'
    }
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const userData = {
        ...formData,
        status: userToEdit ? userToEdit.status : 'ACTIVE'
      }

      if (userToEdit) {
        // console.log(userData, ' data to edit')
        await dispatch(patchUser({ id: userToEdit.id, objData: userData })).unwrap()
        toast.success('Member updated successfully')
      } else {
        await dispatch(createUser(userData)).unwrap()
        toast.success('Member created successfully')
      }
      onClose()
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-md border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg leading-6 font-semibold text-custom-text-primary">
            {userToEdit ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
                errors.first_name ? 'border-red-500' : ''
              }`}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
                errors.last_name ? 'border-red-500' : ''
              }`}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">Other Names</label>
            <input
              type="text"
              name="other_name"
              value={formData.other_name}
              onChange={handleChange}
              className="w-full h-10 px-4 text-sm bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={`h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
                errors.contact ? 'border-red-500' : ''
              }`}
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contact}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
                errors.gender ? 'border-red-500' : ''
              }`}
            >
              <option value="" className="text-custom-text-secondary">Select Gender</option>
              <option value="MALE" className="text-custom-text-secondary">Male</option>
              <option value="FEMALE" className="text-custom-text-secondary">Female</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
                errors.role ? 'border-red-500' : ''
              }`}
            >
              <option value="" className="text-custom-text-secondary">Select Role</option>
              <option value="USER" className="text-custom-text-secondary">User</option>
              <option value="MANAGER" className="text-custom-text-secondary">Manager</option>
              <option value="ADMIN" className="text-custom-text-secondary">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-custom-text-primary mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`h-10 w-full rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
                errors.dob ? 'border-red-500' : ''
              }`}
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dob}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-green-500 text-gray-900 h-10 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (userToEdit ? 'Updating...' : 'Adding...') : (userToEdit ? 'Update Member' : 'Add Member')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserForm