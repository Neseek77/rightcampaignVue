import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

// Create a new Axios instance
let axiosInstance = axios.create()

// Apply the cache interceptor to the instance
setupCache(axiosInstance, {
    ttl: 2 * 60 * 1000 // 2 minutes
})

// Add Authorization header and cache-control conditionally
axiosInstance.interceptors.request.use(function (config) {
    config.headers = config.headers || {}

    // Add Bearer token if available
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // Disable caching for specific requests
    if (config.dontCache) {
        config.cache = false
    }

    return config
}, function (error) {
    return Promise.reject(error)
})

// Global response interceptor
axiosInstance.interceptors.response.use(async function (response) {
    return response
}, function (error) {
    if (error.response) {
        error = error.response
    } else if (error.request) {
        error = error.request
    } else {
        error = error.message
    }

    const logoutErrors = ['Wrong number of segments', 'logged out']
    if (error.data && logoutErrors.includes(error.data)) {
        window.location.reload()
    }

    return Promise.reject(error)
})

export const http = axiosInstance
