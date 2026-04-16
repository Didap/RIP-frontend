<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { fetchApi } from '@/lib/api'
import TemplateRenderer from './TemplateRenderer.vue'
import type { MemorialData } from './types'

const props = defineProps<{
  open: boolean
  memorialId: string | number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const loading = ref(true)
const memorial = ref<MemorialData | null>(null)

async function loadMemorial() {
  if (!props.memorialId) return
  loading.value = true
  memorial.value = null
  try {
    const res = await fetchApi(`/api/tombstones/${props.memorialId}?populate=profile_image,cover_image,contributions.author,contributions.media,connections.user`)
    const raw = res.data || res
    const contributions = (raw.contributions || []).map((c: any) => ({
      id: c.documentId || c.id,
      content_type: c.content_type,
      text_content: c.text_content || null,
      author: c.author || null,
      createdAt: c.createdAt,
    }))
    const flowers = contributions.filter((c: any) => c.content_type === 'flower').length
    const candles = contributions.filter((c: any) => c.content_type === 'candle').length

    memorial.value = {
      id: raw.documentId || raw.id,
      full_name: raw.full_name,
      slogan: raw.slogan || null,
      biography: raw.biography || null,
      dates: raw.dates || null,
      template: raw.template || 'classic',
      slug: raw.slug,
      profile_image: raw.profile_image ? {
        url: raw.profile_image.url,
        alternativeText: raw.profile_image.alternativeText,
      } : null,
      cover_image: raw.cover_image ? {
        url: raw.cover_image.url,
        alternativeText: raw.cover_image.alternativeText,
      } : null,
      connections: raw.connections || [],
      contributions,
      stats: {
        total: contributions.length,
        flowers,
        candles,
        memories: contributions.length - flowers - candles,
      },
    }
  } catch (error) {
    console.error('Errore caricamento preview:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.open, (val) => {
  if (val) loadMemorial()
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-2xl h-[85vh] p-0 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-full text-muted-foreground">
        Caricamento preview...
      </div>
      <div v-else-if="memorial" class="h-full overflow-y-auto">
        <TemplateRenderer :memorial="memorial" :preview="true" />
      </div>
      <div v-else class="flex items-center justify-center h-full text-muted-foreground">
        Impossibile caricare il memoriale
      </div>
    </DialogContent>
  </Dialog>
</template>
