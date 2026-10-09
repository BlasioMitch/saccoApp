import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiX } from 'react-icons/fi'
import { createUser, patchUser, clearRegError, clearSuccess } from '../../reducers/userReducer'
import { toast } from 'sonner'

const ROLE_OPTIONS = [['USER', 'User'], ['MANAGER', 'Manager'], ['ADMIN', 'Admin']]
const STATUS_OPTIONS = [['ACTIVE', 'Active'], ['INACTIVE', 'Inactive']]
const selectClass = 'w-full h-10 px-4 text-sm bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'

// Staff editing a member: bio data belongs to the member (Settings page), so only role and status change here
const MemberAccessForm = ({ user, onClose }) => {
  const dispatch = useDispatch()
  const { status } = useSelector(state => state.users)
  const [role, setRole] = useState(user.role || 'USER')
  const [memberStatus, setMemberStatus] = useState(user.status || 'ACTIVE')

  const details = [
    ['Name', [user.first_name, user.last_name, user.other_name].filter(Boolean).join(' ')],
    ['Email', user.email],
    ['Contact', user.contact],
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(patchUser({ id: user.id, objData: { role, status: memberStatus } })).unwrap()
      toast.success('Member updated successfully')
      onClose()
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-custom-bg-primary p-6 rounded-lg w-full max-w-md border border-custom-bg-tertiary shadow-2xl max-h-[calc(100vh-48px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg leading-6 font-semibold text-custom-text-primary">Edit Member Access</h2>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary" aria-label="Close">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-2 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary p-4 text-sm">
            {details.map(([label, value]) => (
              <React.Fragment key={label}>
                <dt className="text-custom-text-secondary">{label}</dt>
                <dd className="truncate font-medium text-custom-text-primary">{value || '–'}</dd>
              </React.Fragment>
            ))}
          </dl>
          <p className="text-xs text-custom-text-secondary">Only the member can change their own details, from their Settings page.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-custom-text-primary mb-2">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
                {ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-text-primary mb-2">Status</label>
              <select value={memberStatus} onChange={(e) => setMemberStatus(e.target.value)} className={selectClass}>
                {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 h-10 bg-custom-bg-secondary text-custom-text-primary rounded-lg hover:bg-custom-interactive-hover border border-custom-bg-tertiary">
              Cancel
            </button>
            <button type="submit" disabled={status === 'loading'} className="px-4 h-10 bg-custom-brand-primary text-custom-interactive-active-text font-medium rounded-lg hover:bg-custom-brand-dark disabled:opacity-50 disabled:cursor-not-allowed">
              {status === 'loading' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EMPTY_MEMBER = {
  first_name: '',
  last_name: '',
  other_name: '',
  email: '',
  contact: '',
  gender: '',
  dob: '',
  role: 'USER',
}

const GENDER_OPTIONS = [['MALE', 'Male'], ['FEMALE', 'Female']]
const today = () => new Date().toISOString().slice(0, 10)

const inputClass = (hasError) => `h-10 w-full rounded-lg border bg-custom-bg-secondary px-3 text-sm text-custom-text-primary placeholder:text-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-brand-primary ${
  hasError ? 'border-red-500' : 'border-custom-bg-tertiary'
}`

// Label above, error below; the error line keeps its height so the dialog doesn't jump while typing
const Field = ({ label, required, error, children, className = '' }) => (
  <div className={className}>
    <label className="mb-1 block text-xs font-medium text-custom-text-primary">
      {label}{required && <span className="text-red-600 dark:text-red-400"> *</span>}
    </label>
    {children}
    <p className="mt-1 h-4 text-xs leading-4 text-red-600 dark:text-red-400">{error}</p>
  </div>
)

// Small choice sets as buttons: one click instead of opening a select
const Segmented = ({ name, value, options, onChange, hasError }) => (
  <div role="radiogroup" className={`grid h-10 auto-cols-fr grid-flow-col gap-1 rounded-lg border bg-custom-bg-secondary p-1 ${
    hasError ? 'border-red-500' : 'border-custom-bg-tertiary'
  }`}>
    {options.map(([option, label]) => (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={value === option}
        onClick={() => onChange({ target: { name, value: option } })}
        className={`rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-brand-primary ${
          value === option
            ? 'bg-custom-interactive-active-bg text-custom-interactive-active-text shadow-sm'
            : 'text-custom-text-secondary hover:bg-custom-interactive-hover hover:text-custom-text-primary'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
)

const UserForm = ({ isOpen, onClose, userToEdit }) => {
  const dispatch = useDispatch()
  const { status } = useSelector(state => state.users)
  const [formData, setFormData] = useState(EMPTY_MEMBER)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_MEMBER)
      setErrors({})
    }
  }, [isOpen])

  // The thunks also store success/error messages; this form toasts from the submit handler instead
  useEffect(() => () => {
    dispatch(clearSuccess())
    dispatch(clearRegError())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required'
    if (!formData.gender) newErrors.gender = 'Choose a gender'
    if (!formData.role) newErrors.role = 'Choose a role'
    if (!formData.dob) newErrors.dob = 'Date of birth is required'
    else if (formData.dob > today()) newErrors.dob = 'Date of birth cannot be in the future'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await dispatch(createUser({ ...formData, status: 'ACTIVE' })).unwrap()
      dispatch(clearSuccess())
      toast.success('Member created successfully')
      onClose()
    } catch (error) {
      dispatch(clearRegError())
      toast.error(error || 'Something went wrong')
    }
  }

  if (!isOpen) return null
  if (userToEdit) return <MemberAccessForm user={userToEdit} onClose={onClose} />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-custom-bg-tertiary px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold leading-6 text-custom-text-primary">Add New Member</h2>
            <p className="text-xs text-custom-text-secondary">The member can update their own details later from Settings.</p>
          </div>
          <button onClick={onClose} className="text-custom-text-secondary hover:text-custom-text-primary" aria-label="Close">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-4 px-6 pt-4 sm:grid-cols-2">
            <Field label="First name" required error={errors.first_name}>
              <input name="first_name" value={formData.first_name} onChange={handleChange} autoFocus autoComplete="off" className={inputClass(errors.first_name)} />
            </Field>
            <Field label="Last name" required error={errors.last_name}>
              <input name="last_name" value={formData.last_name} onChange={handleChange} autoComplete="off" className={inputClass(errors.last_name)} />
            </Field>
            <Field label="Other names" error={errors.other_name}>
              <input name="other_name" value={formData.other_name} onChange={handleChange} autoComplete="off" placeholder="Optional" className={inputClass(false)} />
            </Field>
            <Field label="Gender" required error={errors.gender}>
              <Segmented name="gender" value={formData.gender} options={GENDER_OPTIONS} onChange={handleChange} hasError={errors.gender} />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="off" placeholder="name@example.com" className={inputClass(errors.email)} />
            </Field>
            <Field label="Contact" required error={errors.contact}>
              <input type="tel" name="contact" value={formData.contact} onChange={handleChange} autoComplete="off" placeholder="07XX XXX XXX" className={inputClass(errors.contact)} />
            </Field>
            <Field label="Date of birth" required error={errors.dob}>
              <input type="date" name="dob" value={formData.dob} max={today()} onChange={handleChange} className={inputClass(errors.dob)} />
            </Field>
            <Field label="Role" required error={errors.role}>
              <Segmented name="role" value={formData.role} options={ROLE_OPTIONS} onChange={handleChange} hasError={errors.role} />
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t border-custom-bg-tertiary px-6 py-4">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-custom-bg-tertiary bg-custom-bg-secondary px-4 text-sm text-custom-text-primary hover:bg-custom-interactive-hover">
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="h-10 rounded-lg bg-custom-brand-primary px-4 text-sm font-medium text-custom-interactive-active-text transition-colors hover:bg-custom-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'loading' ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm
