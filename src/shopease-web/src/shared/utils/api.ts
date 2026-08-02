import axios from 'axios'

// Use environment variable if available, otherwise use Azure URL
const BASE_URL = import.meta.env.VITE_API_URL 
  ?? 'https://shopease-api-athar.azurewebsites.net/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api