import { ref, computed } from 'vue'
import { API_URL } from './api'

interface User {
  id: number
  username: string
  email: string
  nome?: string
  cognome?: string
  tipo_utente?: string
  agencies?: Array<{ id: number; name: string }>
}

const token = ref<string | null>(localStorage.getItem('auth_token'))
const user = ref<User | null>(JSON.parse(localStorage.getItem('auth_user') || 'null'))

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const agencyId = computed(() => {
    if (user.value?.agencies && user.value.agencies.length > 0) {
      return user.value.agencies[0].id
    }
    return null
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

    const response = await fetch(`${API_URL}/api/users/me?populate=agencies`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
    })

    if (!response.ok) {
      logout()
      return null
    }

    const data = await response.json()
    user.value = data
    localStorage.setItem('auth_user', JSON.stringify(data))
    return data
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
