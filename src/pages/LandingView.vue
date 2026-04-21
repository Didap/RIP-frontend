<script setup lang="ts">
import { 
  IconCheck, 
  IconArrowRight, 
  IconLayoutDashboard, 
  IconArchive, 
  IconPalette, 
  IconChartBar, 
  IconFileInvoice, 
  IconUsers,
  IconHeart,
  IconBook,
  IconFlame,
  IconQrcode,
  IconPhoto
} from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import LandingHeader from '@/components/landing/LandingHeader.vue'

// Assets
import heroImage from '@/assets/landing/hero_landing.png'
import showcaseImage from '@/assets/landing/showcase_landing.png'

const pricingPlans = [
  {
    name: 'Essential',
    description: 'Per piccole agenzie che iniziano con i memoriali digitali.',
    price: '49',
    features: ['Fino a 30 memoriali / mese', '1 sede, 2 operatori', 'QR code per lapide', 'Hosting in Italia', 'Supporto via email'],
    cta: 'Inizia ora',
    featured: false
  },
  {
    name: 'Professional',
    badge: 'CONSIGLIATO',
    description: 'Per agenzie strutturate con più sedi e branding completo.',
    price: '129',
    features: ['Memoriali illimitati', 'Operatori illimitati', 'Branding white-label', 'Statistiche & report', 'Pagamenti integrati', 'Supporto prioritario'],
    cta: 'Richiedi demo',
    featured: true
  },
  {
    name: 'Enterprise',
    description: 'Per gruppi e network nazionali con esigenze dedicate.',
    price: 'Su misura',
    features: ['Tutto di Professional', 'API & integrazioni', 'SLA dedicato 99,9%', 'Formazione on-site', 'Account manager'],
    cta: 'Contattaci',
    featured: false
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#FDFCF6] text-[#1a1a1a] selection:bg-[#849a8e]/20">
    <LandingHeader />

    <!-- Hero Section: Balanced to fit Viewport -->
    <section class="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex items-center py-12 lg:py-0">
      <div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
        <div class="space-y-10 animate-in fade-in slide-in-from-left duration-1000">
          <div class="space-y-4">
            <p class="text-[11px] uppercase tracking-[0.4em] text-[#849a8e] font-bold">Per onoranze funebri</p>
            <h1 class="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.95] tracking-tight">
              La memoria, <br/>
              <span class="text-[#849a8e]/80 italic">in pixel</span>. <br/>Per sempre.
            </h1>
          </div>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            App e gestionale per offrire alle famiglie memoriali digitali eleganti, duraturi e condivisibili. Un luogo dignitoso per onorare il ricordo.
          </p>
          <div class="flex flex-wrap items-center gap-6 pt-2">
            <Button class="bg-[#1a1a1a] hover:bg-black text-white rounded-lg px-10 h-14 text-base font-bold transition-all hover:scale-105 shadow-2xl shadow-black/10">
              Richiedi una demo
            </Button>
            <a href="#showcase" class="flex items-center gap-2 group font-semibold text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors">
              Esempi reali 
              <IconArrowRight class="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          
          <div class="flex flex-wrap items-center gap-x-8 gap-y-4 pt-10 border-t border-black/5 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            <span class="flex items-center gap-2"><div class="size-1 bg-[#849a8e] rounded-full"></div> GDPR Ready</span>
            <span class="flex items-center gap-2"><div class="size-1 bg-[#849a8e] rounded-full"></div> White-label</span>
            <span class="flex items-center gap-2"><div class="size-1 bg-[#849a8e] rounded-full"></div> Hosting IT</span>
          </div>
        </div>

        <!-- Hero Image: Adjusted for Viewport height -->
        <div class="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
          <div class="aspect-[4/4.5] max-h-[70vh] rounded-4xl overflow-hidden shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] border border-black/5 relative group">
            <img :src="heroImage" alt="Memorial Hero" class="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
          </div>
          <!-- Floating Note -->
          <div class="absolute bottom-10 -left-12 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-[280px] border border-black/5 animate-bounce-slow">
            <IconQuote class="size-5 text-[#849a8e] mb-2 opacity-50" />
            <p class="font-serif italic text-xl leading-tight">"Sempre nei nostri cuori"</p>
            <p class="text-[9px] uppercase tracking-widest text-muted-foreground mt-4 font-bold">Memoriale di Maria R.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps -->
    <section id="how-it-works" class="py-40 lg:py-56 bg-white border-y border-black/5">
      <div class="container mx-auto px-6">
        <div class="space-y-4 mb-24">
          <p class="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold">Il processo</p>
          <h2 class="text-6xl font-serif leading-tight max-w-2xl">Tre passi, un ricordo che <span class="italic text-[#849a8e]">difficilmente</span> sbiadisce.</h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-16 lg:gap-24">
          <div v-for="(step, i) in [
            { t: 'L\'agenzia crea', d: 'Dal gestionale RIP generi in un minuto un memoriale precompilato.', n: '01' },
            { t: 'La famiglia cura', d: 'Ricevono un link sicuro per aggiungere foto, video e ricordi intimi.', n: '02' },
            { t: 'Resta online', d: 'Un luogo protetto e permanente per ricordare ovunque e sempre.', n: '03' }
          ]" :key="i" class="space-y-8 group">
            <span class="text-6xl font-serif text-[#849a8e]/20 group-hover:text-[#849a8e] transition-colors duration-500">{{ step.n }}</span>
            <div class="space-y-4">
              <h3 class="text-2xl font-serif">{{ step.t }}</h3>
              <p class="text-muted-foreground leading-relaxed">{{ step.d }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-40 lg:py-56">
      <div class="container mx-auto px-6">
        <div class="space-y-4 mb-32 text-center lg:text-left">
          <p class="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold">Funzionalità</p>
          <h2 class="text-6xl font-serif max-w-3xl leading-tight">Uno strumento per voi. <br/> Un dono per le famiglie.</h2>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <!-- Agency Card -->
          <div class="bg-white rounded-[3rem] p-16 lg:p-20 border border-black/5 shadow-2xl shadow-black/2 space-y-12 transition-all hover:border-[#849a8e]/20">
            <div class="space-y-4">
              <p class="text-[11px] uppercase tracking-widest text-[#849a8e] font-bold">Per la tua agenzia</p>
              <h3 class="text-4xl font-serif font-medium">Gestionale web</h3>
              <p class="text-muted-foreground leading-relaxed">Controllo totale su pratiche e memoriali in un\'unica piattaforma intuitiva.</p>
            </div>
            <div class="grid grid-cols-2 gap-y-12 gap-x-8">
              <div v-for="f in [
                { t: 'Dashboard', i: IconLayoutDashboard }, { t: 'Archivio', i: IconArchive },
                { t: 'Branding', i: IconPalette }, { t: 'Statistiche', i: IconChartBar },
                { t: 'Fatture', i: IconFileInvoice }, { t: 'Team', i: IconUsers }
              ]" :key="f.t" class="flex items-center gap-4">
                <div class="p-4 bg-slate-50 rounded-2xl"><component :is="f.i" class="size-6 text-slate-400" /></div>
                <span class="text-xs font-bold tracking-widest uppercase opacity-80">{{ f.t }}</span>
              </div>
            </div>
          </div>

          <!-- Family Card -->
          <div class="bg-white rounded-[3rem] p-16 lg:p-20 border border-black/5 shadow-2xl shadow-black/2 space-y-12 transition-all hover:border-[#d8b4a0]/20">
            <div class="space-y-4">
              <p class="text-[11px] uppercase tracking-widest text-[#d8b4a0] font-bold">Per le famiglie</p>
              <h3 class="text-4xl font-serif font-medium">Esperienza Mobile</h3>
              <p class="text-muted-foreground leading-relaxed">Un luogo intimo per raccogliere e condividere i ricordi più preziosi.</p>
            </div>
            <div class="grid grid-cols-2 gap-y-12 gap-x-8">
              <div v-for="f in [
                { t: 'Ricordi', i: IconHeart }, { t: 'Galleria', i: IconPhoto },
                { t: 'Libro', i: IconBook }, { t: 'Candele', i: IconFlame },
                { t: 'Donazioni', i: IconUsers }, { t: 'QR Code', i: IconQrcode }
              ]" :key="f.t" class="flex items-center gap-4">
                <div class="p-4 bg-orange-50 rounded-2xl"><component :is="f.i" class="size-6 text-[#d8b4a0]" /></div>
                <span class="text-xs font-bold tracking-widest uppercase opacity-80">{{ f.t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Showcase -->
    <section id="showcase" class="py-40 lg:py-56 bg-[#F8F7F2]">
      <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-24">
          <div class="space-y-6">
            <p class="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold">Esempi</p>
            <h2 class="text-6xl font-serif leading-tight">Memoriali curati <br/>nei dettagli.</h2>
          </div>
          <p class="max-w-md text-lg text-muted-foreground leading-relaxed">Ogni memoriale racconta una vita. Persone, animali — tutti meritano un ricordo bello, accessible e duraturo. Un luogo dove l'amore continua a vivere.</p>
        </div>

        <div class="aspect-16/6 rounded-4xl overflow-hidden shadow-2xl relative group border border-black/5">
          <img :src="showcaseImage" alt="Showcase" class="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-700"></div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-40 lg:py-56 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center space-y-6 mb-32">
          <p class="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold">I piani</p>
          <h2 class="text-6xl font-serif">Trasparente. Senza vincoli.</h2>
        </div>

        <div class="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div 
            v-for="plan in pricingPlans" 
            :key="plan.name"
            :class="[
              'rounded-[3rem] p-12 lg:p-16 border border-black/5 flex flex-col transition-all duration-500 hover:shadow-[0_48px_96px_-32px_rgba(0,0,0,0.08)] hover:-translate-y-2',
              plan.featured ? 'bg-[#FDFCF6] shadow-2xl relative z-10' : 'bg-transparent'
            ]"
          >
            <div v-if="plan.badge" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#849a8e] text-white text-[9px] font-bold tracking-widest px-6 py-2 rounded-full uppercase">
              {{ plan.badge }}
            </div>
            <div class="mb-12 space-y-6">
              <h3 class="text-3xl font-serif">{{ plan.name }}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed h-12">{{ plan.description }}</p>
              <div class="pt-8 flex items-baseline gap-1">
                <span class="text-4xl font-serif">€</span>
                <span class="text-7xl font-serif tracking-tighter">{{ plan.price }}</span>
                <span v-if="plan.price !== 'Su misura'" class="text-sm font-bold uppercase tracking-widest opacity-40 ml-2">/mese</span>
              </div>
            </div>
            
            <ul class="space-y-6 mb-16 flex-grow">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-4 text-sm font-medium">
                <IconCheck class="size-5 text-[#849a8e] mt-0.5" />
                <span class="opacity-80">{{ feature }}</span>
              </li>
            </ul>

            <Button :class="[
              'w-full h-16 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all',
              plan.featured ? 'bg-[#1a1a1a] hover:bg-black text-white shadow-xl shadow-black/10' : 'bg-black/5 hover:bg-black/10 text-black'
            ]">
              {{ plan.cta }}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-24 border-t border-black/5">
      <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
        <div class="flex items-center gap-3">
          <span class="text-2xl font-serif tracking-tighter font-bold">RIP</span>
          <div class="h-4 w-px bg-black/10 mx-1"></div>
          <span class="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mt-1">Rest in Pixel</span>
        </div>
        <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold italic">© 2024 Rest in Pixel. Dignity in every pixel.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce-slow 4s infinite ease-in-out;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
