import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/auth'

// Create axios instance with default config
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const saveUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData))
}

const clearUserData = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const getUserData = () => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}

const login = async (credentials) => {
  const response = await api.post('/login', credentials)
  const { token, user } = response.data
  
  // Save both token and user data
  localStorage.setItem('token', token)
  saveUserData(user)
  
  return response.data
}

const logout = async () => {
  try {
    const response = await api.post('/logout')
    clearUserData()
    return response.data
  } catch (error) {
    clearUserData() // Clear data even if logout request fails
    throw error
  }
}

export default { login, logout, getUserData }