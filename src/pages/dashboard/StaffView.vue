<script setup lang="ts">
import { h, ref, watch, onMounted, computed, reactive } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { IconId, IconMail, IconUserCircle, IconUserPlus, IconLoader2 } from '@tabler/icons-vue'

import BaseDataTable from '@/components/BaseDataTable.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/lib/useToast'

interface StaffMember {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  createdAt: string
}

const { agencyId, user: currentUser } = useAuth()
const toast = useToast()

const data = ref<StaffMember[]>([])
const loading = ref(true)
const creating = ref(false)
const isCreateModalOpen = ref(false)

const isAdmin = computed(() => currentUser.value?.role_type === 'agency_admin')

const newStaff = reactive({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
})

async function loadStaff() {
  if (!agencyId.value) return
  loading.value = true
  try {
    // Filtriamo per managed_agency (1-to-1/Many-to-1) invece che per l'array agencies
    const endpoint = `/api/users?filters[managed_agency][id][$eq]=${agencyId.value}&filters[role_type][$eq]=agency_staff&sort=createdAt:desc`
    const response = await fetchApi(endpoint)
    data.value = Array.isArray(response) ? response : (response.data ?? [])
  } catch (error) {
    console.error('Errore caricamento staff:', error)
  } finally {
    loading.value = false
  }
}

async function handleCreateStaff() {
  if (!agencyId.value) return
  creating.value = true
  try {
    await fetchApi(`/api/agencies/${agencyId.value}/staff`, {
      method: 'POST',
      body: JSON.stringify(newStaff)
    })
    
    toast.addToast('Collaboratore creato con successo', 'success')
    isCreateModalOpen.value = false
    
    // Reset form
    newStaff.username = ''
    newStaff.email = ''
    newStaff.password = ''
    newStaff.first_name = ''
    newStaff.last_name = ''
    
    await loadStaff()
  } catch (error: any) {
    console.error('Errore creazione staff:', error)
    toast.addToast(error.message || 'Errore durante la creazione del collaboratore', 'error')
  } finally {
    creating.value = false
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
  <div v-if="!isAdmin" class="flex flex-col items-center justify-center h-[50vh] space-y-4">
    <div class="p-4 rounded-full bg-destructive/10 text-destructive">
      <IconId class="size-12" />
    </div>
    <h2 class="text-xl font-semibold text-foreground">Accesso Negato</h2>
    <p class="text-muted-foreground text-center max-w-sm">
      Solo l'amministratore dell'agenzia può accedere a questa sezione e gestire i collaboratori.
    </p>
  </div>

  <div v-else class="space-y-6">
    <BaseDataTable
      title="Gestione Staff"
      :columns="columns"
      :data="data"
      :loading="loading"
      search-placeholder="Cerca per nome o email..."
      empty-message="Nessun collaboratore trovato per questa agenzia."
    >
      <template #actions>
        <Button @click="isCreateModalOpen = true" variant="outline" size="sm">
          <IconUserPlus class="mr-2 size-4" />
          Nuovo Collaboratore
        </Button>
      </template>
    </BaseDataTable>

    <Dialog v-model:open="isCreateModalOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crea Account Staff</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli per il nuovo membro dello staff. Potrà gestire memoriali e contributi.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right">Username</Label>
            <Input id="username" v-model="newStaff.username" class="col-span-3" placeholder="G.Rossi" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">Email</Label>
            <Input id="email" v-model="newStaff.email" type="email" class="col-span-3" placeholder="gianni@agenzia.it" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="password" class="text-right">Password</Label>
            <Input id="password" v-model="newStaff.password" type="password" class="col-span-3" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="first_name">Nome</Label>
              <Input id="first_name" v-model="newStaff.first_name" placeholder="Gianni" />
            </div>
            <div class="space-y-2">
              <Label for="last_name">Cognome</Label>
              <Input id="last_name" v-model="newStaff.last_name" placeholder="Rossi" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="isCreateModalOpen = false">Annulla</Button>
          <Button type="submit" :disabled="creating" @click="handleCreateStaff">
            <IconLoader2 v-if="creating" class="mr-2 h-4 w-4 animate-spin" />
            Crea Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

