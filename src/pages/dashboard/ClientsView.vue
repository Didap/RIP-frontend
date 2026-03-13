<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { IconUser, IconMail, IconDatabase } from '@tabler/icons-vue'

import BaseDataTable from '@/components/BaseDataTable.vue'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

interface ClientPermission {
  id: number
  access_level: string
  createdAt: string
  user?: { 
    id: number
    username: string
    email: string
    first_name?: string
    last_name?: string
  }
  tombstone?: {
    id: number
    full_name: string
  }
}

const { agencyId } = useAuth()
const data = ref<ClientPermission[]>([])
const loading = ref(true)

async function loadClients() {
  if (!agencyId.value) return
  loading.value = true
  try {
    const endpoint = `/api/tombstone-permissions?filters[access_level][$eq]=owner&filters[tombstone][agency][id][$eq]=${agencyId.value}&populate[user][fields][0]=username&populate[user][fields][1]=first_name&populate[user][fields][2]=last_name&populate[user][fields][3]=email&populate[tombstone][fields]=full_name&sort=createdAt:desc`
    const response = await fetchApi(endpoint)
    data.value = (response.data ?? response).map((item: any) => ({
      id: item.id,
      ...(item.attributes ?? item),
      user: item.attributes?.user?.data?.attributes ?? item.user ?? {},
      tombstone: item.attributes?.tombstone?.data?.attributes ?? item.tombstone ?? {},
    }))
  } catch (error) {
    console.error('Errore caricamento clienti:', error)
  } finally {
    loading.value = false
  }
}

const columns: ColumnDef<ClientPermission, any>[] = [
  {
    id: 'client_name',
    header: 'Cliente',
    cell: ({ row }) => {
      const u = (row.original as ClientPermission).user
      const name = u?.first_name && u?.last_name ? `${u.first_name} ${u.last_name}` : u?.username || '—'
      return h('div', { class: 'flex items-center gap-2' }, [
        h(IconUser, { class: 'size-4 text-muted-foreground' }),
        h('span', { class: 'font-medium' }, name),
      ])
    },
  },
  {
    id: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = (row.original as ClientPermission).user?.email
      return h('div', { class: 'flex items-center gap-2 text-muted-foreground' }, [
        h(IconMail, { class: 'size-3' }),
        h('span', { class: 'text-sm' }, email || '—'),
      ])
    },
  },
  {
    id: 'tombstone',
    header: 'Memoriale Gestito',
    cell: ({ row }) => {
      const tombstoneName = (row.original as ClientPermission).tombstone?.full_name
      return h('div', { class: 'flex items-center gap-2' }, [
        h(IconDatabase, { class: 'size-4 text-muted-foreground' }),
        h('span', {}, tombstoneName || '—'),
      ])
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data Attivazione',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return h('span', { class: 'text-muted-foreground text-sm' },
        date ? new Date(date).toLocaleDateString('it-IT') : '—')
    },
  },
]

onMounted(loadClients)
</script>

<template>
  <BaseDataTable
    title="Anagrafica Clienti"
    :columns="columns"
    :data="data"
    :loading="loading"
    search-placeholder="Cerca per nome o email..."
    empty-message="Nessun cliente registrato per questa agenzia."
  />
</template>
