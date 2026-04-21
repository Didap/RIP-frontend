<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()

const navLinks = [
  { name: 'Come funziona', href: '#how-it-works' },
  { name: 'Funzionalità', href: '#features' },
  { name: 'Memoriali', href: '#showcase' },
  { name: 'Prezzi', href: '#pricing' },
]

const scrollTo = (id: string) => {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-black/5 bg-[#FDFCF6]/80 backdrop-blur-md">
    <div class="container mx-auto flex h-20 items-center justify-between px-6">
      <div class="flex items-center gap-3">
        <span class="text-2xl font-serif tracking-tighter font-bold">RIP</span>
        <span class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 hidden sm:block">Rest in Pixel</span>
      </div>

      <nav class="hidden md:flex items-center gap-10">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href"
          @click.prevent="scrollTo(link.href)"
          class="text-xs font-semibold text-foreground/60 hover:text-foreground transition-colors uppercase tracking-widest"
        >
          {{ link.name }}
        </a>
      </nav>

      <div class="flex items-center gap-4">
        <button 
          @click="router.push('/backoffice')"
          class="text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-foreground px-2"
        >
          Accedi
        </button>
        <Button class="bg-[#1a1a1a] hover:bg-black text-white rounded-lg px-6 h-10 text-xs font-bold tracking-wide">
          Richiedi demo
        </Button>
      </div>
    </div>
  </header>
</template>
