<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Come funziona', href: '#how-it-works' },
  { name: 'Funzionalità', href: '#features' },
  { name: 'Memoriali', href: '#showcase' },
  { name: 'Prezzi', href: '#pricing' },
]

const scrollTo = (id: string) => {
  const el = document.querySelector(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    isMobileMenuOpen.value = false
  }
}
</script>

<template>
  <header class="fixed top-0 z-50 w-full bg-[#FDFCF6]/80 backdrop-blur-xl border-b border-black/3 transition-all duration-300">
    <div class="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 md:px-12">
      <!-- Logo -->
      <div class="flex items-center gap-4 group cursor-pointer" @click="router.push('/')">
        <div class="flex flex-col">
          <span class="text-2xl font-serif tracking-tighter font-bold leading-none">RIP</span>
          <span class="text-[9px] lg:text-[10px] uppercase tracking-[0.4em] text-[#849a8e] font-bold mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">Rest in Pixel</span>
        </div>
      </div>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-12">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href"
          @click.prevent="scrollTo(link.href)"
          class="text-xs font-bold text-black/50 hover:text-black transition-all uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#849a8e] hover:after:w-full after:transition-all"
        >
          {{ link.name }}
        </a>
      </nav>

      <!-- Desktop Actions -->
      <div class="hidden lg:flex items-center gap-6">
        <button 
          @click="router.push('/backoffice')"
          class="text-[11px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors"
        >
          Accedi
        </button>
        <Button class="bg-[#1a1a1a] hover:bg-black text-white rounded-lg px-6 h-10 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-black/5 hover:shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Richiedi demo
        </Button>
      </div>

      <!-- Mobile Menu Toggle -->
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="lg:hidden fixed top-6 right-6 z-70 size-12 rounded-full bg-white border border-black/5 flex flex-col items-center justify-center gap-1 shadow-xl"
      >
        <div class="w-6 h-0.5 bg-black transition-transform duration-300" :class="isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''"></div>
        <div class="w-6 h-0.5 bg-black transition-opacity duration-300" :class="isMobileMenuOpen ? 'opacity-0' : ''"></div>
        <div class="w-6 h-0.5 bg-black transition-transform duration-300" :class="isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"></div>
      </button>

      <!-- Mobile Menu Overlay -->
      <div 
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-[#FDFCF6] z-60 lg:hidden flex flex-col p-8 pt-24"
      >
        <nav class="flex flex-col gap-8">
          <a 
            v-for="link in navLinks" 
            :key="link.name" 
            :href="link.href"
            @click.prevent="scrollTo(link.href)"
            class="text-3xl font-serif tracking-tighter text-black/80 hover:text-black transition-colors"
          >
            {{ link.name }}
          </a>
        </nav>
        
        <div class="mt-auto space-y-4">
          <Button class="w-full bg-black text-white h-14 rounded-xl text-xs font-bold uppercase tracking-widest">Accedi</Button>
          <Button variant="outline" class="w-full h-14 rounded-xl text-xs font-bold uppercase tracking-widest border-black/10">Richiedi demo</Button>
        </div>
      </div>
    </div>
  </header>
</template>
