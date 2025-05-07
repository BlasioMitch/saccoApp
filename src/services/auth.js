import axios from 'axios'

const baseUrl =import.meta.env.VITE_API_URL

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
  try {
    localStorage.setItem('user', JSON.stringify(userData))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

const clearUserData = () => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}

const getUserData = () => {
  try {
    const userData = localStorage.getItem('user')
    if (!userData) return null
    return JSON.parse(userData)
  } catch (error) {
    console.error('Error getting user data:', error)
    // Clear potentially corrupted data
    clearUserData()
    return null
  }
}

const login = async (credentials) => {
  try {
    const response = await api.post('/', credentials)
    const { token, user } = response.data
    
    // Save both token and user data
    localStorage.setItem('token', token)
    saveUserData(user)
    
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout')
    clearUserData()
    return response.data
  } catch (error) {
    console.error('Logout error:', error)
    clearUserData() // Clear data even if logout request fails
    throw error
  }
}

// Check if user is authenticated
const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token')
    const user = getUserData()
    return !!(token && user)
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

export default { 
  login, 
  logout, 
  getUserData, 
  isAuthenticated,
  saveUserData,
  clearUserData 
}