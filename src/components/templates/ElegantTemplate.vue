<script setup lang="ts">
import type { MemorialData } from './types'

defineProps<{ memorial: MemorialData; preview?: boolean }>()

function formatDate(date: string | undefined | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function authorName(author: any) {
  if (!author) return 'Anonimo'
  return [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username
}
</script>

<template>
  <div class="elegant-template">
    <!-- Cover Section -->
    <div class="cover-section">
      <img
        v-if="memorial.cover_image"
        :src="memorial.cover_image.url"
        :alt="memorial.cover_image.alternativeText || ''"
        class="cover-img"
      />
      <div v-else class="cover-gradient"></div>
      <div class="cover-overlay">
        <h1 class="cover-name">{{ memorial.full_name }}</h1>
        <p v-if="memorial.slogan" class="cover-slogan">{{ memorial.slogan }}</p>
      </div>
    </div>

    <!-- Profile Image (overlapping cover) -->
    <div class="profile-section">
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
    </div>

    <!-- Dates -->
    <div v-if="memorial.dates" class="dates-section">
      <span v-if="memorial.dates.birth" class="date-text">{{ formatDate(memorial.dates.birth) }}</span>
      <span v-if="memorial.dates.birth && memorial.dates.death" class="date-separator">—</span>
      <span v-if="memorial.dates.death" class="date-text">{{ formatDate(memorial.dates.death) }}</span>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-icon">🌸</span>
        <span class="stat-count">{{ memorial.stats.flowers }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-icon">🕯️</span>
        <span class="stat-count">{{ memorial.stats.candles }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-icon">💬</span>
        <span class="stat-count">{{ memorial.stats.memories }}</span>
      </div>
    </div>

    <!-- Biography -->
    <div v-if="memorial.biography" class="bio-section">
      <div class="bio-content" v-html="memorial.biography"></div>
    </div>

    <!-- Connections -->
    <div v-if="memorial.connections.length > 0" class="connections-section">
      <div class="connections-badges">
        <span
          v-for="(conn, i) in memorial.connections"
          :key="i"
          class="connection-badge"
        >
          <span class="badge-type">{{ conn.relation_type }}</span>
          <span class="badge-name">{{ conn.user?.first_name }} {{ conn.user?.last_name }}</span>
        </span>
      </div>
    </div>

    <!-- Contributions -->
    <div v-if="memorial.contributions.length > 0" class="contributions-section">
      <h2 class="section-title">Ricordi</h2>
      <div class="contributions-list">
        <div
          v-for="c in memorial.contributions"
          :key="c.id"
          class="contribution-item"
        >
          <div class="contribution-left">
            <span class="contribution-icon">
              {{ c.content_type === 'flower' ? '🌸' : c.content_type === 'candle' ? '🕯️' : '💬' }}
            </span>
          </div>
          <div class="contribution-body">
            <div class="contribution-meta">
              <span class="contribution-author">{{ authorName(c.author) }}</span>
            </div>
            <div v-if="c.text_content" class="contribution-text" v-html="c.text_content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.elegant-template {
  max-width: 100%;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  color: #1E293B;
  background: #FFFFFF;
}

.cover-section {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1E293B 0%, #334155 50%, #1E293B 100%);
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 1.5rem 3.5rem;
  background: linear-gradient(transparent, rgba(15, 23, 42, 0.85));
  text-align: center;
}

.cover-name {
  font-size: 1.8rem;
  font-weight: 300;
  color: #F8FAFC;
  letter-spacing: 0.02em;
  margin: 0;
}

.cover-slogan {
  font-size: 0.85rem;
  color: #94A3B8;
  margin-top: 0.5rem;
  letter-spacing: 0.05em;
}

.profile-section {
  display: flex;
  justify-content: center;
  margin-top: -50px;
  position: relative;
  z-index: 1;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  overflow: hidden;
  border: 4px solid #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  border: 4px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E2E8F0;
  font-size: 1.8rem;
  color: #475569;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dates-section {
  text-align: center;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #94A3B8;
}

.date-separator {
  margin: 0 0.5rem;
}

.stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  margin: 0 1.5rem;
  background: rgba(241, 245, 249, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-count {
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: #CBD5E1;
}

.bio-section {
  padding: 1.5rem;
  margin: 1.5rem;
  background: #F8FAFC;
  border-radius: 12px;
  border-left: 3px solid #1E293B;
}

.bio-content {
  font-size: 0.9rem;
  line-height: 1.8;
  color: #475569;
}

.bio-content :deep(p) {
  margin-bottom: 0.5rem;
}

.connections-section {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.connections-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.connection-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  background: #F1F5F9;
  border-radius: 20px;
  font-size: 0.8rem;
}

.badge-type {
  color: #64748B;
  font-weight: 500;
}

.badge-name {
  color: #1E293B;
}

.section-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #94A3B8;
  padding: 0 1.5rem;
  margin-bottom: 1rem;
}

.contributions-section {
  padding-bottom: 1.5rem;
}

.contributions-list {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.contribution-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #F1F5F9;
}

.contribution-left {
  flex-shrink: 0;
}

.contribution-icon {
  font-size: 1.2rem;
}

.contribution-body {
  flex: 1;
  min-width: 0;
}

.contribution-meta {
  margin-bottom: 0.3rem;
}

.contribution-author {
  font-size: 0.8rem;
  font-weight: 500;
  color: #1E293B;
}

.contribution-text {
  font-size: 0.85rem;
  color: #64748B;
  line-height: 1.5;
}

.contribution-text :deep(p) {
  margin: 0;
}
</style>
