<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { watchDebounced } from '@vueuse/core'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useToast } from '@/lib/useToast'

const toast = useToast()
import {
  IconPalette,
  IconTypography,
  IconLayout,
  IconDeviceFloppy,
  IconRotate,
  IconArrowLeft,
  IconEye,
  IconArticle,
  IconUpload,
  IconUser,
  IconPhoto,
  IconLoader2,
} from '@tabler/icons-vue'
import type { CustomizationData } from '../templates/types'
import TemplateCard from '../templates/TemplateCard.vue'

interface MemorialContent {
  full_name: string
  slogan: string | null
  biography: string | null
  profile_image: { url: string; alternativeText?: string } | null
  cover_image: { url: string; alternativeText?: string } | null
}

const props = defineProps<{
  modelValue: CustomizationData
  template: 'classic' | 'elegant' | 'modern'
  memorialContent: MemorialContent
  lifecycleStatus: 'draft' | 'published'
  loading?: boolean
  hasUnsavedChanges?: boolean
  initialSection?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CustomizationData]
  'update:template': [value: 'classic' | 'elegant' | 'modern']
  'update:memorialContent': [value: MemorialContent]
  'update:lifecycleStatus': [value: string]
  'save': []
  'reset': []
  'back': []
  'preview': []
  'uploadProfile': [file: File]
  'uploadCover': [file: File]
}>()

const isResetDialogOpen = ref(false)

const localData = ref<CustomizationData>({
  primary_color: '#B8860B',
  background_color: '#FFFFFF',
  card_bg_color: '#F8FAFC',
  font_family: 'system-ui, -apple-system, sans-serif',
  border_radius: '12px',
  hide_stats: false,
  hide_biography: false,
  ...props.modelValue
})

const localContent = ref<MemorialContent>({ ...props.memorialContent })
const primaryInput = ref<HTMLInputElement | null>(null)
const bgInput = ref<HTMLInputElement | null>(null)
const cardInput = ref<HTMLInputElement | null>(null)
const profileUpload = ref<HTMLInputElement | null>(null)
const coverUpload = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, (newVal) => {
  localData.value = { ...newVal }
}, { deep: true })

watch(() => props.memorialContent, (newVal) => {
  localContent.value = { ...newVal }
}, { deep: true })

const activeSections = ref<string[]>(['template', 'contenuti'])

watch(() => props.initialSection, (newVal) => {
  if (newVal && !activeSections.value.includes(newVal)) {
    activeSections.value = [...activeSections.value, newVal]
  }
})

watchDebounced(localData, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true, debounce: 50, maxWait: 100 })

watchDebounced(localContent, (newVal) => {
  const data = { ...newVal }
  // Ensure we don't pass nulls where strings are expected if needed
  emit('update:memorialContent', data)
}, { deep: true, debounce: 100, maxWait: 200 })

const fonts = [
  { label: 'Sans Serif (Standard)', value: "system-ui, -apple-system, sans-serif" },
  { label: 'Serif (Classico)', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Elegant (Moderno)', value: "'Playfair Display', serif" },
  { label: 'Monospace', value: "monospace" },
]

const borderRadii = [
  { label: 'Nessuno', value: '0px' },
  { label: 'Piccolo', value: '8px' },
  { label: 'Medio', value: '12px' },
  { label: 'Grande', value: '16px' },
  { label: 'Molto grande', value: '24px' },
]

function reset() {
  isResetDialogOpen.value = true
}

function handleConfirmReset() {
  emit('reset')
  toast.addToast('Personalizzazioni resettate', 'info')
}

function onProfileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('uploadProfile', file)
  input.value = ''
}

function onCoverChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('uploadCover', file)
  input.value = ''
}
</script>

