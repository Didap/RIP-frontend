<script setup lang="ts">
import { h, ref, watch, onMounted } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { 
  IconEye, 
  IconEdit, 
  IconToggleLeft, 
  IconToggleRight, 
  IconTrash, 
  IconUser, 
  IconQrcode 
} from '@tabler/icons-vue'

import BaseDataTable from '@/components/BaseDataTable.vue'
import MemorialDialog from '@/components/MemorialDialog.vue'
import QRCodeDialog from '@/components/QRCodeDialog.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

interface Memorial {
  id: number | string
  full_name: string
  slug: string
  link?: string
  lifecycle_status: 'draft' | 'published'
  createdAt: string
  contributions?: number
  owner?: {
    id: number
    username: string
    first_name?: string
    last_name?: string
  }
}

const { agencyId } = useAuth()
const data = ref<Memorial[]>([])
const loading = ref(true)

// Modal states
const isEditDialogOpen = ref(false)
const isQRDialogOpen = ref(false)
const selectedMemorial = ref<Memorial | null>(null)

async function loadMemorials() {
  if (!agencyId.value) return
  loading.value = true
  try {
    // Popoliamo le permissions per trovare l'owner e i contributi (solo conteggio)
    // Specifichiamo i campi dell'utente per evitare errori di permessi su campi come 'role'
    const endpoint = `/api/tombstones?filters[agency][id][$eq]=${agencyId.value}&populate[contributions][count]=true&populate[permissions][populate][user][fields][0]=username&populate[permissions][populate][user][fields][1]=first_name&populate[permissions][populate][user][fields][2]=last_name&sort=createdAt:desc`
    const response = await fetchApi(endpoint)
    const rawData = response.data ?? response
    
    // Safety check: ensure we have an array before mapping
    if (!Array.isArray(rawData)) {
      console.warn('API non ha restituito un array di memoriali:', response)
      data.value = []
      return
    }

    data.value = rawData.map((item: any) => {
      const attrs = item.attributes ?? item
      // Cerchiamo il permesso di tipo 'owner'
      const ownerPermission = attrs.permissions?.data?.find((p: any) => p.attributes?.access_level === 'owner')
      const ownerData = ownerPermission?.attributes?.user?.data
      
      return {
        ...attrs,
        id: item.documentId || item.id, // Sovrascriviamo l'id interno con il documentId per Strapi 5
        contributions: attrs.contributions?.data?.meta?.pagination?.total ?? attrs.contributions?.count ?? 0,
        owner: ownerData ? { id: ownerData.id, ...ownerData.attributes } : null
      }
    })
  } catch (error) {
    console.error('Errore caricamento memoriali:', error)
  } finally {
    loading.value = false
  }
}

watch(agencyId, loadMemorials, { immediate: true })

async function toggleStatus(memorial: Memorial) {
  const newStatus = memorial.lifecycle_status === 'published' ? 'draft' : 'published'
  try {
    await fetchApi(`/api/tombstones/${memorial.id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { lifecycle_status: newStatus } }),
    })
    memorial.lifecycle_status = newStatus
  } catch (error) {
    console.error('Errore cambio stato:', error)
  }
}

async function deleteMemorial(id: number) {
  if (!confirm('Sei sicuro di voler eliminare questo memoriale? L\'operazione è irreversibile.')) return
  
  try {
    await fetchApi(`/api/tombstones/${id}`, { method: 'DELETE' })
    data.value = data.value.filter(m => m.id !== id)
  } catch (error) {
    console.error('Errore eliminazione:', error)
  }
}

function openEdit(memorial: Memorial) {
  selectedMemorial.value = memorial
  isEditDialogOpen.value = true
}

function openQR(memorial: Memorial) {
  selectedMemorial.value = memorial
  isQRDialogOpen.value = true
}

const columns: ColumnDef<Memorial, any>[] = [
  {
    accessorKey: 'full_name',
    header: 'Nome',
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('full_name')),
  },
  {
    id: 'owner',
    header: 'Gestito da',
    cell: ({ row }) => {
      const owner = (row.original as Memorial).owner
      if (!owner) return h('span', { class: 'text-muted-foreground text-xs italic' }, 'Non assegnato')
      const name = owner.first_name && owner.last_name ? `${owner.first_name} ${owner.last_name}` : owner.username
      return h('div', { class: 'flex items-center gap-2' }, [
        h(IconUser, { class: 'size-3 text-muted-foreground' }),
        h('span', { class: 'text-sm' }, name)
      ])
    },
  },
  {
    accessorKey: 'lifecycle_status',
    header: 'Stato',
    cell: ({ row }) => {
      const status = row.getValue('lifecycle_status') as string
      return h(Badge, {
        variant: status === 'published' ? 'default' : 'secondary',
      }, () => status === 'published' ? 'Pubblicato' : 'Bozza')
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Creato il',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return h('span', { class: 'text-muted-foreground text-sm' },
        date ? new Date(date).toLocaleDateString('it-IT') : '—')
    },
  },
  {
    id: 'contributions',
    header: 'Contributi',
    cell: ({ row }) => {
      const count = (row.original as Memorial).contributions ?? 0
      return h(Badge, { variant: 'outline' }, () => `${count}`)
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const memorial = row.original as Memorial
      const isPublished = memorial.lifecycle_status === 'published'
      return h('div', { class: 'flex items-center gap-1 justify-end' }, [
        h(Button, {
          variant: 'ghost', size: 'icon', class: 'size-8', title: 'Vedi pagina',
          onClick: () => {
            const baseUrl = import.meta.env.VITE_WEBSITE_URL || 'https://memora.life'
            window.open(`${baseUrl}/memorial/${memorial.slug}`, '_blank')
          }
        }, () => h(IconEye, { class: 'size-4' })),
        h(Button, {
          variant: 'ghost', size: 'icon', class: 'size-8', title: 'Modifica',
          onClick: () => openEdit(memorial)
        }, () => h(IconEdit, { class: 'size-4' })),
        h(Button, {
          variant: 'ghost', size: 'icon', class: 'size-8', title: 'Genera QR',
          onClick: () => openQR(memorial)
        }, () => h(IconQrcode, { class: 'size-4 text-blue-500' })),
        h(Button, {
          variant: 'ghost', size: 'icon', class: 'size-8', title: isPublished ? 'Metti in bozza' : 'Pubblica',
          onClick: () => toggleStatus(memorial)
        }, () => h(isPublished ? IconToggleRight : IconToggleLeft, {
          class: `size-4 ${isPublished ? 'text-emerald-500' : 'text-muted-foreground'}`,
        })),
        h(Button, {
          variant: 'ghost', size: 'icon', class: 'size-8 text-destructive hover:text-destructive hover:bg-destructive/10', title: 'Elimina',
          onClick: () => deleteMemorial(memorial.id)
        }, () => h(IconTrash, { class: 'size-4' })),
      ])
    },
  },
]

onMounted(loadMemorials)
</script>

<template>
  <div class="space-y-6">
    <BaseDataTable
      title="Memoriali"
      :columns="columns"
      :data="data"
      :loading="loading"
      search-placeholder="Cerca memoriale..."
      empty-message="Nessun memoriale trovato."
    />

    <MemorialDialog 
      v-model:open="isEditDialogOpen" 
      :memorial="selectedMemorial" 
      @updated="loadMemorials" 
    />

    <QRCodeDialog
      v-model:open="isQRDialogOpen"
      :memorial="selectedMemorial"
    />
  </div>
</template>
