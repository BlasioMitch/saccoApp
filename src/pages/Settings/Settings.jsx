import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Camera, Loader2, Moon, Sun, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import client from '../../graphql/client'
import { ME } from '../../graphql/queries'
import { UPDATE_MY_PROFILE } from '../../graphql/mutations'
import { profileUpdated } from '../../reducers/authReducer'
import { PageShell } from '../../components/layout/PageShell'
import { useTheme } from '../../components/ui/ThemeProvider'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import { imageFileToAvatar } from '../../utils/avatar'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONTACT_PATTERN = /^\+?\d{9,15}$/
const PROFILE_FIELDS = ['first_name', 'last_name', 'other_name', 'email', 'contact', 'dob', 'gender']

const inputClass = 'w-full h-10 px-4 text-sm bg-custom-bg-secondary text-custom-text-primary rounded-lg border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary'
const labelClass = 'block text-sm font-medium text-custom-text-primary mb-2'

const Card = ({ title, description, children, className = '' }) => (
  <section className={`flex min-h-0 flex-col rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 ${className}`}>
    <h2 className="text-base font-semibold leading-6 text-custom-text-primary">{title}</h2>
    {description && <p className="mt-1 text-sm text-custom-text-secondary">{description}</p>}
    <div className="mt-4 min-h-0 flex-1">{children}</div>
  </section>
)

const FieldError = ({ message }) => message ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{message}</p> : null

const toForm = (user) => ({
  first_name: user?.first_name || '',
  last_name: user?.last_name || '',
  other_name: user?.other_name || '',
  email: user?.email || '',
  contact: user?.contact || '',
  dob: user?.dob ? moment(user.dob).format('YYYY-MM-DD') : '',
  gender: user?.gender || '',
})

const validate = (form) => {
  const errors = {}
  if (!form.first_name.trim()) errors.first_name = 'First name is required'
  if (!form.last_name.trim()) errors.last_name = 'Last name is required'
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Enter a valid email'
  if (!CONTACT_PATTERN.test(form.contact.replace(/[\s()-]/g, ''))) errors.contact = 'Contact must be 9–15 digits'
  if (!form.dob) errors.dob = 'Date of birth is required'
  else if (moment().diff(moment(form.dob), 'years') < 18) errors.dob = 'You must be at least 18'
  if (!form.gender) errors.gender = 'Gender is required'
  return errors
}