<template>
  <div class="editor-sidebar flex flex-col h-full bg-white border-r">
    <!-- Header -->
    <div class="p-4 border-b flex items-center justify-between gap-2">
      <Button variant="ghost" size="icon" @click="emit('back')" title="Torna indietro">
        <IconArrowLeft class="size-5" />
      </Button>
      <h2 class="font-bold text-lg flex-1 flex items-center gap-2">
        Personalizza
        <span v-if="hasUnsavedChanges" class="size-2 rounded-full bg-amber-500 animate-pulse" />
      </h2>
      <Button variant="outline" size="icon" @click="emit('preview')" title="Anteprima pubblica">
        <IconEye class="size-4" />
      </Button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6">
      <Accordion
        type="multiple"
        :model-value="activeSections"
        @update:model-value="(val: any) => activeSections = val"
        class="w-full pb-8"
      >

        <!-- Template -->
        <AccordionItem value="template">
          <AccordionTrigger>
            <div class="flex items-center gap-2 text-primary">
              <IconLayout class="size-4" />
              <span class="font-semibold text-sm uppercase tracking-wider">Template</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="grid grid-cols-1 gap-4 pt-2">
              <TemplateCard
                v-for="t in (['classic', 'elegant', 'modern'] as const)"
                :key="t"
                :template="t"
                :selected="template === t"
                @select="emit('update:template', $event)"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Contenuti -->
        <AccordionItem value="contenuti">
          <AccordionTrigger>
            <div class="flex items-center gap-2 text-primary">
              <IconArticle class="size-4" />
              <span class="font-semibold text-sm uppercase tracking-wider">Contenuti</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="space-y-5">
            <!-- Nome -->
            <div class="space-y-2">
              <Label>Nome Completo</Label>
              <Input v-model="localContent.full_name" placeholder="Nome e cognome" />
            </div>

            <!-- Slogan -->
            <div class="space-y-2">
              <Label>Slogan / Citazione</Label>
              <Input
                :model-value="localContent.slogan || ''"
                @update:model-value="localContent.slogan = $event as string"
                placeholder="Una frase significativa..."
              />
            </div>

            <!-- Biography -->
            <div class="space-y-2">
              <Label>Biografia</Label>
              <Textarea
                :model-value="localContent.biography || ''"
                @update:model-value="localContent.biography = $event as string"
                placeholder="Racconta la sua storia..."
                class="min-h-25"
              />
            </div>

            <!-- Profile Image -->
            <div class="space-y-2">
              <Label class="text-xs font-bold text-muted-foreground uppercase">Immagine Profilo</Label>
              <div class="flex items-center gap-3">
                <div class="size-14 rounded-full border-2 border-dashed border-muted-foreground/30 overflow-hidden shrink-0 flex items-center justify-center bg-muted/30">
                  <img v-if="localContent.profile_image?.url" :src="localContent.profile_image.url" class="w-full h-full object-cover" />
                  <IconUser v-else class="size-5 text-muted-foreground/40" />
                </div>
                <input ref="profileUpload" type="file" accept="image/*" class="hidden" @change="onProfileChange" />
                <Button variant="outline" size="sm" class="gap-1.5" @click="profileUpload?.click()">
                  <IconUpload class="size-3.5" /> Carica
                </Button>
              </div>
            </div>

            <!-- Cover Image -->
            <div class="space-y-2">
              <Label class="text-xs font-bold text-muted-foreground uppercase">Immagine Copertina</Label>
              <div class="flex items-center gap-3">
                <div class="size-20 rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden shrink-0 flex items-center justify-center bg-muted/30">
                  <img v-if="localContent.cover_image?.url" :src="localContent.cover_image.url" class="w-full h-full object-cover" />
                  <IconPhoto v-else class="size-5 text-muted-foreground/40" />
                </div>
                <input ref="coverUpload" type="file" accept="image/*" class="hidden" @change="onCoverChange" />
                <Button variant="outline" size="sm" class="gap-1.5" @click="coverUpload?.click()">
                  <IconUpload class="size-3.5" /> Carica
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Colori -->
        <AccordionItem value="colori">
          <AccordionTrigger>
            <div class="flex items-center gap-2 text-primary">
              <IconPalette class="size-4" />
              <span class="font-semibold text-sm uppercase tracking-wider">Colori</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="space-y-5">
            <!-- Primary Color -->
            <div class="space-y-3">
              <Label class="text-xs font-bold text-muted-foreground uppercase">Colore Primario</Label>
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                  :style="{ backgroundColor: localData.primary_color || '#10B981' }"
                  @click="primaryInput?.click()"
                >
                  <input ref="primaryInput" type="color" v-model="localData.primary_color" class="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <Input type="text" v-model="localData.primary_color" placeholder="#10B981" class="flex-1 font-mono text-sm" />
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in ['#B8860B', '#10B981', '#3B82F6', '#EF4444', '#1E293B']"
                  :key="color"
                  class="size-6 rounded-full border border-white ring-1 ring-slate-200"
                  :style="{ backgroundColor: color }"
                  @click="localData.primary_color = color"
                ></button>
              </div>
            </div>

            <!-- Background Color -->
            <div class="space-y-3">
              <Label class="text-xs font-bold text-muted-foreground uppercase">Sfondo Pagina</Label>
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                  :style="{ backgroundColor: localData.background_color || '#FFFFFF' }"
                  @click="bgInput?.click()"
                >
                  <input ref="bgInput" type="color" v-model="localData.background_color" class="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <Input type="text" v-model="localData.background_color" placeholder="#FFFFFF" class="flex-1 font-mono text-sm" />
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#1E293B', '#000000']"
                  :key="color"
                  class="size-6 rounded-full border border-white ring-1 ring-slate-200"
                  :style="{ backgroundColor: color }"
                  @click="localData.background_color = color"
                ></button>
              </div>
            </div>

            <!-- Card Background -->
            <div class="space-y-3">
              <Label class="text-xs font-bold text-muted-foreground uppercase">Sfondo Schede</Label>
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                  :style="{ backgroundColor: localData.card_bg_color || '#F8FAFC' }"
                  @click="cardInput?.click()"
                >
                  <input ref="cardInput" type="color" v-model="localData.card_bg_color" class="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <Input type="text" v-model="localData.card_bg_color" placeholder="#F8FAFC" class="flex-1 font-mono text-sm" />
              </div>
            </div>

            <!-- Border Radius -->
            <div class="space-y-2">
              <Label>Bordo Arrotondato</Label>
              <Select v-model="localData.border_radius">
                <SelectTrigger>
                  <SelectValue placeholder="Predefinito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="r in borderRadii" :key="r.value" :value="r.value">
                    {{ r.label }} ({{ r.value }})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Tipografia -->
        <AccordionItem value="tipografia">
          <AccordionTrigger>
            <div class="flex items-center gap-2 text-primary">
              <IconTypography class="size-4" />
              <span class="font-semibold text-sm uppercase tracking-wider">Tipografia</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="space-y-4">
            <div class="space-y-2">
              <Label>Famiglia Font</Label>
              <Select v-model="localData.font_family">
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="font in fonts" :key="font.value" :value="font.value">
                    {{ font.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Layout -->
        <AccordionItem value="layout">
          <AccordionTrigger>
            <div class="flex items-center gap-2 text-primary">
              <IconLayout class="size-4" />
              <span class="font-semibold text-sm uppercase tracking-wider">Visibilità Sezioni</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <Label for="hide_stats" class="cursor-pointer">Nascondi Statistiche</Label>
                <Checkbox id="hide_stats" :checked="localData.hide_stats" @update:checked="localData.hide_stats = $event" />
              </div>
              <div class="flex items-center justify-between">
                <Label for="hide_biography" class="cursor-pointer">Nascondi Biografia</Label>
                <Checkbox id="hide_biography" :checked="localData.hide_biography" @update:checked="localData.hide_biography = $event" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>

    <!-- Footer -->
    <div class="border-t">
      <!-- Publish Toggle -->
      <div class="px-6 py-3 border-b">
        <div class="flex items-center justify-between">
          <div>
            <Label class="text-sm font-semibold">Stato</Label>
            <p class="text-xs text-muted-foreground">Solo i pubblicati sono visibili</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              :class="lifecycleStatus === 'draft' ? 'text-muted-foreground' : 'text-emerald-600'"
              class="text-xs font-medium"
            >
              {{ lifecycleStatus === 'draft' ? 'Bozza' : 'Pubblicato' }}
            </span>
            <Switch
              :checked="lifecycleStatus === 'published'"
              @update:checked="emit('update:lifecycleStatus', $event ? 'published' : 'draft')"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 flex gap-2">
        <Button variant="outline" class="gap-2 text-destructive hover:text-destructive" @click="reset">
          <IconRotate class="size-4" />
          Reset
        </Button>
        <Button class="flex-1 gap-2 h-11" @click="emit('save')" :disabled="loading">
          <IconLoader2 v-if="loading" class="size-4 animate-spin" />
          <IconDeviceFloppy v-else class="size-4" />
          Salva
        </Button>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="isResetDialogOpen"
      title="Reset Sfondo e Stile"
      description="Sei sicuro di voler resettare tutte le personalizzazioni del carattere, dei colori e degli sfondi? Questa azione non può essere annullata."
      confirm-variant="destructive"
      confirm-text="Reset Totale"
      @confirm="handleConfirmReset"
    />
  </div>
</template>

<style scoped>
.editor-sidebar {
  width: 350px;
  min-width: 350px;
}
</style>
