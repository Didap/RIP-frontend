<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { IconCirclePlus, IconLoader2, IconUser, IconCalendar, IconInfoCircle, IconEdit } from '@tabler/icons-vue'

const props = defineProps<{
  open: boolean
  memorial?: any // If provided, we are in EDIT mode
}>()

const emit = defineEmits(['update:open', 'created', 'updated'])

const { agencyId } = useAuth()

// Form Data
const form = ref({
  full_name: '',
  slogan: '',
  birth_date: '',
  death_date: '',
  biography: '',
  owner_id: '',
  link: '',
})

const users = ref<any[]>([])
const loadingUsers = ref(false)
const submitting = ref(false)
const activeTab = ref('general')

const isEditing = computed(() => !!props.memorial)

watch(() => props.open, (newVal) => {
  if (newVal) {
    if (props.memorial) {
      form.value = {
        full_name: props.memorial.full_name || '',
        slogan: props.memorial.slogan || '',
        birth_date: props.memorial.dates?.birth || '',
        death_date: props.memorial.dates?.death || '',
        biography: props.memorial.biography || '',
        owner_id: props.memorial.owner?.id?.toString() || '',
        link: props.memorial.link || '',
      }
    } else {
      resetForm()
    }
    loadUsers()
  }
})

async function loadUsers() {
  loadingUsers.value = true
  try {
    const response = await fetchApi('/api/users?sort=username:asc')
    users.value = Array.isArray(response) ? response : (response.data ?? [])
  } catch (error) {
    console.error('Errore caricamento utenti:', error)
  } finally {
    loadingUsers.value = false
  }
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function handleSave() {
  if (!form.value.full_name || !agencyId.value) return

  submitting.value = true
  try {
    const datesJson = {
      birth: form.value.birth_date,
      death: form.value.death_date
    }

    const data: any = {
      full_name: form.value.full_name,
      slogan: form.value.slogan,
      dates: datesJson,
      biography: form.value.biography,
      agency: parseInt(agencyId.value.toString()),
      link: form.value.link,
    }

    if (!isEditing.value) {
      data.slug = generateSlug(form.value.full_name) + '-' + Math.floor(Math.random() * 1000)
      data.lifecycle_status = 'draft'
    }

    if (isEditing.value) {
      await fetchApi(`/api/tombstones/${props.memorial.id}`, {
        method: 'PUT',
        body: JSON.stringify({ data }),
      })

      // Update owner if changed
      if (form.value.owner_id && form.value.owner_id !== props.memorial.owner?.id?.toString()) {
         // This logic might need refinement depending on how permissions are structured
         // For now, let's assume we create/update the owner permission
         await updateOwnerPermission(props.memorial.id, parseInt(form.value.owner_id))
      }

      emit('updated')
    } else {
      const tombstoneRes = await fetchApi('/api/tombstones', {
        method: 'POST',
        body: JSON.stringify({ data }),
      })

      const newTombstoneId = tombstoneRes.data?.id || tombstoneRes.id

      if (form.value.owner_id) {
        await updateOwnerPermission(newTombstoneId, parseInt(form.value.owner_id))
      }

      emit('created')
    }

    emit('update:open', false)
    resetForm()
  } catch (error: any) {
    console.error('Errore salvataggio memoriale:', error)
    alert(error.message || 'Errore durante il salvataggio')
  } finally {
    submitting.value = false
  }
}

async function updateOwnerPermission(tombstoneId: number, userId: number) {
  // Simple logic: try to find existing owner permission or just create a new one
  // Typically you'd delete old ones if switching owners
  await fetchApi('/api/tombstone-permissions', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        user: userId,
        tombstone: tombstoneId,
        access_level: 'owner',
      },
    }),
  })
}

function resetForm() {
  form.value = {
    full_name: '',
    slogan: '',
    birth_date: '',
    death_date: '',
    biography: '',
    owner_id: '',
    link: '',
  }
  activeTab.value = 'general'
}

