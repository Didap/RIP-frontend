import { ref, computed } from 'vue'
import { API_URL } from './api'

interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role_type?: 'individual' | 'agency_admin' | 'agency_staff'
  managed_agency?: { id: number; name: string }
}

const token = ref<string | null>(localStorage.getItem('auth_token'))
const user = ref<User | null>(JSON.parse(localStorage.getItem('auth_user') || 'null'))

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const agencyId = computed(() => {
    return user.value?.managed_agency?.id || null
  })

  async function login(identifier: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error?.error?.message || 'Credenziali non valide')
    }

    const data = await response.json()
    token.value = data.jwt
    localStorage.setItem('auth_token', data.jwt)

    // Fetch full user with agency relation
    await fetchCurrentUser()

    return user.value
  }

  async function fetchCurrentUser() {
    if (!token.value) return null

    try {
      // Step 1: Get basic user info (including ID)
      const meResponse = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      if (!meResponse.ok) {
        logout()
        return null
      }

      const meData = await meResponse.json()
      
      // Step 2: Fetch full user with managed_agency
      const fullResponse = await fetch(`${API_URL}/api/users/${meData.id}?populate=managed_agency`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      if (!fullResponse.ok) {
        user.value = meData
      } else {
        user.value = await fullResponse.json()
      }

      localStorage.setItem('auth_user', JSON.stringify(user.value))
      return user.value
    } catch (error) {
      console.error('Errore fetchCurrentUser:', error)
      return null
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  function getToken() {
    return token.value
  }

  return {
    user,
    token,
    isAuthenticated,
    agencyId,
    login,
    logout,
    fetchCurrentUser,
    getToken,
  }
}
