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
  <div class="classic-template">
    <!-- Profile Image -->
    <div class="text-center mb-6">
      <div
        v-if="memorial.profile_image"
        class="profile-img"
      >
        <img
          :src="memorial.profile_image.url"
          :alt="memorial.profile_image.alternativeText || memorial.full_name"
          class="w-full h-full object-cover rounded-full"
        />
      </div>
      <div v-else class="profile-placeholder">
        {{ getInitials(memorial.full_name) }}
      </div>
    </div>

    <!-- Name -->
    <h1 class="text-center font-serif text-2xl md:text-3xl text-gray-800 mb-1">
      {{ memorial.full_name }}
    </h1>

    <!-- Slogan -->
    <p v-if="memorial.slogan" class="text-center text-gray-500 italic mb-4">
      "{{ memorial.slogan }}"
    </p>

    <!-- Dates -->
    <div v-if="memorial.dates" class="text-center text-sm text-gray-600 mb-6">
      <span v-if="memorial.dates.birth">{{ formatDate(memorial.dates.birth) }}</span>
      <span v-if="memorial.dates.birth && memorial.dates.death"> — </span>
      <span v-if="memorial.dates.death">{{ formatDate(memorial.dates.death) }}</span>
    </div>

    <div class="divider"></div>

    <!-- Biography -->
    <div v-if="memorial.biography" class="bio-section">
      <h2 class="section-title">Biografia</h2>
      <div class="bio-content" v-html="memorial.biography"></div>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-icon">🌸</span>
        <span class="stat-count">{{ memorial.stats.flowers }}</span>
        <span class="stat-label">Fiori</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🕯️</span>
        <span class="stat-count">{{ memorial.stats.candles }}</span>
        <span class="stat-label">Candele</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💬</span>
        <span class="stat-count">{{ memorial.stats.memories }}</span>
        <span class="stat-label">Ricordi</span>
      </div>
    </div>

    <!-- Connections -->
    <div v-if="memorial.connections.length > 0" class="connections-section">
      <h2 class="section-title">Famiglia</h2>
      <ul class="connections-list">
        <li v-for="(conn, i) in memorial.connections" :key="i" class="connection-item">
          <span class="relation-badge">{{ conn.relation_type }}</span>
          <span class="connection-name">
            {{ conn.user?.first_name }} {{ conn.user?.last_name }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Contributions -->
    <div v-if="memorial.contributions.length > 0" class="contributions-section">
      <h2 class="section-title">Messaggi e Ricordi</h2>
      <div class="contributions-list">
        <div
          v-for="c in memorial.contributions"
          :key="c.id"
          class="contribution-card"
        >
          <div class="contribution-header">
            <span class="contribution-type">
              {{ c.content_type === 'flower' ? '🌸' : c.content_type === 'candle' ? '🕯️' : '💬' }}
            </span>
            <span class="contribution-author">{{ authorName(c.author) }}</span>
          </div>
          <div v-if="c.text_content" class="contribution-text" v-html="c.text_content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.classic-template {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: Georgia, 'Times New Roman', serif;
  color: #374151;
}

.profile-img {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid #B8860B;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.profile-placeholder {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid #B8860B;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F9FAFB, #E5E7EB);
  font-size: 2.5rem;
  color: #6B7280;
  font-weight: 600;
}

.divider {
  width: 60px;
  height: 2px;
  background: #B8860B;
  margin: 0 auto 1.5rem;
}

.bio-section {
  background: #F9FAFB;
  border-top: 3px solid #B8860B;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6B7280;
  margin-bottom: 0.75rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.bio-content {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #4B5563;
}

.bio-content :deep(p) {
  margin-bottom: 0.5rem;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  border-top: 1px solid #E5E7EB;
  border-bottom: 1px solid #E5E7EB;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
}

.stat-label {
  font-size: 0.7rem;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: system-ui, -apple-system, sans-serif;
}

.connections-section {
  margin-bottom: 1.5rem;
}

.connections-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.connection-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #F3F4F6;
}

.relation-badge {
  background: #FEF3C7;
  color: #92400E;
  padding: 0.15rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  font-family: system-ui, -apple-system, sans-serif;
}

.connection-name {
  font-size: 0.9rem;
  color: #374151;
}

.contributions-section {
  margin-bottom: 1.5rem;
}

.contributions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contribution-card {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 1rem;
}

.contribution-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.contribution-type {
  font-size: 1rem;
}

.contribution-author {
  font-size: 0.8rem;
  color: #6B7280;
  font-family: system-ui, -apple-system, sans-serif;
}

.contribution-text {
  font-size: 0.9rem;
  color: #4B5563;
  line-height: 1.5;
}

.contribution-text :deep(p) {
  margin: 0;
}
</style>
