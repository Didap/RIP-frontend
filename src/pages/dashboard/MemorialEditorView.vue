<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { API_URL, fetchApi, uploadFile } from '@/lib/api'
import { useToast } from '@/lib/useToast'
import CustomizationSidebar from '@/components/editor/CustomizationSidebar.vue'
import TemplateRenderer from '@/components/templates/TemplateRenderer.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { IconLoader2 } from '@tabler/icons-vue'
import type { MemorialData, CustomizationData } from '@/components/templates/types'

const isLeaveDialogOpen = ref(false)
let resolveLeave: ((val: boolean) => void) | null = null

const toast = useToast()
const route = useRoute()
const router = useRouter()
const memorialId = route.params.id as string

const memorial = ref<MemorialData | null>(null)
const loading = ref(true)
const saving = ref(false)
const pendingProfileId = ref<number | null>(null)
const pendingCoverId = ref<number | null>(null)
const activeSidebarSection = ref<string | undefined>(undefined)

function getAbsoluteUrl(url: string | undefined | null) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

function defaultCustomization(): CustomizationData {
  return {
    primary_color: '',
    background_color: '',
    card_bg_color: '',
    font_family: '',
    hide_stats: false,
    hide_biography: false,
    border_radius: '',
  }
}

async function loadMemorial() {
  loading.value = true
  try {
    const endpoint = `/api/tombstones/${memorialId}?populate[contributions][populate][author][fields]=username&populate[connections][populate][user][fields]=username&populate[profile_image]=true&populate[cover_image]=true`
    const response = await fetchApi(endpoint)
    const rawData = response.data ?? response
    const data = rawData.attributes ?? rawData

    const contributions = data.contributions ?? []
    const flowers = contributions.filter((c: any) => c.content_type === 'flower').length
    const candles = contributions.filter((c: any) => c.content_type === 'candle').length
    const memories = contributions.filter((c: any) => c.content_type === 'text').length

    memorial.value = {
      ...data,
      id: rawData.documentId || rawData.id,
      profile_image: data.profile_image ? {
        ...data.profile_image,
        url: getAbsoluteUrl(data.profile_image.url)
      } : null,
      cover_image: data.cover_image ? {
        ...data.cover_image,
        url: getAbsoluteUrl(data.cover_image.url)
      } : null,
      connections: data.connections || [],
      contributions: contributions,
      stats: { total: contributions.length, flowers, candles, memories },
      customization: data.customization || defaultCustomization(),
      lifecycle_status: data.lifecycle_status || 'draft',
    }
    snapshotSavedState()
  } catch (error) {
    console.error('Errore caricamento memoriale:', error)
    toast.addToast('Errore nel caricamento del memoriale', 'error')
  } finally {
    loading.value = false
  }
}

// Unsaved changes tracking
const savedState = ref('')

function snapshotSavedState() {
  if (!memorial.value) return
  savedState.value = JSON.stringify({
    customization: memorial.value.customization,
    template: memorial.value.template,
    full_name: memorial.value.full_name,
    slogan: memorial.value.slogan,
    biography: memorial.value.biography,
    lifecycle_status: (memorial.value as any).lifecycle_status,
  })
}

const hasUnsavedChanges = computed(() => {
  if (!memorial.value) return false
  return JSON.stringify({
    customization: memorial.value.customization,
    template: memorial.value.template,
    full_name: memorial.value.full_name,
    slogan: memorial.value.slogan,
    biography: memorial.value.biography,
    lifecycle_status: (memorial.value as any).lifecycle_status,
  }) !== savedState.value
})

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  e.preventDefault()
}

watch(hasUnsavedChanges, (val) => {
  if (val) {
    window.addEventListener('beforeunload', beforeUnloadHandler)
  } else {
    window.removeEventListener('beforeunload', beforeUnloadHandler)
  }
})

onBeforeRouteLeave(async (to, from) => {
  if (hasUnsavedChanges.value) {
    isLeaveDialogOpen.value = true
    return new Promise<boolean>((resolve) => {
      resolveLeave = resolve
    })
  }
})

function confirmLeave() {
  if (resolveLeave) resolveLeave(true)
  resolveLeave = null
  isLeaveDialogOpen.value = false
}

function cancelLeave() {
  if (resolveLeave) resolveLeave(false)
  resolveLeave = null
  isLeaveDialogOpen.value = false
}

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})

