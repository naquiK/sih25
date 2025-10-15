import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
})

// Add a request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default instance
 