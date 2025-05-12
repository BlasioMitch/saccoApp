import axios from "axios";

// const baseUrl = 'http://localhost:3001/api'
const baseUrl =`${import.meta.env.VITE_API_URL}/api`

// Create axios instance with default config
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

export default api
// Add request interceptor to include token for  bearer token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )
