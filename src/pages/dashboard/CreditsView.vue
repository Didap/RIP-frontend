<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { IconWallet, IconHistory, IconPlus } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/useToast'

const { agencyId, user } = useAuth()
const toast = useToast()

const credits = ref(0)
const transactions = ref<any[]>([])
const loading = ref(true)
const recharging = ref(false)

const isAdmin = computed(() => user.value?.role_type === 'agency_admin')

async function loadData() {
  if (!agencyId.value) return
  
  loading.value = true
  try {
    const agencyRes = await fetchApi(`/api/agencies?filters[id][$eq]=${agencyId.value}`)
    const agencyData = Array.isArray(agencyRes.data) ? agencyRes.data[0] : (Array.isArray(agencyRes) ? agencyRes[0] : agencyRes);
    credits.value = agencyData?.credits || 0

    const txRes = await fetchApi(`/api/credit-transactions?filters[agency][id][$eq]=${agencyId.value}&sort=createdAt:desc`)
    transactions.value = txRes.data || []
  } catch (err: any) {
    console.error('Error loading credits', err)
    toast.addToast('Errore nel caricamento del saldo crediti', 'error')
  } finally {
    loading.value = false
  }
}

async function simulateRecharge() {
  if (!agencyId.value || !isAdmin.value) return
  recharging.value = true
  
  try {
    const response = await fetchApi(`/api/agencies/${agencyId.value}/recharge`, {
      method: 'POST',
      body: JSON.stringify({ amount: 1000 })
    })
    credits.value = response.credits || response.data?.credits || (credits.value + 1000)
    toast.addToast('Ricarica effettuata con successo! (+1000 crediti)', 'success')
    await loadData()
  } catch (err: any) {
    console.error('Error recharging', err)
    toast.addToast('Errore durante la ricarica', 'error')
  } finally {
    recharging.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 flex">
    <div class="flex items-center justify-between space-y-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Portale Crediti</h2>
        <p class="text-muted-foreground">
          Gestisci il tuo saldo crediti per generare nuovi Memoriali.
        </p>
      </div>
      <div v-if="isAdmin" class="flex items-center space-x-2">
        <Button @click="simulateRecharge" :disabled="recharging" class="bg-primary text-primary-foreground gap-2">
          <IconPlus class="w-4 h-4" />
          Acquista Crediti (Stripe - in arrivo)
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Saldo Attuale</h3>
          <IconWallet class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="p-6 pt-0">
          <div class="text-3xl font-bold text-primary">{{ credits }}</div>
          <p class="text-xs text-muted-foreground">
            Crediti disponibili
          </p>
        </div>
      </div>
    </div>
    
    <div class="space-y-4">
      <h3 class="text-lg font-medium flex items-center gap-2">
        <IconHistory class="w-5 h-5 text-muted-foreground"/>
        Storico Transazioni
      </h3>
      
      <div class="rounded-md border bg-card">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Operazione</th>
                <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Crediti</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <tr v-if="loading">
                <td colspan="3" class="p-4 text-center text-muted-foreground">Caricamento in corso...</td>
              </tr>
              <tr v-else-if="transactions.length === 0">
                <td colspan="3" class="p-4 text-center text-muted-foreground">Nessuna transazione trovata.</td>
              </tr>
              <tr v-for="tx in transactions" :key="tx.id" class="border-b transition-colors hover:bg-muted/50">
                <td class="p-4 align-middle">
                  {{ new Date(tx.createdAt).toLocaleString('it-IT') }}
                </td>
                <td class="p-4 align-middle">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ tx.description || (tx.type === 'generation' ? 'Generazione Memoriale' : 'Ricarica') }}</span>
                  </div>
                </td>
                <td class="p-4 align-middle text-right">
                  <span :class="tx.amount > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'">
                    {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
