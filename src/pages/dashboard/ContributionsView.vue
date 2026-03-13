<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { IconCheck, IconX, IconPhoto, IconVideo, IconMicrophone, IconFileText } from '@tabler/icons-vue'

import BaseDataTable from '@/components/BaseDataTable.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

interface Contribution {
  id: number
  content_type: 'photo' | 'video' | 'audio' | 'text'
  is_approved: boolean
  createdAt: string
  author?: { username: string }
  tombstone?: { full_name: string }
}

const { agencyId } = useAuth()
const data = ref<Contribution[]>([])
const loading = ref(true)

async function loadContributions() {
  loading.value = true
  try {
    const endpoint = `/api/contributions?filters[tombstone][agency][id][$eq]=${agencyId.value}&populate[tombstone][fields]=full_name&populate[author][fields]=username&sort=createdAt:desc`
    const response = await fetchApi(endpoint)
    data.value = (response.data ?? response).map((item: any) => ({
      id: item.id,
      ...(item.attributes ?? item),
      tombstone: item.attributes?.tombstone?.data?.attributes ?? item.tombstone ?? {},
      author: item.attributes?.author?.data?.attributes ?? item.author ?? {},
    }))
  } catch (error) {
    console.error('Errore caricamento contributi:', error)
  } finally {
    loading.value = false
  }
}

async function approveContribution(id: number) {
  try {
    await fetchApi(`/api/contributions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { is_approved: true } }),
    })
    const contribution = data.value.find(c => c.id === id)
    if (contribution) contribution.is_approved = true
  } catch (error) {
    console.error('Errore approvazione:', error)
  }
}

async function deleteContribution(id: number) {
  if (!confirm('Sei sicuro di voler eliminare questo contributo?')) return
  try {
    await fetchApi(`/api/contributions/${id}`, {
      method: 'DELETE',
    })
    data.value = data.value.filter(c => c.id !== id)
  } catch (error) {
    console.error('Errore eliminazione:', error)
  }
}

const columns: ColumnDef<Contribution, any>[] = [
  {
    accessorKey: 'content_type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('content_type') as string
      let icon = IconFileText
      if (type === 'photo') icon = IconPhoto
      if (type === 'video') icon = IconVideo
      if (type === 'audio') icon = IconMicrophone
      
      return h('div', { class: 'flex items-center gap-2 capitalize' }, [
        h(icon, { class: 'size-4 text-muted-foreground' }),
        h('span', {}, type),
      ])
    },
  },
  {
    id: 'author',
    header: 'Autore',
    cell: ({ row }) => (row.original as Contribution).author?.username ?? 'Anonimo',
  },
  {
    id: 'tombstone',
    header: 'Memoriale',
    cell: ({ row }) => (row.original as Contribution).tombstone?.full_name ?? '—',
  },
  {
    accessorKey: 'is_approved',
    header: 'Stato',
    cell: ({ row }) => {
      const isApproved = row.getValue('is_approved') as boolean
      return h(Badge, {
        variant: isApproved ? 'default' : 'secondary',
      }, () => isApproved ? 'Approvato' : 'In attesa')
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return h('span', { class: 'text-muted-foreground text-sm' },
        date ? new Date(date).toLocaleDateString('it-IT') : '—')
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const contribution = row.original as Contribution
      return h('div', { class: 'flex items-center gap-1' }, [
        !contribution.is_approved && h(Button, {
          variant: 'ghost',
          size: 'icon',
          class: 'size-8 text-emerald-500',
          title: 'Approva',
          onClick: (e: Event) => {
            e.stopPropagation()
            approveContribution(contribution.id)
          },
        }, () => h(IconCheck, { class: 'size-4' })),
        h(Button, {
          variant: 'ghost',
          size: 'icon',
          class: 'size-8 text-destructive',
          title: 'Elimina',
          onClick: (e: Event) => {
            e.stopPropagation()
            deleteContribution(contribution.id)
          },
        }, () => h(IconX, { class: 'size-4' })),
      ])
    },
  },
]

onMounted(loadContributions)
</script>

<template>
  <BaseDataTable
    title="Moderazione Contributi"
    :columns="columns"
    :data="data"
    :loading="loading"
    search-placeholder="Cerca per tipo o autore..."
    empty-message="Nessun contributo da moderare."
  />
</template>
