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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { 
  IconCirclePlus, 
  IconLoader2, 
  IconUser, 
  IconCalendar, 
  IconInfoCircle, 
  IconEdit,
  IconArrowRight,
  IconArrowLeft
} from '@tabler/icons-vue'
import WizardStepper from '@/components/WizardStepper.vue'

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

// Tabs State (Edit Mode)
const activeTab = ref('general')

// Wizard State (Create Mode)
const currentStep = ref(1)
const wizardSteps = ['Identità', 'Storia', 'Impostazioni', 'Assegnazione']

const isEditing = computed(() => !!props.memorial)

// Validation per step
const canProceed = computed(() => {
  if (isEditing.value) return true;
  
  switch (currentStep.value) {
    case 1:
      return form.value.full_name.trim().length > 0;
    case 2:
    case 3:
      return true; // Optional fields
    case 4:
      return form.value.owner_id !== '';
    default:
      return false;
  }
})

function goNext() {
  if (canProceed.value && currentStep.value < wizardSteps.length) {
    currentStep.value++
  }
}

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

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
  currentStep.value = 1
}

onMounted(loadUsers)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
      <DialogHeader class="p-6 bg-primary text-primary-foreground relative z-10">
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

      <div class="p-6 bg-background">
        <!-- EDIT MODE (Tabs) -->
        <Tabs v-if="isEditing" v-model="activeTab" class="w-full">
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
              <Label for="edit_full_name" class="font-bold">Nome Completo <span class="text-destructive">*</span></Label>
              <Input id="edit_full_name" v-model="form.full_name" placeholder="Nome e Cognome del defunto" class="h-11" />
            </div>
            <div class="grid gap-2">
              <Label for="edit_slogan" class="font-bold">Slogan / Citazione</Label>
              <Input id="edit_slogan" v-model="form.slogan" placeholder="Esempio: Per sempre nel nostro cuore" class="h-11" />
            </div>
            <div class="grid gap-2">
              <Label for="edit_link" class="font-bold">Link Memoriale (Destinazione QR)</Label>
              <Input id="edit_link" v-model="form.link" placeholder="Esempio: https://link/mario-rossi" class="h-11" />
              <p class="text-[10px] text-muted-foreground">Se lasciato vuoto, il QR punterà all'URL predefinito del sistema.</p>
            </div>
            <div class="grid gap-2">
              <Label for="edit_biography" class="font-bold">Biografia Breve</Label>
              <textarea 
                id="edit_biography" 
                v-model="form.biography"
                class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Racchiudi qui i momenti salienti di una vita..."
              />
            </div>
          </TabsContent>

          <TabsContent value="details" class="space-y-4 py-2">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label for="edit_birth_date" class="font-bold">Data di Nascita</Label>
                <Input id="edit_birth_date" type="date" v-model="form.birth_date" />
              </div>
              <div class="grid gap-2">
                <Label for="edit_death_date" class="font-bold">Data di Morte</Label>
                <Input id="edit_death_date" type="date" v-model="form.death_date" />
              </div>
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
            </div>
          </TabsContent>
        </Tabs>

        <!-- CREATE MODE (Wizard) -->
        <div v-else class="space-y-8 mt-2">
          <div class="px-4 pb-6">
            <WizardStepper :steps="wizardSteps" :currentStep="currentStep" />
          </div>

          <div class="relative overflow-hidden min-h-[300px]">
            <Transition name="slide-fade" mode="out-in">
              <!-- Step 1: Identità -->
              <div v-if="currentStep === 1" class="space-y-4" key="step1">
                <div class="grid gap-2">
                  <Label for="full_name" class="font-bold">Nome Completo <span class="text-destructive">*</span></Label>
                  <Input 
                    id="full_name" 
                    v-model="form.full_name" 
                    placeholder="Nome e Cognome" 
                    class="h-11"
                    autocomplete="off"
                  />
                  <p class="text-[11px] text-muted-foreground">Questo sarà il nome principale visualizzato sul memoriale.</p>
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
              </div>
              
              <!-- Step 2: Storia -->
              <div v-else-if="currentStep === 2" class="space-y-4" key="step2">
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
                <div class="grid gap-2 pt-2">
                  <Label for="biography" class="font-bold">Biografia Breve</Label>
                  <textarea 
                    id="biography" 
                    v-model="form.biography"
                    class="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Racconta i momenti importanti della sua vita..."
                  />
                </div>
              </div>

              <!-- Step 3: Impostazioni -->
              <div v-else-if="currentStep === 3" class="space-y-4" key="step3">
                <div class="p-5 bg-muted/30 rounded-xl border border-border/50 text-sm leading-relaxed mb-4">
                  <span class="font-semibold flex items-center gap-2 mb-2">
                    <IconInfoCircle class="size-4 text-primary" /> Info QR Code
                  </span>
                  Configura dove punterà il codice QR associato a questa lapide prima di essere applicato.
                </div>
                <div class="grid gap-2">
                  <Label for="link" class="font-bold">Link Personalizzato (Opzionale)</Label>
                  <Input 
                    id="link" 
                    v-model="form.link" 
                    placeholder="https://" 
                    class="h-11"
                  />
                  <p class="text-[11px] text-muted-foreground">Se lasciato vuoto, il QR punterà alla pagina standard del memoriale generata per lui/lei.</p>
                </div>
              </div>

              <!-- Step 4: Assegnazione -->
              <div v-else-if="currentStep === 4" class="space-y-4" key="step4">
                <div class="grid gap-2">
                  <Label class="font-bold">Assegnazione Cliente <span class="text-destructive">*</span></Label>
                  <Select v-model="form.owner_id">
                    <SelectTrigger class="h-11">
                      <SelectValue :placeholder="loadingUsers ? 'Caricamento clienti...' : 'Seleziona un cliente'" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="user in users" :key="user.id" :value="user.id.toString()">
                          <div class="flex items-center gap-2">
                            <IconUser class="size-4 text-muted-foreground" />
                            <span>{{ user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username }}</span>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p class="text-[11px] text-muted-foreground mt-2">
                    Il cliente selezionato avrà i privilegi di proprietario e potrà modificare contenuti e media per questo memoriale.
                  </p>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <DialogFooter class="p-6 bg-muted/30 border-t border-border/50 items-center">
        <!-- EDIT FOOTER -->
        <template v-if="isEditing">
          <Button variant="ghost" @click="emit('update:open', false)" :disabled="submitting">Annulla</Button>
          <Button 
            :disabled="!form.full_name || submitting"
            @click="handleSave"
            class="min-w-[150px]"
          >
            <IconLoader2 v-if="submitting" class="mr-2 size-4 animate-spin" />
            <span v-else>Salva Modifiche</span>
          </Button>
        </template>

        <!-- WIZARD FOOTER -->
        <template v-else>
          <div class="w-full flex justify-between items-center">
            <Button 
              v-if="currentStep === 1" 
              variant="ghost" 
              @click="emit('update:open', false)" 
              :disabled="submitting"
            >
              Annulla
            </Button>
            <Button 
              v-else 
              variant="outline" 
              @click="goBack" 
              :disabled="submitting"
            >
              <IconArrowLeft class="size-4 mr-2" /> Indietro
            </Button>

            <Button 
              v-if="currentStep < wizardSteps.length" 
              @click="goNext" 
              :disabled="!canProceed"
              class="min-w-[120px]"
            >
              Avanti <IconArrowRight class="size-4 ml-2" />
            </Button>
            <Button 
              v-else 
              :disabled="!canProceed || submitting" 
              @click="handleSave"
              class="min-w-[160px]"
            >
              <IconLoader2 v-if="submitting" class="mr-2 size-4 animate-spin" />
              <span v-else>Crea Memoriale</span>
            </Button>
          </div>
        </template>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(15px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-15px);
  opacity: 0;
}
</style>
