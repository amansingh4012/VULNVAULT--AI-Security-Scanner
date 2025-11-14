import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes for long scans
})

// Helper to add Clerk token to requests
export const apiWithAuth = async (clerkSession) => {
  if (clerkSession) {
    try {
      const token = await clerkSession.getToken()
      return {
        ...api.defaults,
        headers: {
          ...api.defaults.headers,
          'Authorization': `Bearer ${token}`
        }
      }
    } catch (error) {
      console.error('Failed to get Clerk token:', error)
    }
  }
  return api.defaults
}

export default api
export { API_URL }
