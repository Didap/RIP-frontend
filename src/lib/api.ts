import { useAuth } from './auth'

export const API_URL = import.meta.env.VITE_API_URL

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const { getToken, logout } = useAuth()
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    logout()
    window.location.href = '/login'
    throw new Error('Sessione scaduta, effettua nuovamente il login')
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}