onMounted(loadUsers)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
      <DialogHeader class="p-6 bg-primary text-primary-foreground">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/10 rounded-lg">
             <component :is="isEditing ? IconEdit : IconCirclePlus" class="size-6" />
          </div>
          <div>
            <DialogTitle class="text-xl">{{ isEditing ? 'Modifica Memoriale' : 'Nuovo Memoriale' }}</DialogTitle>
            <DialogDescription class="text-primary-foreground/70">
              {{ isEditing ? 'Aggiorna i dati della lapide digitale.' : 'Compila tutti i campi per pubblicare una nuova lapide digitale.' }}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="p-6">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="general" class="gap-2">
              <IconInfoCircle class="size-4" /> Generale
            </TabsTrigger>
            <TabsTrigger value="details" class="gap-2">
              <IconCalendar class="size-4" /> Dettagli
            </TabsTrigger>
            <TabsTrigger value="assignment" class="gap-2">
              <IconUser class="size-4" /> Owner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" class="space-y-4 py-2">
            <div class="grid gap-2">
              <Label for="full_name" class="font-bold">Nome Completo</Label>
              <Input 
                id="full_name" 
                v-model="form.full_name" 
                placeholder="Nome e Cognome del defunto" 
                class="h-11"
              />
            </div>
            <div class="grid gap-2">
              <Label for="slogan" class="font-bold">Slogan / Citazione</Label>
              <Input 
                id="slogan" 
                v-model="form.slogan" 
                placeholder="Esempio: Per sempre nel nostro cuore" 
                class="h-11"
              />
            </div>
            <div class="grid gap-2">
              <Label for="link" class="font-bold">Link Memoriale (Destinazione QR)</Label>
              <Input 
                id="link" 
                v-model="form.link" 
                placeholder="Esempio: https://link/mario-rossi" 
                class="h-11"
              />
              <p class="text-[10px] text-muted-foreground">Se lasciato vuoto, il QR punterà all'URL predefinito del sistema.</p>
            </div>
            <div class="grid gap-2">
              <Label for="biography" class="font-bold">Biografia Breve</Label>
              <textarea 
                id="biography" 
                v-model="form.biography"
                class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Racchiudi qui i momenti salienti di una vita..."
              />
            </div>
          </TabsContent>

          <TabsContent value="details" class="space-y-4 py-2">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label for="birth_date" class="font-bold">Data di Nascita</Label>
                <Input id="birth_date" type="date" v-model="form.birth_date" />
              </div>
              <div class="grid gap-2">
                <Label for="death_date" class="font-bold">Data di Morte</Label>
                <Input id="death_date" type="date" v-model="form.death_date" />
              </div>
            </div>
            <div class="p-4 bg-muted/30 rounded-lg border border-border/50">
               <p class="text-[11px] text-muted-foreground leading-relaxed">
                  <span class="font-bold block mb-1">Nota sulle immagini</span>
                  Le immagini del profilo e della copertina potranno essere caricate nella sezione di modifica avanzata dopo la creazione iniziale.
               </p>
            </div>
          </TabsContent>

          <TabsContent value="assignment" class="space-y-4 py-2">
            <div class="grid gap-2">
              <Label class="font-bold">Assegnazione Gestione</Label>
              <Select v-model="form.owner_id">
                <SelectTrigger class="h-11">
                  <SelectValue :placeholder="loadingUsers ? 'Caricamento...' : 'Seleziona il cliente responsabile'" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="user in users" :key="user.id" :value="user.id.toString()">
                      {{ user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p class="text-[11px] text-muted-foreground mt-2">
                L'utente selezionato riceverà i permessi 'Owner' e potrà gestire i contenuti del memoriale.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DialogFooter class="p-6 bg-muted/20 border-t border-border/50">
        <Button variant="ghost" @click="emit('update:open', false)" :disabled="submitting">Annulla</Button>
        <Button 
          :disabled="!form.full_name || !form.owner_id || submitting"
          @click="handleSave"
          class="min-w-[140px]"
        >
          <IconLoader2 v-if="submitting" class="mr-2 size-4 animate-spin" />
          <span v-else>{{ isEditing ? 'Salva Modifiche' : 'Crea Memoriale' }}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
