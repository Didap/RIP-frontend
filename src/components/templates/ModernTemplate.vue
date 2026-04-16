<script setup lang="ts">
import type { MemorialData } from './types'

defineProps<{ memorial: MemorialData; preview?: boolean }>()

function formatDate(date: string | undefined | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function authorName(author: any) {
  if (!author) return 'Anonimo'
  return [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}g`
  return formatDate(date)
}
</script>

<template>
  <div class="modern-template">
    <!-- Header with profile image -->
    <div class="header">
      <div v-if="memorial.profile_image" class="profile-img">
        <img
          :src="memorial.profile_image.url"
          :alt="memorial.profile_image.alternativeText || memorial.full_name"
          class="w-full h-full object-cover"
        />
      </div>
      <div v-else class="profile-placeholder">
        {{ getInitials(memorial.full_name) }}
      </div>
      <div class="header-info">
        <h1 class="name">{{ memorial.full_name }}</h1>
        <div v-if="memorial.dates" class="dates">
          <span v-if="memorial.dates.birth">{{ formatDate(memorial.dates.birth) }}</span>
          <span v-if="memorial.dates.birth && memorial.dates.death"> — </span>
          <span v-if="memorial.dates.death">{{ formatDate(memorial.dates.death) }}</span>
        </div>
      </div>
    </div>

    <!-- Slogan badge -->
    <div v-if="memorial.slogan" class="slogan-badge">
      {{ memorial.slogan }}
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-chip">
        <span>🌸</span> {{ memorial.stats.flowers }} Fiori
      </div>
      <div class="stat-chip">
        <span>🕯️</span> {{ memorial.stats.candles }} Candele
      </div>
      <div class="stat-chip">
        <span>💬</span> {{ memorial.stats.memories }} Ricordi
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="content-grid">
      <div class="content-main">
        <!-- Biography -->
        <div v-if="memorial.biography" class="bio-card">
          <h2 class="card-title">La sua storia</h2>
          <div class="bio-content" v-html="memorial.biography"></div>
        </div>

        <!-- Connections -->
        <div v-if="memorial.connections.length > 0" class="connections-card">
          <h2 class="card-title">Famiglia</h2>
          <div class="tags-list">
            <span
              v-for="(conn, i) in memorial.connections"
              :key="i"
              class="tag"
            >
              {{ conn.relation_type }}: {{ conn.user?.first_name }} {{ conn.user?.last_name }}
            </span>
          </div>
        </div>
      </div>

      <div class="content-side">
        <!-- Contributions feed -->
        <div class="contributions-card">
          <h2 class="card-title">Ricordi <span class="count">({{ memorial.stats.total }})</span></h2>
          <div v-if="memorial.contributions.length === 0" class="empty-state">
            Nessun ricordo ancora
          </div>
          <div v-else class="contributions-feed">
            <div
              v-for="c in memorial.contributions"
              :key="c.id"
              class="feed-item"
            >
              <div class="feed-avatar">
                {{ c.content_type === 'flower' ? '🌸' : c.content_type === 'candle' ? '🕯️' : '💭' }}
              </div>
              <div class="feed-content">
                <div class="feed-header">
                  <span class="feed-author">{{ authorName(c.author) }}</span>
                  <span class="feed-time">{{ timeAgo(c.createdAt) }}</span>
                </div>
                <div v-if="c.text_content" class="feed-text" v-html="c.text_content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modern-template {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  color: #0F172A;
  padding: 0;
  background: #FFFFFF;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  font-size: 1.5rem;
  color: #64748B;
  font-weight: 600;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.dates {
  font-size: 0.8rem;
  color: #64748B;
  margin-top: 0.25rem;
}

.slogan-badge {
  display: inline-block;
  margin: 0 1.5rem;
  padding: 0.4rem 1rem;
  background: #10B981;
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stats-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem 1rem;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  background: #F8FAFC;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #475569;
  font-weight: 500;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
}

.content-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748B;
  margin: 0 0 0.75rem;
}

.count {
  font-weight: 400;
  color: #94A3B8;
}

.bio-card {
  background: #F8FAFC;
  border-radius: 16px;
  padding: 1.25rem;
}

.bio-content {
  font-size: 0.85rem;
  line-height: 1.7;
  color: #475569;
}

.bio-content :deep(p) {
  margin-bottom: 0.5rem;
}

.connections-card {
  background: #F8FAFC;
  border-radius: 16px;
  padding: 1.25rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  background: #E2E8F0;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #475569;
}

.contributions-card {
  background: #F8FAFC;
  border-radius: 16px;
  padding: 1.25rem;
}

.empty-state {
  text-align: center;
  color: #94A3B8;
  font-size: 0.85rem;
  padding: 2rem 0;
}

.contributions-feed {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 500px;
  overflow-y: auto;
}

.feed-item {
  display: flex;
  gap: 0.75rem;
}

.feed-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 50%;
  font-size: 1rem;
}

.feed-content {
  flex: 1;
  min-width: 0;
}

.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2rem;
}

.feed-author {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0F172A;
}

.feed-time {
  font-size: 0.7rem;
  color: #94A3B8;
}

.feed-text {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.4;
}

.feed-text :deep(p) {
  margin: 0;
}

@media (max-width: 640px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
