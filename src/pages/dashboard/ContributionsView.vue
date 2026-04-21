<script setup lang="ts">
import { h, ref, onMounted, computed } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { IconCheck, IconX, IconUserCircle } from '@tabler/icons-vue'

import BaseDataTable from '@/components/BaseDataTable.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/lib/useToast'

const toast = useToast()

interface Contribution {
  id: number
  documentId: string
  content_type: 'photo' | 'video' | 'audio' | 'text'
  is_approved: boolean
  is_anonymous: boolean
  text_content: string | null
  createdAt: string
  author?: { username: string }
  tombstone?: { full_name: string; documentId: string }
}

const { agencyId } = useAuth()
const data = ref<Contribution[]>([])
const loading = ref(true)
const showOnlyPending = ref(true) // Attivo di default
const processingIds = ref<Set<string>>(new Set())
const selectedContribution = ref<Contribution | null>(null)

const isDeleteDialogOpen = ref(false)
const contributionToDelete = ref<string | null>(null)

// Computed for filtered data - more robust check
const filteredData = computed(() => {
  if (!showOnlyPending.value) return data.value
  return data.value.filter(c => !c.is_approved)
})

async function loadContributions() {
  if (!agencyId.value) return
  loading.value = true
  try {
    const endpoint = `/api/contributions?filters[tombstone][agency][id][$eq]=${agencyId.value}&filters[content_type][$eq]=text&populate[tombstone][fields][0]=full_name&populate[tombstone][fields][1]=documentId&populate[author][fields]=username&sort=createdAt:desc`
    const response = await fetchApi(endpoint)
    
    const rawData = response.data || response
    data.value = Array.isArray(rawData) ? rawData.map((item: any) => {
      const attrs = item.attributes ?? item
      return {
        id: item.id,
        documentId: item.documentId,
        ...attrs,
        tombstone: attrs.tombstone?.data?.attributes ?? attrs.tombstone ?? {},
        author: attrs.author?.data?.attributes ?? attrs.author ?? {},
      }
    }) : []
  } catch (error) {
    console.error('Errore caricamento contributi:', error)
  } finally {
    loading.value = false
  }
}

