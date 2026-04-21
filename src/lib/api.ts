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
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody?.error?.message || response.statusText
    const error = new Error(`API Error: ${message}`) as any
    error.details = errorBody?.error?.details
    throw error
  }

  return response.json()
}

export async function uploadFile(file: File): Promise<any> {
  const { getToken, logout } = useAuth()
  const token = getToken()

  const formData = new FormData()
  formData.append('files', file)

  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (response.status === 401) {
    logout()
    window.location.href = '/login'
    throw new Error('Sessione scaduta, effettua nuovamente il login')
  }

  if (!response.ok) {
    throw new Error(`Upload Error: ${response.statusText}`)
  }

  const result = await response.json()
  return Array.isArray(result) ? result[0] : result
}
