<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconQuote, IconEye, IconEyeOff, IconMail, IconLock } from '@tabler/icons-vue'
import heroImage from '@/assets/auth/login_bg.png'

const router = useRouter()
const { login } = useAuth()

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await login(identifier.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message || 'Errore durante il login'
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
        <img :src="heroImage" alt="RIP Platform" class="w-full h-full object-cover opacity-60 scale-105 select-none" />
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
          "Sempre nei nostri cuori, una luce perenne."
        </h2>
        <p class="text-white/60 font-medium tracking-wide text-sm uppercase">
          L'eccellenza digitale per la memoria
        </p>
      </div>
    </div>

    <!-- Right Column: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
      <div class="w-full max-w-md space-y-8">
        <!-- Logo for mobile -->
        <div class="lg:hidden flex flex-col items-center mb-12">
          <span class="text-3xl font-serif tracking-tighter font-bold text-black leading-none">RIP</span>
          <span class="text-[10px] uppercase tracking-[0.4em] text-[#849a8e] font-bold mt-2">Rest in Pixel</span>
        </div>

        <div class="space-y-2">
          <h1 class="text-4xl font-serif tracking-tight text-black">Bentornato</h1>
          <p class="text-black/50 font-medium">Accedi al tuo pannello gestionale agenzia</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-2">
              <label for="identifier" class="text-xs font-black uppercase tracking-widest text-black/40 ml-1">Email o Username</label>
              <div class="relative group/input">
                <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-black/20 group-focus-within/input:text-[#849a8e] transition-colors" />
                <Input
                  id="identifier"
                  v-model="identifier"
                  type="text"
                  placeholder="m@example.com"
                  required
                  class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-12"
                />
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between ml-1">
                <label for="password" class="text-xs font-black uppercase tracking-widest text-black/40">Password</label>
                <a href="#" class="text-[10px] font-black uppercase tracking-widest text-[#849a8e] hover:underline">Dimenticata?</a>
              </div>
              <div class="relative group/pass">
                <IconLock class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-black/20 group-focus-within/pass:text-[#849a8e] transition-colors" />
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="h-12 bg-white border-black/5 rounded-xl focus-visible:ring-[#849a8e]/30 pl-12 pr-12"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-[#849a8e] transition-colors"
                >
                  <component :is="showPassword ? IconEyeOff : IconEye" class="size-5" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 text-center animate-in fade-in zoom-in duration-300">
            {{ error }}
          </div>

          <div class="pt-2">
            <Button type="submit" :disabled="loading" class="w-full h-14 bg-black hover:bg-black/90 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]">
              {{ loading ? 'Accesso in corso...' : 'Accedi' }}
            </Button>
          </div>
        </form>

        <div class="pt-8 border-t border-black/5 text-center">
          <p class="text-sm font-medium text-black/40">
            Sei un'agenzia funebre? 
            <router-link to="/register" class="text-[#849a8e] font-bold hover:underline ml-1">
              Registrati qui
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
