<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { API_URL } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconQuote, IconCircleCheck, IconEye, IconEyeOff, IconMail, IconLock, IconBuilding, IconHash, IconPhone } from '@tabler/icons-vue'
import showcaseImage from '@/assets/auth/register_bg.png'

const router = useRouter()

const agencyName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const vatNumber = ref('')
const phone = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const error = ref('')
const success = ref(false)
const loading = ref(false)

async function handleSubmit() {
  error.value = ''

  if (!agencyName.value.trim()) {
    error.value = 'Inserisci il nome dell\'agenzia'
    return
  }
  if (!email.value.trim()) {
    error.value = 'Inserisci un\'email valida'
    return
  }
  if (password.value.length < 6) {
    error.value = 'La password deve contenere almeno 6 caratteri'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Le password non coincidono'
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${API_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agency_name: agencyName.value.trim(),
        email: email.value.trim(),
        password: password.value,
        vat_number: vatNumber.value.trim() || undefined,
        phone: phone.value.trim() || undefined,
      }),
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData?.error?.message || 'Errore durante la registrazione')
    }

    success.value = true
  } catch (e: any) {
    error.value = e.message || 'Errore durante la registrazione'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh bg-[#FDFCF6]">
    <!-- Left Column: Visual & Branding (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black p-12 flex-col justify-between">
      <div class="absolute inset-0 z-0">
        <img :src="showcaseImage" alt="RIP Showcase" class="w-full h-full object-cover opacity-60 scale-105 select-none" />
        <div class="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60"></div>
      </div>
      
      <div class="relative z-10">
        <router-link to="/" class="inline-flex flex-col group">
          <span class="text-3xl font-serif tracking-tighter font-bold text-white leading-none">RIP</span>
          <span class="text-[10px] uppercase tracking-[0.4em] text-[#849a8e] font-bold mt-2">Rest in Pixel</span>
        </router-link>
      </div>

      <div class="relative z-10 max-w-md">
        <IconQuote class="size-8 text-[#849a8e] mb-6 opacity-80" />
        <h2 class="text-4xl font-serif italic text-white leading-tight mb-4">
          "Ogni pagina è un tributo unico, disegnato per durare."
        </h2>
        <p class="text-white/60 font-medium tracking-wide text-sm uppercase">
          Unisciti alla rete RIP
        </p>
      </div>
    </div>

    <!-- Right Column: Register Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
      <div class="w-full max-w-md space-y-8 py-12 lg:py-0">
        <!-- Logo for mobile -->
        <div class="lg:hidden flex flex-col items-center mb-12">
          <span class="text-3xl font-serif tracking-tighter font-bold text-black leading-none">RIP</span>
          <span class="text-[10px] uppercase tracking-[0.4em] text-[#849a8e] font-bold mt-2">Rest in Pixel</span>
        </div>

        <!-- Success State -->
        <div v-if="success" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="space-y-4 text-center lg:text-left">
            <div class="inline-flex size-16 items-center justify-center rounded-full bg-[#849a8e]/10 mb-2">
              <IconCircleCheck class="size-8 text-[#849a8e]" />
            </div>
            <h1 class="text-4xl font-serif tracking-tight text-black">Email inviata</h1>
            <p class="text-black/50 font-medium leading-relaxed">
              Abbiamo inviato un'email di conferma a <strong class="text-black">{{ email }}</strong>. 
              Segui il link per attivare il tuo profilo agenzia.
            </p>
          </div>
          
          <Button @click="router.push('/backoffice')" class="w-full h-14 bg-black hover:bg-black/90 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl">
            Vai al login
          </Button>
        </div>

        <!-- Form State -->
        <template v-else>
          <div class="space-y-2">
            <h1 class="text-4xl font-serif tracking-tight text-black">Nuova Agenzia</h1>
            <p class="text-black/50 font-medium">Digitalizza il ricordo e offri un servizio d'eccellenza</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="agency_name" class="text-xs font-black uppercase tracking-widest text-black/40 ml-1">Nome Agenzia *</label>
                <div class="relative group/input">
                  <IconBuilding class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/20 group-focus-within/input:text-[#849a8e] transition-colors" />
                  <Input
                    id="agency_name"
                    v-model="agencyName"
                    type="text"
                    placeholder="Onoranze Funebri Esempio"
                    required
                    class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-10"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="email" class="text-xs font-black uppercase tracking-widest text-black/40 ml-1">Email Aziendale *</label>
                <div class="relative group/input">
                  <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/20 group-focus-within/input:text-[#849a8e] transition-colors" />
                  <Input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="info@agenzia.com"
                    required
                    class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-10"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="vat_number" class="text-xs font-black uppercase tracking-widest text-black/40 ml-1">Partita IVA</label>
                  <div class="relative group/input">
                    <IconHash class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/20 group-focus-within/input:text-[#849a8e] transition-colors" />
                    <Input
                      id="vat_number"
                      v-model="vatNumber"
                      type="text"
                      placeholder="IT0123..."
                      class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-10"
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="phone" class="text-xs font-black uppercase tracking-widest text-black/40 ml-1">Telefono</label>
                  <div class="relative group/input">
                    <IconPhone class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/20 group-focus-within/input:text-[#849a8e] transition-colors" />
                    <Input
                      id="phone"
                      v-model="phone"
                      type="tel"
                      placeholder="02..."
                      class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-10"
                    />
                  </div>
                </div>
              </div>

              <div class="my-4 h-px bg-black/5" />

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="password" class="text-xs font-black uppercase tracking-widest text-black/40 ml-1">Password *</label>
                  <div class="relative group/pass">
                    <IconLock class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/20 group-focus-within/pass:text-[#849a8e] transition-colors" />
                    <Input
                      id="password"
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-10 pr-10"
                    />
                    <button 
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-[#849a8e] transition-colors"
                    >
                      <component :is="showPassword ? IconEyeOff : IconEye" class="size-4" />
                    </button>
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="confirm_password" class="text-xs font-black uppercase tracking-widest text-black/40 ml-1">Conferma *</label>
                  <div class="relative group/pass">
                    <IconLock class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/20 group-focus-within/pass:text-[#849a8e] transition-colors" />
                    <Input
                      id="confirm_password"
                      v-model="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      required
                      class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-10 pr-10"
                    />
                    <button 
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-[#849a8e] transition-colors"
                    >
                      <component :is="showConfirmPassword ? IconEyeOff : IconEye" class="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="error" class="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 text-center animate-in fade-in zoom-in duration-300">
              {{ error }}
            </div>

            <div class="pt-2">
              <Button type="submit" :disabled="loading" class="w-full h-14 bg-black hover:bg-black/90 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]">
                {{ loading ? 'Registrazione in corso...' : 'Registra Agenzia' }}
              </Button>
            </div>
          </form>

          <div class="pt-8 border-t border-black/5 text-center">
            <p class="text-sm font-medium text-black/40">
              Hai già un account? 
              <router-link to="/backoffice" class="text-[#849a8e] font-bold hover:underline ml-1">
                Accedi qui
              </router-link>
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
