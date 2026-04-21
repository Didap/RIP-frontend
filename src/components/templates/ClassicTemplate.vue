<script setup lang="ts">
import { computed } from 'vue'
import type { MemorialData } from './types'

const props = defineProps<{ memorial: MemorialData; preview?: boolean }>()
const emit = defineEmits<{ 'edit-section': [sectionId: string] }>()

const customizationStyle = computed(() => {
  const c = props.memorial.customization || {}
  const primary = c.primary_color || '#4A7C59'
  const bg = c.background_color || '#F8F6F2'
  
  return {
    '--primary-color': primary,
    '--bg-color': bg,
    '--bg-overlay': `${bg}0D`, // Very slight tint for cards
    '--text-primary': '#1A1A1A',
    '--text-secondary': '#666666',
    '--font-serif': "'Cormorant Garamond', serif",
    '--font-sans': "'Inter', sans-serif",
  }
})

function stripHtml(html: string | undefined) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '')
}

function formatDate(date: string | undefined | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div class="app-classic" :style="customizationStyle">
    <!-- Hero Image (Full Width as in App) -->
    <div class="hero-section" :class="{ 'cursor-pointer': preview }" @click="preview && emit('edit-section', 'contenuti')">
      <img v-if="memorial.cover_image" :src="memorial.cover_image.url" class="img-full" />
      <img v-else-if="memorial.profile_image" :src="memorial.profile_image.url" class="img-full" />
      <div v-else class="img-placeholder"></div>
    </div>

    <div class="content-container">
      <!-- Centered Header -->
      <header class="classic-header">
        <span class="eyebrow">In Memoria di</span>
        <h1 class="display-name">{{ memorial.full_name }}</h1>
        <div class="dates-row">
          <span class="date">{{ formatDate(memorial.dates?.birth) }}</span>
          <span class="sep" :style="{ color: customizationStyle['--primary-color'] }">❧</span>
          <span class="date">{{ formatDate(memorial.dates?.death) }}</span>
        </div>
      </header>

      <!-- Star Divider (Matching StarDivider component) -->
      <div class="divider-wrap">
        <div class="line"></div>
        <span class="star" :style="{ color: customizationStyle['--primary-color'] }">✦</span>
        <div class="line"></div>
      </div>

      <!-- Centered Bio -->
      <article v-if="memorial.biography && !memorial.customization?.hide_biography" 
               class="bio-section"
               :class="{ 'cursor-pointer': preview }"
               @click="preview && emit('edit-section', 'contenuti')">
        <p class="bio-text">{{ stripHtml(memorial.biography) }}</p>
      </article>

      <!-- Stats Section (Matching ContributionSection in app) -->
      <section v-if="!memorial.customization?.hide_stats" class="stats-section">
        <div class="stat-item">
          <span class="stat-icon">🕯️</span>
          <span class="stat-count">{{ memorial.stats.candles }}</span>
          <span class="stat-label">Candele</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🌸</span>
          <span class="stat-count">{{ memorial.stats.flowers }}</span>
          <span class="stat-label">Fiori</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💬</span>
          <span class="stat-count">{{ memorial.stats.memories }}</span>
          <span class="stat-label">Ricordi</span>
        </div>
      </section>

      <!-- Connections Section -->
      <div v-if="memorial.connections.length > 0" class="connections-section">
        <div v-for="(conn, i) in memorial.connections" :key="i" class="conn-pill">
           <span class="rel">{{ conn.relation_type }}</span>
           <span class="name">{{ conn.user?.first_name }}</span>
        </div>
      </div>

      <!-- Timeline Section -->
      <section class="timeline-section">
        <h3 class="timeline-title">La Nostra Storia</h3>
        <div v-if="memorial.contributions.filter(c => !['flower', 'candle'].includes(c.content_type)).length > 0" class="timeline-list">
          <div v-for="(c, i) in [...memorial.contributions]
               .filter(c => !['flower', 'candle'].includes(c.content_type))
               .sort((a,b) => new Date(b.event_date || b.createdAt).getTime() - new Date(a.event_date || a.createdAt).getTime())" 
               :key="c.id" 
               class="timeline-item">
            <div class="timeline-line" v-if="i !== memorial.contributions.filter(c => !['flower', 'candle'].includes(c.content_type)).length - 1"></div>
            <div class="timeline-marker" :style="{ borderColor: customizationStyle['--primary-color'] }">
              <span v-if="c.content_type === 'photo'">🖼️</span>
              <span v-else>💬</span>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="author">{{ c.author?.username || 'Anonimo' }}</span>
                <span class="date">{{ c.event_date ? new Date(c.event_date).getFullYear() : formatDate(c.createdAt) }}</span>
              </div>
              <p v-if="c.text_content" class="text">{{ stripHtml(c.text_content) }}</p>
            </div>
          </div>
        </div>
        <p v-else class="empty-text">Ancora nessun ricordo nella storia.</p>
      </section>
    </div>

    <footer class="app-footer">
        Rest In Pixel
    </footer>
  </div>
</template>

<style scoped>
.app-classic {
  background-color: var(--bg-color);
  color: var(--text-primary);
  min-height: 100vh;
  padding-bottom: 5rem;
}

.hero-section {
  width: 100%;
  height: 250px;
  background: #E8E5E0;
  overflow: hidden;
}

.img-full {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  background: #F0EDE8;
}

.content-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.classic-header {
  padding: 3rem 0;
  text-align: center;
}

.eyebrow {
  display: block;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.display-name {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 2.25rem;
  line-height: 1.1;
  color: #1A1A1A;
}

.dates-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.date {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.sep {
    font-size: 1.25rem;
}

/* Divider */
.divider-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.divider-wrap .line {
  flex: 1;
  height: 1px;
  background: #E8E5E0;
  max-width: 80px;
}

.divider-wrap .star {
  font-size: 1rem;
}

/* Bio */
.bio-section {
  margin-bottom: 3rem;
}

.bio-text {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.6;
  text-align: center;
  color: #333333;
}

/* Stats */
.stats-section {
  flex-direction: row;
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 2.5rem;
}

.stat-item {
  align-items: center;
  display: flex;
  flex-direction: column;
}

.stat-icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
.stat-count { font-family: var(--font-sans); font-weight: 700; font-size: 1.25rem; }
.stat-label { font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); }

/* Connections */
.connections-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.conn-pill {
  background: white;
  padding: 0.4rem 0.8rem;
  border-radius: 2rem;
  border: 1px solid #E8E5E0;
  display: flex;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.conn-pill .rel { font-weight: 700; color: var(--primary-color); }

.app-footer {
  text-align: center;
  padding-top: 4rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
}

/* Timeline */
.timeline-section {
  margin-top: 4rem;
}

.timeline-title {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  text-align: center;
}

.timeline-list {
  position: relative;
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  position: relative;
  padding-bottom: 2.5rem;
}

.timeline-line {
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: 0;
  width: 2px;
  background: #E8E5E0;
}

.timeline-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 2px solid #E8E5E0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  z-index: 1;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
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
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.9rem;
}

.timeline-content .date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.timeline-content .text {
  font-family: var(--font-serif);
  font-size: 1rem;
  line-height: 1.5;
  color: #444;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  border-left: 3px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin: 0;
}

.action-text {
  font-family: var(--font-sans);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.empty-text {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .display-name { font-size: 1.8rem; }
}
</style>