async function approveContribution(docId: string) {
  if (processingIds.value.has(docId)) return
  processingIds.value.add(docId)
  try {
    await fetchApi(`/api/contributions/${docId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { is_approved: true } }),
    })
    const contribution = data.value.find(c => c.documentId === docId)
    if (contribution) contribution.is_approved = true
    if (selectedContribution.value?.documentId === docId) selectedContribution.value.is_approved = true
    toast.addToast('Contributo approvato', 'success')
  } catch (error) {
    toast.addToast('Errore durante l\'approvazione. Riprova.', 'error')
    console.error('Errore approvazione:', error)
  } finally {
    processingIds.value.delete(docId)
  }
}

function confirmDelete(docId: string) {
  contributionToDelete.value = docId
  isDeleteDialogOpen.value = true
}

async function doDeleteContribution() {
  if (!contributionToDelete.value) return
  const docId = contributionToDelete.value
  
  if (processingIds.value.has(docId)) return
  processingIds.value.add(docId)
  try {
    await fetchApi(`/api/contributions/${docId}`, {
      method: 'DELETE',
    })
    data.value = data.value.filter(c => c.documentId !== docId)
    if (selectedContribution.value?.documentId === docId) selectedContribution.value = null
    toast.addToast('Contributo eliminato con successo', 'success')
  } catch (error) {
    toast.addToast('Errore durante l\'eliminazione. Riprova.', 'error')
    console.error('Errore eliminazione:', error)
  } finally {
    processingIds.value.delete(docId)
    contributionToDelete.value = null
    isDeleteDialogOpen.value = false
  }
}

function handleRowClick(row: Contribution) {
  selectedContribution.value = row
}

const columns: ColumnDef<Contribution, any>[] = [
  {
    id: 'author',
    header: 'Autore',
    cell: ({ row }) => {
      const c = row.original as Contribution
      const name = c.author?.username || 'Anonimo'
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'font-medium' }, name),
        c.is_anonymous && h(Badge, { variant: 'outline', class: 'text-[10px] h-4 px-1 border-amber-200 text-amber-600 bg-amber-50' }, () => 'Privato')
      ])
    },
  },
  {
    id: 'tombstone',
    header: 'Memoriale',
    cell: ({ row }) => h('div', { class: 'text-sm' }, (row.original as Contribution).tombstone?.full_name ?? '—'),
  },
  {
    accessorKey: 'text_content',
    header: 'Messaggio',
    cell: ({ row }) => {
      const text = row.getValue('text_content') as string
      return h('div', { 
        class: 'max-w-[400px] truncate italic text-muted-foreground',
      }, text || '—')
    },
  },
  {
    accessorKey: 'is_approved',
    header: 'Stato',
    cell: ({ row }) => {
      const isApproved = row.getValue('is_approved') as boolean
      return h(Badge, {
        variant: isApproved ? 'default' : 'secondary',
        class: isApproved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''
      }, () => isApproved ? 'Approvato' : 'In attesa')
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return h('span', { class: 'text-muted-foreground text-sm whitespace-nowrap' },
        date ? new Date(date).toLocaleDateString('it-IT') : '—')
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const contribution = row.original as Contribution
      const isProcessing = processingIds.value.has(contribution.documentId)
      
      return h('div', { class: 'flex items-center gap-2' }, [
        !contribution.is_approved && h(Button, {
          variant: 'outline',
          size: 'sm',
          disabled: isProcessing,
          class: 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 cursor-pointer',
          onClick: (e: Event) => {
            e.stopPropagation()
            approveContribution(contribution.documentId)
          },
        }, () => [
          h(IconCheck, { class: 'size-4 mr-1' }), 
          isProcessing ? '...' : 'Approva'
        ]),
        h(Button, {
          variant: 'ghost',
          size: 'icon',
          disabled: isProcessing,
          class: 'size-8 text-destructive hover:bg-destructive/10 cursor-pointer',
          title: 'Elimina',
          onClick: (e: Event) => {
            e.stopPropagation()
            confirmDelete(contribution.documentId)
          },
        }, () => h(IconX, { class: 'size-4' })),
      ])
    },
  },
]

onMounted(loadContributions)
</script>

<template>
  <div class="space-y-4">
    <BaseDataTable
      title="Moderazione Ricordi"
      :columns="columns"
      :data="filteredData"
      :loading="loading"
      search-placeholder="Cerca per autore o memoriale..."
      empty-message="Nessun ricordo trovato."
      @row-click="handleRowClick"
    >
      <template #actions>
        <div class="flex items-center p-1 bg-muted rounded-lg mr-4 border border-border/50">
            <Button 
                variant="ghost" 
                size="sm" 
                :class="showOnlyPending ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'"
                class="text-[10px] h-7 px-3 font-bold uppercase tracking-wider transition-all"
                @click="showOnlyPending = true"
            >
                In Attesa
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                :class="!showOnlyPending ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'"
                class="text-[10px] h-7 px-3 font-bold uppercase tracking-wider transition-all"
                @click="showOnlyPending = false"
            >
                Tutti
            </Button>
        </div>
      </template>
    </BaseDataTable>

    <!-- Detail Dialog -->
    <Dialog :open="!!selectedContribution" @update:open="val => !val && (selectedContribution = null)">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <div class="flex items-center gap-2 mb-1">
            <Badge :variant="selectedContribution?.is_approved ? 'default' : 'secondary'"
                   :class="selectedContribution?.is_approved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''">
              {{ selectedContribution?.is_approved ? 'Approvato' : 'In attesa di moderazione' }}
            </Badge>
            <span class="text-xs text-muted-foreground">
              Inviato il {{ selectedContribution?.createdAt ? new Date(selectedContribution.createdAt).toLocaleDateString('it-IT') : '' }}
            </span>
          </div>
          <DialogTitle>Dettaglio Ricordo</DialogTitle>
          <DialogDescription>
            Pubblicato da <span class="font-semibold text-foreground">{{ selectedContribution?.author?.username || '—' }}</span> 
            <span v-if="selectedContribution?.is_anonymous" class="ml-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 font-medium">(Anonimo)</span>
            per <span class="font-semibold text-foreground">{{ selectedContribution?.tombstone?.full_name }}</span>
          </DialogDescription>
        </DialogHeader>

        <div class="py-6">
          <div class="bg-muted/30 p-6 rounded-xl border italic text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            "{{ selectedContribution?.text_content }}"
          </div>
        </div>

        <DialogFooter class="gap-4 sm:justify-between items-center border-t pt-4">
          <div class="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                class="text-xs h-8"
                @click="selectedContribution?.tombstone?.documentId && $router.push(`/memorials/${selectedContribution.tombstone.documentId}`)"
            >
              <IconUserCircle class="size-3.5 mr-1.5" />
              Vedi Memoriale
            </Button>
          </div>
          <div class="flex gap-2">
            <Button variant="ghost" size="sm" @click="selectedContribution = null">Chiudi</Button>
            <div class="flex gap-2 ml-4">
                <Button v-if="!selectedContribution?.is_approved" 
                        variant="default" 
                        size="sm"
                        class="bg-emerald-600 hover:bg-emerald-700 h-8"
                        :disabled="selectedContribution && processingIds.has(selectedContribution.documentId)"
                        @click="selectedContribution && approveContribution(selectedContribution.documentId)">
                  <IconCheck class="size-4 mr-2" />
                  Approva
                </Button>
                <Button variant="destructive" 
                        size="sm"
                        class="h-8"
                        :disabled="selectedContribution && processingIds.has(selectedContribution.documentId)"
                        @click="selectedContribution && confirmDelete(selectedContribution.documentId)">
                  <IconX class="size-4 mr-2" />
                  Rifiuta
                </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="Elimina Contributo"
      description="Sei sicuro di voler eliminare definitivamente questo contributo?"
      confirm-variant="destructive"
      confirm-text="Elimina definitavamente"
      @confirm="doDeleteContribution"
    />
  </div>
</template>
