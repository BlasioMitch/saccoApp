import axios from "axios";

// const baseUrl = 'http://localhost:3001/api/auth'
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


export default { api, saveUserData, clearUserData, getUserData }