export interface MemorialData {
  id: string | number
  full_name: string
  slogan: string | null
  biography: string | null
  dates: { birth: string; death: string } | null
  template: 'classic' | 'elegant' | 'modern'
  slug: string
  profile_image: { url: string; alternativeText?: string } | null
  cover_image: { url: string; alternativeText?: string } | null
  connections: Array<{
    relation_type: string
    user: { username: string; first_name?: string; last_name?: string }
  }>
  contributions: Array<{
    id: string | number
    content_type: 'photo' | 'video' | 'audio' | 'text' | 'flower' | 'candle'
    text_content: string | null
    author: { username: string; first_name?: string; last_name?: string } | null
    createdAt: string
    event_date: string | null
  }>
  stats: { total: number; flowers: number; candles: number; memories: number }
  customization?: CustomizationData
}

export interface CustomizationData {
  primary_color?: string
  background_color?: string
  font_family?: string
  hide_stats?: boolean
  hide_biography?: boolean
  border_radius?: string
  card_bg_color?: string
}
