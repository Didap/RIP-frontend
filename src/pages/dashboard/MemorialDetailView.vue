<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  IconCheck, 
  IconX, 
  IconUser, 
  IconCalendar, 
  IconMessage, 
  IconQrcode, 
  IconEye, 
  IconEdit,
  IconBrush,
  IconTrash,
  IconArrowLeft
} from '@tabler/icons-vue'
import type { ColumnDef } from '@tanstack/vue-table'

import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/lib/useToast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BaseDataTable from '@/components/BaseDataTable.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import QRCodeDialog from '@/components/QRCodeDialog.vue'
import MemorialDialog from '@/components/MemorialDialog.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { agencyId } = useAuth()

const memorialId = route.params.id as string
const memorial = ref<any>(null)
const loading = ref(true)
const contributions = ref<any[]>([])
const loadingContributions = ref(true)

// Modal states
const isEditDialogOpen = ref(false)
const isQRDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const processingIds = ref<Set<string>>(new Set())

async function loadMemorialData() {
  loading.value = true
  try {
    const endpoint = `/api/tombstones/${memorialId}?populate[permissions][populate][user][fields][0]=username&populate[permissions][populate][user][fields][1]=first_name&populate[permissions][populate][user][fields][2]=last_name`
    const response = await fetchApi(endpoint)
    const data = response.data ?? response
    
    const attrs = data.attributes ?? data
    const ownerPermission = attrs.permissions?.data?.find((p: any) => p.attributes?.access_level === 'owner')
    const ownerData = ownerPermission?.attributes?.user?.data
    
    memorial.value = {
      ...attrs,
      id: data.documentId || data.id,
      owner: ownerData ? { id: ownerData.id, ...ownerData.attributes } : null
    }
  } catch (error) {
    console.error('Errore caricamento memoriale:', error)
    toast.addToast('Impossibile caricare i dati del memoriale.', 'error')
  } finally {
    loading.value = false
  }
}

async function loadContributions() {
  loadingContributions.value = true
  try {
    const endpoint = `/api/contributions?filters[tombstone][documentId][$eq]=${memorialId}&filters[content_type][$eq]=text&populate[author][fields]=username&sort=createdAt:desc`
    const response = await fetchApi(endpoint)
    const rawData = response.data || response
    contributions.value = Array.isArray(rawData) ? rawData.map((item: any) => {
      const attrs = item.attributes ?? item
      return {
        id: item.id,
        documentId: item.documentId,
        ...attrs,
        author: attrs.author?.data?.attributes ?? attrs.author ?? {},
      }
    }) : []
  } catch (error) {
    console.error('Errore caricamento contributi:', error)
  } finally {
    loadingContributions.value = false
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
    const contribution = contributions.value.find(c => c.documentId === docId)
    if (contribution) contribution.is_approved = true
    toast.addToast('Contributo approvato', 'success')
  } catch (error) {
    toast.addToast('Errore durante l\'approvazione.', 'error')
  } finally {
    processingIds.value.delete(docId)
  }
}

async function deleteContribution(docId: string) {
  try {
    await fetchApi(`/api/contributions/${docId}`, { method: 'DELETE' })
    contributions.value = contributions.value.filter(c => c.documentId !== docId)
    toast.addToast('Contributo eliminato', 'success')
  } catch (error) {
    toast.addToast('Errore durante l\'eliminazione.', 'error')
  }
}

async function doDeleteMemorial() {
  try {
    await fetchApi(`/api/tombstones/${memorialId}`, { method: 'DELETE' })
    toast.addToast('Memoriale eliminato con successo', 'success')
    router.push('/memorials')
  } catch (error) {
    toast.addToast('Errore durante l\'eliminazione del memoriale.', 'error')
  }
}

const openPreview = () => {
  if (!memorial.value) return
  const baseUrl = window.location.origin
  window.open(`${baseUrl}/memorial/${memorial.value.slug}`, '_blank')
}

const columns: ColumnDef<any, any>[] = [
  {
    accessorKey: 'author',
    header: 'Autore',
    cell: ({ row }) => {
      const c = row.original
      const name = c.author?.username || 'Anonimo'
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'font-medium' }, name),
        c.is_anonymous && h(Badge, { variant: 'outline', class: 'text-[10px] h-4 px-1 border-amber-200 text-amber-600 bg-amber-50' }, () => 'Privato')
      ])
    },
  },
  {
    accessorKey: 'text_content',
    header: 'Messaggio',
    cell: ({ row }) => h('div', { class: 'max-w-[300px] truncate italic text-muted-foreground' }, row.getValue('text_content') || '—'),
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
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const contribution = row.original
      const isProcessing = processingIds.value.has(contribution.documentId)
      
      return h('div', { class: 'flex items-center gap-2 justify-end' }, [
        !contribution.is_approved && h(Button, {
          variant: 'outline', size: 'sm', disabled: isProcessing,
          class: 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 h-7 text-xs',
          onClick: () => approveContribution(contribution.documentId),
        }, () => isProcessing ? '...' : 'Approva'),
        h(Button, {
          variant: 'ghost', size: 'icon', disabled: isProcessing,
          class: 'size-7 text-destructive hover:bg-destructive/10',
          onClick: () => deleteContribution(contribution.documentId),
        }, () => h(IconX, { class: 'size-4' })),
      ])
    },
  },
]

