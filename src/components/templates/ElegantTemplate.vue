<script setup lang="ts">
import { computed } from 'vue'
import type { MemorialData } from './types'

const props = defineProps<{ memorial: MemorialData; preview?: boolean }>()
const emit = defineEmits<{ 'edit-section': [sectionId: string] }>()

const customizationStyle = computed(() => {
  const c = props.memorial.customization || {}
  const primary = c.primary_color || '#D4AF37'
  const bg = c.background_color || '#1A1A2E'
  
  return {
    '--primary-color': primary,
    '--bg-color': bg,
    '--bg-overlay': `${bg}E6`, // 90% opacity hex
    '--glass-bg': 'rgba(255, 255, 255, 0.05)',
    '--glass-border': 'rgba(255, 255, 255, 0.1)',
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
  const d = new Date(date)
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="app-elegant" :style="customizationStyle">
    <!-- Immersive Hero (Matching App) -->
    <div class="elegant-hero" :class="{ 'cursor-pointer': preview }" @click="preview && emit('edit-section', 'contenuti')">
      <img v-if="memorial.cover_image" :src="memorial.cover_image.url" class="hero-img" />
      <img v-else-if="memorial.profile_image" :src="memorial.profile_image.url" class="hero-img" />
      
      <!-- Content Overlay - Positioned at bottom of Hero -->
      <div class="hero-content">
         <h1 class="elegant-name">{{ memorial.full_name }}</h1>
         <p v-if="memorial.slogan" class="elegant-slogan">{{ memorial.slogan }}</p>
      </div>

      <!-- Overlapping Profile Circle -->
      <div class="profile-overlap">
         <div class="profile-container">
            <img v-if="memorial.profile_image" :src="memorial.profile_image.url" class="profile-img" />
            <div v-else class="profile-placeholder">{{ memorial.full_name.charAt(0) }}</div>
         </div>
      </div>
    </div>

    <div class="app-content">
      <!-- Glassmorphism Card (Matching styles.elegantGlassCard) -->
      <article v-if="memorial.biography && !memorial.customization?.hide_biography" 
               class="glass-card"
               :class="{ 'cursor-pointer': preview }"
               @click="preview && emit('edit-section', 'contenuti')">
        <p class="bio-text">{{ stripHtml(memorial.biography) }}</p>
      </article>

      <!-- Stats Section (Dark Variant) -->
      <section v-if="!memorial.customization?.hide_stats" class="stats-elegant">
        <div class="stat-item">
          <span class="stat-count">{{ memorial.stats.flowers }}</span>
          <span class="stat-label">Fiori</span>
        </div>
        <div class="stat-item">
          <span class="stat-count">{{ memorial.stats.candles }}</span>
          <span class="stat-label">Luci</span>
        </div>
        <div class="stat-item accent">
          <span class="stat-count">{{ memorial.stats.memories }}</span>
          <span class="stat-label">Ricordi</span>
        </div>
      </section>

      <!-- Family connections in glass -->
      <div v-if="memorial.connections.length > 0" class="connections-elegant">
         <div v-for="(conn, i) in memorial.connections" :key="i" class="conn-row">
            <span class="rel">{{ conn.relation_type }}</span>
            <span class="dot"></span>
            <span class="nm">{{ conn.user?.first_name }}</span>
         </div>
      </div>

      <!-- Timeline Section -->
      <section class="timeline-elegant">
         <h3 class="timeline-title">Frammenti di Storia</h3>
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
                  <div v-if="c.text_content" class="bubble">
                     <p class="text">{{ stripHtml(c.text_content) }}</p>
                  </div>
               </div>
            </div>
         </div>
         <p v-else class="empty-text">Ancora nessun ricordo nella storia.</p>
      </section>
    </div>

    <footer class="elegant-footer">
        RIP · Eternals
    </footer>
  </div>
</template>

<style scoped>
.app-elegant {
  background-color: var(--bg-color);
  color: white;
  min-height: 100vh;
  padding-bottom: 6rem;
}

.elegant-hero {
  height: 480px;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-color);
}

.hero-img {
  width: 100%;
  height: 110%; /* Slightly taller to ensure it bleeds under the gradient */
  object-fit: cover;
  filter: brightness(0.6);
  position: absolute;
  top: 0;
  left: 0;
}

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, transparent, var(--bg-overlay));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 2rem;
  padding-bottom: 5rem; /* Space for the profile overlap */
  z-index: 10;
}

.profile-overlap {
  position: absolute;
  bottom: -70px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 20;
}

.profile-container {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid var(--bg-color);
  overflow: hidden;
  background: rgba(255,255,255,0.1);
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 3.5rem;
  color: white;
}

.elegant-name {
  font-family: var(--font-serif);
  font-size: 3rem;
  text-align: center;
  margin: 0;
  line-height: 1.1;
  font-weight: 700;
  text-shadow: 0 4px 20px rgba(0,0,0,0.6);
  letter-spacing: -0.01em;
}

.elegant-slogan {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.25rem;
  color: rgba(255,255,255,0.9);
  margin-top: 1rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.4);
}

.app-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 80px 1.5rem 0; /* Padding for the overlapping profile */
}

/* Glass Card */
.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 3rem;
  backdrop-filter: blur(10px);
}

.bio-text {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.85);
  text-align: center;
}

/* Stats */
.stats-elegant {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3rem;
}

.stat-item {
  flex: 1;
  background: rgba(255,255,255,0.03);
  padding: 1.25rem 0.5rem;
  border-radius: 1rem;
  align-items: center;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255,255,255,0.05);
}

.stat-item.accent {
  background: rgba(255,255,255,0.08);
  border-color: var(--primary-color);
}

.stat-count {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: white;
}

.stat-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-color);
  font-weight: 700;
}

/* Connections */
.connections-elegant {
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
   margin-bottom: 4rem;
}

.conn-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-family: var(--font-serif);
    font-size: 0.9rem;
    opacity: 0.7;
}

.conn-row .rel { color: var(--primary-color); font-weight: 600; }
.conn-row .dot { width: 4px; height: 4px; border-radius: 50%; background: white; opacity: 0.3; }

/* Timeline */
.timeline-elegant {
  margin-top: 2rem;
}

.timeline-title {
  font-family: var(--font-serif);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--primary-color);
  margin-bottom: 3rem;
  text-align: center;
  opacity: 0.8;
}

.timeline-list {
  position: relative;
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  position: relative;
  padding-bottom: 3rem;
}

.timeline-line {
  position: absolute;
  left: 17px;
  top: 36px;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
}

.timeline-marker {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-color);
  border: 2px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  z-index: 1;
  flex-shrink: 0;
  box-shadow: 0 0 15px var(--primary-color);
  opacity: 0.9;
}

.timeline-content {
  margin-left: 1.25rem;
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.author {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
}

.timeline-header .date {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  font-family: var(--font-sans);
}

.bubble {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 1.25rem;
  border-radius: 1.25rem;
  border-left: 4px solid var(--primary-color);
}

.timeline-content .text {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  margin: 0;
}

.action-text {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.4);
}

.empty-text {
  text-align: center;
  color: rgba(255,255,255,0.3);
  font-style: italic;
  font-size: 0.95rem;
}

.elegant-footer {
  text-align: center;
  padding-top: 5rem;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.2);
}

@media (max-width: 480px) {
  .elegant-name { font-size: 2.2rem; }
  .elegant-hero { height: 400px; }
}
</style>
