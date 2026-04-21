<script setup lang="ts">
import { computed } from 'vue'
import type { MemorialData } from './types'

const props = defineProps<{ memorial: MemorialData; preview?: boolean }>()
const emit = defineEmits<{ 'edit-section': [sectionId: string] }>()

const customizationStyle = computed(() => {
  const c = props.memorial.customization || {}
  const primary = c.primary_color || '#6366F1'
  const bg = c.background_color || '#F8FAFC'
  
  return {
    '--primary-color': primary,
    '--bg-color': bg,
    '--bg-overlay': `${bg}1A`, // 10% opacity hex
    '--text-main': '#0F172A',
    '--font-sans': "'Inter', sans-serif",
    '--radius': '16px',
    '--shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  }
})

function stripHtml(html: string | undefined) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '')
}

function formatDate(date: string | undefined | null) {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Oggi'
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

const birthYear = computed(() => props.memorial.dates?.birth?.slice(0, 4) || '')
const deathYear = computed(() => props.memorial.dates?.death?.slice(0, 4) || '')
</script>

<template>
  <div class="app-modern" :style="customizationStyle">
    <!-- Cover Image (Matching App) -->
    <div class="modern-hero" :class="{ 'cursor-pointer': preview }" @click="preview && emit('edit-section', 'contenuti')">
       <img v-if="memorial.cover_image" :src="memorial.cover_image.url" class="full-img" />
       <div v-else class="placeholder-bg"></div>
    </div>

    <div class="content-wrap">
       <!-- Modern Header with Pill (Matching App) -->
       <header class="modern-header">
           <div class="pill">MEMORIALE</div>
           <h1 class="modern-title">{{ memorial.full_name }}</h1>
           <p class="modern-dates">{{ birthYear }} — {{ deathYear }}</p>
       </header>

       <!-- Bento Grid (Stacked on Mobile as in App) -->
       <div class="modern-bento">
          <div v-if="!memorial.customization?.hide_stats" class="stats-row">
             <div class="stat-card">
                 <span class="v">{{ memorial.stats.flowers }}</span>
                 <span class="l">Fiori</span>
             </div>
             <div class="stat-card">
                 <span class="v">{{ memorial.stats.candles }}</span>
                 <span class="l">Luci</span>
             </div>
          </div>

          <!-- Bio Card -->
          <article v-if="memorial.biography && !memorial.customization?.hide_biography" 
                   class="bio-card"
                   :class="{ 'cursor-pointer': preview }"
                   @click="preview && emit('edit-section', 'contenuti')">
             <p class="bio-text">{{ stripHtml(memorial.biography) }}</p>
          </article>
       </div>

       <!-- Section Title for Contributions -->
       <div class="contrib-title">
          Timeline dei Ricordi
       </div>

       <!-- Timeline List -->
       <div class="timeline-list">
          <div v-if="memorial.contributions.filter(c => !['flower', 'candle'].includes(c.content_type)).length > 0">
             <div v-for="(c, i) in [...memorial.contributions]
                  .filter(c => !['flower', 'candle'].includes(c.content_type))
                  .sort((a,b) => new Date(b.event_date || b.createdAt).getTime() - new Date(a.event_date || a.createdAt).getTime())" 
                  :key="c.id" 
                  class="timeline-item">
               <div class="timeline-line" v-if="i !== memorial.contributions.filter(c => !['flower', 'candle'].includes(c.content_type)).length - 1"></div>
               <div class="timeline-marker">
                  <span v-if="c.content_type === 'photo'">🖼️</span>
                  <span v-else>💬</span>
               </div>
               <div class="timeline-content">
                  <div class="timeline-header">
                     <span class="author">{{ c.author?.username || 'Anonimo' }}</span>
                     <span class="date">{{ c.event_date ? new Date(c.event_date).getFullYear() : formatDate(c.createdAt) }}</span>
                  </div>
                  <div v-if="c.text_content" class="bubble">
                     <p class="text">{{ stripHtml(c.text_content) }}</p>
                  </div>
               </div>
             </div>
          </div>
          <p v-else class="empty-text">Ancora nessun ricordo nella storia.</p>
       </div>
    </div>

    <footer class="modern-footer">
        RIP · Community Edition
    </footer>
  </div>
</template>

<style scoped>
.app-modern {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: var(--font-sans);
  min-height: 100vh;
  padding-bottom: 5rem;
}

.modern-hero {
  width: 100%;
  height: 220px;
  background: #E2E8F0;
  overflow: hidden;
}

.full-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
}

.content-wrap {
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
}

.modern-header {
  margin-bottom: 2rem;
}

.pill {
  background: var(--primary-color);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.modern-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}

.modern-dates {
  font-size: 0.95rem;
  color: #64748B;
  margin-top: 0.4rem;
}

/* Bento */
.modern-bento {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.stats-row {
  display: flex;
  gap: 1rem;
}

.stat-card {
  flex: 1;
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.stat-card .v { display: block; font-size: 1.5rem; font-weight: 800; }
.stat-card .l { font-size: 0.65rem; text-transform: uppercase; color: #94A3B8; font-weight: 700; margin-top: 2px; }

.bio-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.bio-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #334155;
}

/* Timeline */
.contrib-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: #94A3B8;
  margin-bottom: 1.5rem;
}

.timeline-list {
  position: relative;
}

.timeline-item {
  display: flex;
  position: relative;
  padding-bottom: 2rem;
}

.timeline-line {
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: 0;
  width: 2px;
  background: #E2E8F0;
}

.timeline-marker {
  width: 32px;
  height: 32px;
  background: white;
  border: 2px solid #E2E8F0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  flex-shrink: 0;
  box-shadow: var(--shadow);
}

.timeline-content {
  margin-left: 1rem;
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.author {
  font-weight: 700;
  font-size: 0.9rem;
}

.date {
  font-size: 0.75rem;
  color: #94A3B8;
}

.bubble {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border-left: 3px solid var(--primary-color);
  box-shadow: var(--shadow);
}

.text {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

.action-text {
  font-size: 0.85rem;
  font-style: italic;
  color: #94A3B8;
}

.empty-text {
  color: #94A3B8;
  font-size: 0.9rem;
  text-align: center;
  padding: 2rem 0;
}

.modern-footer {
  text-align: center;
  padding-top: 4rem;
  font-size: 0.7rem;
  color: #CBD5E1;
  font-weight: 600;
  letter-spacing: 0.1em;
}

@media (max-width: 480px) {
  .modern-title { font-size: 1.75rem; }
}
</style>