onMounted(() => {
  loadMemorialData()
  loadContributions()
})
</script>

<template>
  <div v-if="loading" class="flex flex-col gap-8">
    <div class="flex items-center gap-4">
      <div class="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
      <div class="space-y-2">
        <div class="h-6 w-48 bg-muted animate-pulse rounded"></div>
        <div class="h-4 w-32 bg-muted animate-pulse rounded"></div>
      </div>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <div v-for="i in 3" :key="i" class="h-32 bg-muted animate-pulse rounded-lg"></div>
    </div>
  </div>

  <div v-else-if="memorial" class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.back()">
          <IconArrowLeft class="size-5" />
        </Button>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold">{{ memorial.full_name }}</h1>
            <Badge :variant="memorial.lifecycle_status === 'published' ? 'default' : 'secondary'">
              {{ memorial.lifecycle_status === 'published' ? 'Pubblicato' : 'In Bozza' }}
            </Badge>
          </div>
          <p class="text-muted-foreground flex items-center gap-2 mt-1">
            <span class="text-sm">rip.agency/memorial/{{ memorial.slug }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="isQRDialogOpen = true">
          <IconQrcode class="size-4 mr-2" />
          QR Code
        </Button>
        <Button variant="outline" size="sm" @click="isEditDialogOpen = true">
          <IconEdit class="size-4 mr-2" />
          Dati
        </Button>
        <Button variant="outline" size="sm" class="text-purple-600 border-purple-200 hover:bg-purple-50" @click="router.push(`/memorials/editor/${memorial.id}`)">
          <IconBrush class="size-4 mr-2" />
          Design
        </Button>
        <Button variant="default" size="sm" @click="openPreview">
          <IconEye class="size-4 mr-2" />
          Anteprima
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card class="bg-primary/5 border-primary/10 shadow-sm transition-all hover:shadow-md hover:bg-primary/10 cursor-default">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Contributi Totali</CardTitle>
          <IconMessage class="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ contributions.length }}</div>
          <p class="text-xs text-muted-foreground">Messaggi ricevuti dagli utenti</p>
        </CardContent>
      </Card>
      <Card class="bg-accent/10 border-accent/20 shadow-sm transition-all hover:shadow-md hover:bg-accent/20 cursor-default">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Gestito Da</CardTitle>
          <IconUser class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-lg font-bold truncate">
            {{ memorial.owner ? (memorial.owner.first_name ? `${memorial.owner.first_name} ${memorial.owner.last_name}` : memorial.owner.username) : 'Nessun proprietario' }}
          </div>
          <p class="text-xs text-muted-foreground">Cliente assegnato al memoriale</p>
        </CardContent>
      </Card>
      <Card class="bg-muted shadow-sm transition-all hover:shadow-md hover:bg-muted/80 cursor-default">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Data Attivazione</CardTitle>
          <IconCalendar class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ memorial.createdAt ? new Date(memorial.createdAt).toLocaleDateString('it-IT') : '—' }}
          </div>
          <p class="text-xs text-muted-foreground">Creato nel sistema</p>
        </CardContent>
      </Card>
    </div>

    <!-- Content Tabs -->
    <Tabs default-value="contributions" class="w-full">
      <TabsList class="grid w-full grid-cols-2 lg:w-[400px]">
        <TabsTrigger value="contributions">Moderazione Ricordi</TabsTrigger>
        <TabsTrigger value="settings">Impostazioni</TabsTrigger>
      </TabsList>
      
      <TabsContent value="contributions" class="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ricordi Ricevuti</CardTitle>
            <CardDescription>
              Gestisci i messaggi lasciati dai visitatori per {{ memorial.full_name }}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BaseDataTable 
              :columns="columns" 
              :data="contributions" 
              :loading="loadingContributions"
              empty-message="Nessun ricordo ancora presente per questo memoriale."
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" class="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestione Memoriale</CardTitle>
            <CardDescription>
              Configurazioni e informazioni sul proprietario del servizio.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-1">
                <p class="text-sm font-semibold">Slug (URL)</p>
                <code class="px-2 py-1 bg-muted rounded text-xs">{{ memorial.slug }}</code>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-semibold">Proprietario</p>
                <p class="text-sm text-muted-foreground">{{ memorial.owner?.username || 'Non assegnato' }}</p>
              </div>
            </div>
            
            <div class="pt-6 border-t border-destructive/10">
              <h4 class="text-sm font-bold text-destructive mb-2 uppercase tracking-wider">Zona Pericolosa</h4>
              <p class="text-sm text-muted-foreground mb-4">L'eliminazione del memoriale cancellerà permanentemente tutti i dati e i contributi associati.</p>
              <Button variant="destructive" size="sm" @click="isDeleteDialogOpen = true">
                <IconTrash class="size-4 mr-2" />
                Elimina Memoriale
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- Dialogs -->
    <MemorialDialog 
      v-model:open="isEditDialogOpen" 
      :memorial="memorial" 
      @updated="loadMemorialData" 
    />
    <QRCodeDialog
      v-model:open="isQRDialogOpen"
      :memorial="memorial"
    />
    <ConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="Elimina Memoriale"
      description="Sei sicuro di voler eliminare questo memoriale? L'operazione è irreversibile."
      confirm-variant="destructive"
      confirm-text="Elimina definitivamente"
      @confirm="doDeleteMemorial"
    />
  </div>
</template>
