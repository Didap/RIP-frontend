import type { MemorialData } from '@/components/templates/types'

const API_URL = import.meta.env.VITE_API_URL

export async function fetchPublicMemorial(slug: string): Promise<MemorialData | null> {
  const response = await fetch(`${API_URL}/api/tombstones/tombstone/${slug}`, {
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`API Error: ${response.status}`)

  return response.json()
}

export async function postPublicContribution(
  slug: string,
  contentType: 'flower' | 'candle' | 'text',
  textContent?: string,
): Promise<{ data: any } | null> {
  const response = await fetch(`${API_URL}/api/tombstones/memorial/${slug}/contribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_type: contentType, text_content: textContent || null }),
  })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`API Error: ${response.status}`)

  return response.json()
}