// The signed-in user's own settings: theme, avatar and bio data (nobody else can change these details)
const Settings = () => {
  const dispatch = useDispatch()
  const authUser = useSelector(state => state.auth.user)
  const { theme, setTheme } = useTheme()
  const fileInput = useRef(null)

  const [me, setMe] = useState(authUser)
  const [form, setForm] = useState(toForm(authUser))
  const [errors, setErrors] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)
  const [pendingAvatar, setPendingAvatar] = useState(null)
  const [savingAvatar, setSavingAvatar] = useState(false)

  // Fresh copy from the server (the stored session copy may be older)
  useEffect(() => {
    client.query({ query: ME, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        if (!data?.me) return
        setMe(data.me)
        setForm(toForm(data.me))
        dispatch(profileUpdated(data.me))
      })
      .catch(() => { /* the session-expired handler deals with auth errors */ })
  }, [dispatch])

  const save = async (input) => {
    const { data } = await client.mutate({ mutation: UPDATE_MY_PROFILE, variables: { input } })
    setMe(data.updateMyProfile)
    dispatch(profileUpdated(data.updateMyProfile))
    return data.updateMyProfile
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const original = toForm(me)
  const changed = PROFILE_FIELDS.filter(field => form[field] !== original[field])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    setSavingProfile(true)
    try {
      const input = Object.fromEntries(changed.map(field => [field, field === 'contact' ? form.contact.replace(/[\s()-]/g, '') : form[field].trim()]))
      const updated = await save(input)
      setForm(toForm(updated))
      toast.success('Profile saved')
    } catch (error) {
      toast.error(error?.message || 'Could not save your profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChooseAvatar = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setPendingAvatar(await imageFileToAvatar(file))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const saveAvatar = async (avatar) => {
    setSavingAvatar(true)
    try {
      await save({ avatar })
      setPendingAvatar(null)
      toast.success(avatar ? 'Photo updated' : 'Photo removed')
    } catch (error) {
      toast.error(error?.message || 'Could not update your photo')
    } finally {
      setSavingAvatar(false)
    }
  }

  const isDark = theme === 'dark'

  return (
    <PageShell>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex min-h-0 flex-col gap-6">
          <Card title="Appearance" description="Choose how SaccoApp looks on this device.">
            <div className="grid grid-cols-2 gap-2">
              {[['light', 'Light', Sun], ['dark', 'Dark', Moon]].map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  aria-pressed={theme === value}
                  className={`flex h-12 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors ${
                    theme === value
                      ? 'border-custom-brand-primary bg-custom-interactive-focus text-custom-brand-primary'
                      : 'border-custom-bg-tertiary text-custom-text-secondary hover:bg-custom-interactive-hover'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-custom-text-secondary">Currently {isDark ? 'dark' : 'light'}.</p>
          </Card>

          <Card title="Photo" description="Shown in the top bar. Without a photo, your initials are used.">
            <div className="flex items-center gap-4">
              <Avatar user={me} src={pendingAvatar ?? undefined} className="h-24 w-24" textClassName="text-2xl" />
              <div className="flex flex-col gap-2">
                {pendingAvatar ? (
                  <>
                    <Button size="sm" onClick={() => saveAvatar(pendingAvatar)} disabled={savingAvatar}>
                      {savingAvatar && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save photo
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setPendingAvatar(null)} disabled={savingAvatar}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => fileInput.current?.click()}>
                      <Camera className="h-4 w-4" />
                      {me?.avatar ? 'Change photo' : 'Upload photo'}
                    </Button>
                    {me?.avatar && (
                      <Button size="sm" variant="ghost" onClick={() => saveAvatar(null)} disabled={savingAvatar}>
                        <Trash2 className="h-4 w-4" />
                        Remove photo
                      </Button>
                    )}
                  </>
                )}
                <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={handleChooseAvatar} />
              </div>
            </div>
            <p className="mt-4 text-xs text-custom-text-secondary">JPG or PNG up to 5 MB; it is cropped to a square.</p>
          </Card>
        </div>

        <Card title="Profile" description="Your personal details. Only you can change these." className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="flex h-full flex-col">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[['first_name', 'First Name'], ['last_name', 'Last Name'], ['other_name', 'Other Names'], ['email', 'Email', 'email'], ['contact', 'Contact', 'tel'], ['dob', 'Date of Birth', 'date']].map(([name, label, type = 'text']) => (
                <div key={name}>
                  <label className={labelClass} htmlFor={name}>{label}</label>
                  <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} className={inputClass} />
                  <FieldError message={errors[name]} />
                </div>
              ))}
              <div>
                <label className={labelClass} htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <FieldError message={errors.gender} />
              </div>
              <div>
                <span className={labelClass}>Account</span>
                <div className="flex h-10 items-center gap-2 text-sm text-custom-text-secondary">
                  <span className="capitalize">{me?.role?.toLowerCase()}</span>
                  <StatusBadge status={me?.status} />
                  {me?.joinDate && <span>· joined {moment(me.joinDate).format('DD MMM YYYY')}</span>}
                </div>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-end gap-2 pt-6">
              {changed.length > 0 && (
                <Button variant="secondary" onClick={() => { setForm(original); setErrors({}) }} disabled={savingProfile}>Discard changes</Button>
              )}
              <Button type="submit" disabled={savingProfile || changed.length === 0}>
                {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                Save profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageShell>
  )
}

export default Settings
