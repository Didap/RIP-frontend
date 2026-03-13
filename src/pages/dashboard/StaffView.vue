<script setup lang="ts">
import { h, ref, watch, onMounted } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { IconId, IconMail, IconUserCircle, IconUserPlus } from '@tabler/icons-vue'

import BaseDataTable from '@/components/BaseDataTable.vue'
import { Button } from '@/components/ui/button'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

interface StaffMember {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  createdAt: string
}

const { agencyId } = useAuth()
const data = ref<StaffMember[]>([])
const loading = ref(true)

async function loadStaff() {
  if (!agencyId.value) return
  loading.value = true
  try {
    const endpoint = `/api/users?filters[agencies][id][$in]=${agencyId.value}&filters[role_type][$eq]=agency_staff&sort=createdAt:desc`
    const response = await fetchApi(endpoint)
    // Strapi's /api/users returns an array directly
    data.value = Array.isArray(response) ? response : (response.data ?? [])
  } catch (error) {
    console.error('Errore caricamento staff:', error)
  } finally {
    loading.value = false
  }
}

const columns: ColumnDef<StaffMember, any>[] = [
  {
    id: 'name',
    header: 'Nome Completo',
    cell: ({ row }) => {
      const s = row.original as StaffMember
      const name = s.first_name && s.last_name ? `${s.first_name} ${s.last_name}` : '—'
      return h('div', { class: 'flex items-center gap-2' }, [
        h(IconUserCircle, { class: 'size-4 text-primary' }),
        h('span', { class: 'font-medium' }, name),
      ])
    },
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => h('span', { class: 'text-muted-foreground' }, row.getValue('username')),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string
      return h('div', { class: 'flex items-center gap-2 text-muted-foreground' }, [
        h(IconMail, { class: 'size-3' }),
        h('span', { class: 'text-sm' }, email),
      ])
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data Join',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return h('span', { class: 'text-muted-foreground text-sm' },
        date ? new Date(date).toLocaleDateString('it-IT') : '—')
    },
  },
  {
    id: 'badge',
    header: 'Ruolo',
    cell: () => h('div', { class: 'flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground' }, [
      h(IconId, { class: 'size-3' }),
      h('span', {}, 'Staff'),
    ]),
  },
]

watch(agencyId, loadStaff, { immediate: true })
onMounted(loadStaff)
</script>

<template>
    <BaseDataTable
      title="Gestione Staff"
      :columns="columns"
      :data="data"
      :loading="loading"
      search-placeholder="Cerca per nome o email..."
      empty-message="Nessun collaboratore trovato per questa agenzia."
    >
      <template #actions>
        <Button variant="outline" size="sm">
          <IconUserPlus class="mr-2 size-4" />
          Invita Staff
        </Button>
      </template>
    </BaseDataTable>
</template>
