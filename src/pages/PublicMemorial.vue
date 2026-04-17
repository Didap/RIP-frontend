<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import TemplateRenderer from '@/components/templates/TemplateRenderer.vue'
import PublicActionButtons from '@/components/memorial/PublicActionButtons.vue'
import { fetchPublicMemorial } from '@/lib/public-api'
import type { MemorialData } from '@/components/templates/types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const memorial = ref<MemorialData | null>(null)
const loading = ref(true)
const notFound = ref(false)

const publicUrl = computed(() => {
  const base = import.meta.env.VITE_WEBSITE_URL || window.location.origin
  return `${base}/m/${slug.value}`
})

function buildStructuredData(m: MemorialData) {
  const person: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: m.full_name,
  }
  if (m.dates?.birth) person.birthDate = m.dates.birth
  if (m.dates?.death) person.deathDate = m.dates.death
  if (m.biography) person.description = m.biography.replace(/<[^>]*>/g, '').slice(0, 500)
  if (m.profile_image?.url) person.image = m.profile_image.url
  return JSON.stringify(person)
}

async function loadMemorial() {
  loading.value = true
  notFound.value = false
  try {
    const response = await fetchPublicMemorial(slug.value) as any
    if (!response) {
      notFound.value = true
      memorial.value = null
    } else {
      // Strapi v5 often wraps in { data: { ... } }
      memorial.value = response.data || response
    }
  } catch {
    notFound.value = true
    memorial.value = null
  } finally {
    loading.value = false
  }
}

watch(slug, loadMemorial, { immediate: true })

const ogImage = computed(() => {
  if (!memorial.value) return ''
  const imgUrl = memorial.value.cover_image?.url || memorial.value.profile_image?.url
  if (!imgUrl) return ''
  if (imgUrl.startsWith('http')) return imgUrl
  const apiBase = import.meta.env.VITE_API_URL || ''
  return `${apiBase}${imgUrl}`
})

const metaDescription = computed(() => {
  if (!memorial.value) return ''
  if (memorial.value.slogan) return memorial.value.slogan
  if (memorial.value.biography) {
    const text = memorial.value.biography.replace(/<[^>]*>/g, '')
    return text.slice(0, 160)
  }
  return `Memoriale digitale in ricordo di ${memorial.value.full_name}`
})

useHead(computed(() => ({
  title: memorial.value
    ? `${memorial.value.full_name} — RIP`
    : 'RIP — Memoriali Digitali',
  meta: memorial.value ? [
    { name: 'description', content: metaDescription.value },
    { property: 'og:title', content: `In memoria di ${memorial.value.full_name}` },
    { property: 'og:description', content: metaDescription.value },
    { property: 'og:image', content: ogImage.value },
    { property: 'og:url', content: publicUrl.value },
    { property: 'og:type', content: 'profile' },
    { property: 'al:ios:url', content: `ripapp://memorial/${slug.value}` },
    { property: 'al:android:url', content: `ripapp://memorial/${slug.value}` },
    { name: 'twitter:card', content: ogImage.value ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: `In memoria di ${memorial.value.full_name}` },
    { name: 'twitter:description', content: metaDescription.value },
    ...(ogImage.value ? [{ name: 'twitter:image', content: ogImage.value }] : []),
  ] : [],
  script: memorial.value ? [{
    type: 'application/ld+json',
    children: buildStructuredData(memorial.value),
  }] : [],
})))

function onContribution() {
  loadMemorial()
}
</script>

<template>
  <div class="public-memorial-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Caricamento...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="not-found-state">
      <div class="not-found-icon">&#10024;</div>
      <h1>Memoriale non trovato</h1>
      <p>Questo memoriale non esiste o non &egrave; pi&ugrave; disponibile.</p>
      <a href="/" class="back-link">Torna alla homepage</a>
    </div>

    <!-- Memorial -->
    <template v-else-if="memorial">
      <div class="memorial-content">
        <TemplateRenderer :memorial="memorial" />
      </div>
      <PublicActionButtons
        :slug="slug"
        :stats="memorial.stats"
        :public-url="publicUrl"
        @contribution="onContribution"
      />
    </template>
  </div>
</template>

<style scoped>
.public-memorial-page {
  min-height: 100dvh;
  background: #ffffff;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  gap: 1rem;
  color: #6B7280;
  font-family: system-ui, -apple-system, sans-serif;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #E5E7EB;
  border-top-color: #374151;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
  color: #374151;
}

.not-found-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.not-found-state h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.not-found-state p {
  color: #6B7280;
  max-width: 360px;
}

.back-link {
  margin-top: 1rem;
  color: #2563EB;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.memorial-content {
  padding-bottom: 5rem;
}
</style>