async function saveCustomization() {
  if (!memorial.value) return
  saving.value = true
  try {
    const data: any = {
      customization: memorial.value.customization,
      template: memorial.value.template,
      full_name: memorial.value.full_name,
      slogan: memorial.value.slogan,
      biography: memorial.value.biography,
      lifecycle_status: (memorial.value as any).lifecycle_status,
    }
    if (pendingProfileId.value) {
      data.profile_image = pendingProfileId.value
    }
    if (pendingCoverId.value) {
      data.cover_image = pendingCoverId.value
    }

    await fetchApi(`/api/tombstones/${memorial.value.id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    })

    pendingProfileId.value = null
    pendingCoverId.value = null
    snapshotSavedState()
    toast.addToast('Personalizzazione salvata con successo', 'success')
  } catch (error) {
    console.error('Errore salvataggio:', error)
    toast.addToast('Errore durante il salvataggio', 'error')
  } finally {
    saving.value = false
  }
}

function resetCustomization() {
  if (!memorial.value) return
  memorial.value.customization = defaultCustomization()
}

async function handleProfileUpload(file: File) {
  if (!memorial.value) return
  try {
    const uploaded = await uploadFile(file)
    memorial.value.profile_image = {
      url: getAbsoluteUrl(uploaded.url),
      alternativeText: file.name,
    }
    pendingProfileId.value = uploaded.id
    toast.addToast('Immagine profilo caricata', 'success')
  } catch {
    toast.addToast('Errore nel caricamento dell\'immagine', 'error')
  }
}

async function handleCoverUpload(file: File) {
  if (!memorial.value) return
  try {
    const uploaded = await uploadFile(file)
    memorial.value.cover_image = {
      url: getAbsoluteUrl(uploaded.url),
      alternativeText: file.name,
    }
    pendingCoverId.value = uploaded.id
    toast.addToast('Immagine copertina caricata', 'success')
  } catch {
    toast.addToast('Errore nel caricamento dell\'immagine', 'error')
  }
}

function goBack() {
  router.push('/memorials')
}

function openPreview() {
  if (!memorial.value) return
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin
  window.open(`${baseUrl}/m/${memorial.value.slug}`, '_blank')
}

function handleSectionEdit(sectionId: string) {
  activeSidebarSection.value = sectionId
  // Reset after a short delay to allow re-triggering the same section
  setTimeout(() => {
    activeSidebarSection.value = undefined
  }, 100)
}

onMounted(loadMemorial)
</script>

<template>
  <div class="editor-layout flex h-screen overflow-hidden bg-slate-100">
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <IconLoader2 class="size-8 animate-spin text-primary" />
    </div>

    <template v-else-if="memorial">
      <CustomizationSidebar
        v-if="memorial && memorial.customization"
        v-model="memorial.customization"
        v-model:template="memorial.template"
        :memorial-content="{
          full_name: memorial.full_name,
          slogan: memorial.slogan,
          biography: memorial.biography,
          profile_image: memorial.profile_image,
          cover_image: memorial.cover_image,
        }"
        :lifecycle-status="(memorial as any).lifecycle_status || 'draft'"
        :loading="saving"
        :has-unsaved-changes="hasUnsavedChanges"
        :initial-section="activeSidebarSection"
        @update:memorial-content="(val: any) => {
          if (!memorial) return
          memorial.full_name = val.full_name
          memorial.slogan = val.slogan
          memorial.biography = val.biography
        }"
        @update:lifecycle-status="(val: string) => { if (memorial) (memorial as any).lifecycle_status = val }"
        @save="saveCustomization"
        @reset="resetCustomization"
        @back="goBack"
        @preview="openPreview"
        @upload-profile="handleProfileUpload"
        @upload-cover="handleCoverUpload"
      />

      <main class="flex-1 overflow-y-auto p-12 flex items-start justify-center bg-slate-300 shadow-inner">
        <div class="relative mx-auto border-12 border-slate-900 rounded-[3rem] shadow-2xl bg-white overflow-hidden w-93.75 h-190 flex flex-col transition-all duration-500 ease-in-out">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-3xl z-60"></div>

          <div class="flex-1 overflow-y-auto scrollbar-hide">
            <div class="preview-header bg-slate-900 text-white p-4 pt-8 text-[10px] font-bold uppercase tracking-widest text-center sticky top-0 z-50">
              Anteprima Live
            </div>
            <TemplateRenderer
              v-if="memorial"
              :memorial="memorial"
              :preview="true"
              @edit-section="handleSectionEdit"
            />
          </div>

          <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800/20 rounded-full z-50"></div>
        </div>
      </main>
    </template>

    <div v-else class="flex-1 flex items-center justify-center flex-col gap-4">
      <p class="text-muted-foreground">Memoriale non trovato.</p>
      <button @click="goBack" class="px-4 py-2 bg-primary text-white rounded-md">Torna ai memoriali</button>
    </div>
    <ConfirmDialog
      v-model:open="isLeaveDialogOpen"
      title="Modifiche non salvate"
      description="Hai delle modifiche non salvate. Uscendo ora, tutte le tue personalizzazioni andranno perse. Vuoi davvero uscire?"
      confirm-variant="destructive"
      confirm-text="Esci senza salvare"
      cancel-text="Rimani"
      @confirm="confirmLeave"
      @cancel="cancelLeave"
      @update:open="val => { if (!val) cancelLeave() }"
    />
  </div>
</template>

<style scoped>
.editor-layout {
  position: fixed;
  inset: 0;
  z-index: 50;
}
</style>
