<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IconCheck,
  IconArrowRight, 
  IconLayoutDashboard, 
  IconHeart,
  IconQuote,
  IconQrcode as IconQR,
  IconPhoto,
  IconMessage,
  IconCloud,
  IconUsers,
  IconShieldCheck,
  IconCertificate,
  IconPlus,
  IconMinus
} from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import LandingHeader from '@/components/landing/LandingHeader.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Assets
import heroImage from '@/assets/landing/hero_landing.png'
import showcaseImage from '@/assets/landing/showcase_landing.png'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()

const handlePricingClick = (link: string) => {
  if (link.startsWith('mailto:')) {
    window.location.href = link
  } else if (link.startsWith('#')) {
    const el = document.getElementById(link.substring(1))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    router.push(link)
  }
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const billingCycle = ref<'monthly' | 'yearly'>('monthly')

const steps = [
  { title: 'L\'agenzia crea', desc: 'Generi in un minuto un memoriale precompilato pronto per la condivisione.' },
  { title: 'La famiglia cura', desc: 'Ricevono un link sicuro per aggiungere foto, video e pensieri in totale privacy.' },
  { title: 'Resta online', desc: 'Un luogo protetto, dignitoso e permanente per ricordare ovunque e per sempre.' }
]

const features = [
  { icon: IconLayoutDashboard, title: 'Gestionale Cloud', desc: 'Pratiche e memoriali sotto controllo da un\'unica dashboard intuitiva.' },
  { icon: IconQR, title: 'QR Code Lapide', desc: 'Un ponte tra fisico e digitale: scansione diretta dalla lapide al memoriale.' },
  { icon: IconCloud, title: 'Archivio Eterno', desc: 'Hosting sicuro e ridondato per garantire che i ricordi restino online per sempre.' },
  { icon: IconUsers, title: 'Multi-Operatore', desc: 'Gestisci il tuo team e assegna permessi diversi per ogni collaboratore.' },
  { icon: IconPhoto, title: 'Galleria Media', desc: 'Supporto per foto in alta risoluzione e video tributi per una narrazione ricca.' },
  { icon: IconMessage, title: 'Libro dei Pensieri', desc: 'Spazio dedicato a messaggi di cordoglio e aneddoti da parte di amici e parenti.' }
]

const stats = [
  { label: 'Agenzie Partner', value: '120+' },
  { label: 'Memoriali Attivi', value: '5k+' },
  { label: 'Uptime Garantito', value: '99.9%' },
  { label: 'Pensieri Condivisi', value: '25k+' }
]

const testimonials = [
  {
    name: 'Marco Valente',
    role: 'Titolare, Onoranze Valente',
    content: 'Rest in Pixel ha rivoluzionato il modo in cui offriamo valore alle famiglie. Non è solo tecnologia, è un nuovo modo di onorare il ricordo.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco'
  },
  {
    name: 'Elena Rossi',
    role: 'Direttore Tecnico, Luce Eterna',
    content: 'La semplicità del QR Code sulla lapide ha stupito tutti. È il ponte perfetto tra il luogo fisico della memoria e il mondo digitale.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  },
  {
    name: 'Giuseppe Neri',
    role: 'Fondatore, Memoria Viva',
    content: 'Un servizio impeccabile. La dashboard per noi agenzie è intuitiva e ci permette di gestire tutto in pochi click, risparmiando tempo prezioso.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Giuseppe'
  }
]

const faqs = ref([
  {
    q: 'Cosa succede ai dati dopo molti anni?',
    a: 'Utilizziamo infrastrutture cloud ridondate e protocolli di archiviazione a lungo termine. Il nostro fondo di mantenimento garantisce l\'hosting dei memoriali per decenni.',
    open: false
  },
  {
    q: 'Chi può caricare contenuti sul memoriale?',
    a: 'L\'agenzia abilita un amministratore familiare. Questi può decidere se lasciare il memoriale aperto a tutti o moderare ogni singolo messaggio e foto.',
    open: false
  },
  {
    q: 'Il QR Code è resistente alle intemperie?',
    a: 'Forniamo specifiche tecniche per la produzione di placche in ceramica o acciaio incise al laser, progettate per resistere a decenni di esposizione esterna.',
    open: false
  },
  {
    q: 'È possibile personalizzare il branding?',
    a: 'Certamente. Con il piano Professional ed Enterprise, il memoriale può mostrare il logo della tua agenzia e utilizzare colori coordinati alla tua identità.',
    open: false
  }
])

const pricingPlans = [
  {
    name: 'Essential',
    description: 'Ideale per piccole agenzie e onoranze locali.',
    monthlyPrice: '49',
    yearlyPrice: '39',
    features: [
      'Fino a 30 memoriali / mese',
      '2 operatori inclusi',
      'QR Code per lapide',
      'Hosting sicuro in Italia',
      'Supporto via email'
    ],
    cta: 'Inizia ora',
    link: '/register',
    featured: false
  },
  {
    name: 'Professional',
    badge: 'PIÙ SCELTO',
    description: 'Per agenzie strutturate con più sedi.',
    monthlyPrice: '129',
    yearlyPrice: '99',
    features: [
      'Memoriali illimitati',
      'Operatori illimitati',
      'Branding White-label',
      'Statistiche avanzate',
      'Pagamenti integrati',
      'Supporto prioritario'
    ],
    cta: 'Richiedi demo',
    link: '/register',
    featured: true
  },
  {
    name: 'Enterprise',
    description: 'Per grandi gruppi e network nazionali.',
    monthlyPrice: 'Su misura',
    yearlyPrice: 'Su misura',
    features: [
      'Tutto di Professional',
      'Multi-sede avanzato',
      'API & Integrazioni',
      'SLA dedicato 99,9%',
      'Manager dedicato',
      'Formazione on-site'
    ],
    cta: 'Contattaci',
    link: 'mailto:info@restinpixel.com',
    featured: false
  }
]

const containerRef = ref<HTMLElement | null>(null)
const activeSection = ref('hero')

const updateActiveDot = (id: string) => {
  activeSection.value = id
}

onMounted(() => {
  setTimeout(() => {
    if (!containerRef.value) return
    
    const sections = gsap.utils.toArray('section')
    
    sections.forEach((section: any) => {
      const heading = section.querySelector('h1, h2')
      const content = section.querySelector('.animate-content')
      const cards = section.querySelectorAll('.animate-card')
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller: containerRef.value,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
          onEnter: () => updateActiveDot(section.id),
          onEnterBack: () => updateActiveDot(section.id)
        }
      })

      if (heading) {
        tl.from(heading, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
      }

      if (content) {
        tl.from(content, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      }

      if (cards && cards.length > 0) {
        tl.from(cards, { y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }, '-=0.5')
      }
    })

    const heroImageEl = document.querySelector('.hero-image')
    if (heroImageEl) {
      gsap.from(heroImageEl, { scale: 1.05, opacity: 0, duration: 1.5, ease: 'power4.out', delay: 0.2 })
    }
  }, 200)
})
</script>

<template>
  <div ref="containerRef" class="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-[#FDFCF6] text-black selection:bg-[#849a8e]/30 selection:text-[#5d6d65]">
    <LandingHeader />

    <!-- Navigation Dots -->
    <div class="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      <button 
        v-for="id in ['hero', 'how-it-works', 'features', 'showcase', 'testimonials', 'pricing', 'faq']" 
        :key="id" 
        @click="scrollToSection(id)" 
        class="size-2 rounded-full transition-all duration-500 border border-black/5"
        :class="activeSection === id ? 'bg-[#849a8e] scale-150 shadow-lg shadow-[#849a8e]/40' : 'bg-black/10 hover:bg-[#849a8e]/40'"
      ></button>
    </div>

    <!-- Hero Section -->
    <section id="hero" class="relative h-screen snap-start snap-always flex flex-col pt-16 overflow-hidden">
      <div class="grow flex items-center justify-center">
        <!-- Decor Blur -->
        <div class="absolute -top-24 -left-24 size-96 bg-[#849a8e]/10 blur-[100px] rounded-full"></div>
        <div class="absolute top-1/2 -right-24 size-96 bg-[#849a8e]/5 blur-[120px] rounded-full"></div>
        
        <div class="max-w-7xl mx-auto px-5 md:px-12 w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div class="lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left">
            <div class="space-y-4">
              <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 border border-black/5 mx-auto lg:mx-0 backdrop-blur-sm">
                <div class="size-1.5 bg-[#849a8e] rounded-full animate-pulse"></div>
                <p class="text-[10px] uppercase tracking-[0.4em] text-[#849a8e] font-black">L'eternità in un pixel</p>
              </div>
              <h1 class="text-4xl md:text-6xl lg:text-8xl font-serif tracking-tighter leading-[0.95] lg:leading-[0.85] text-balance">
                Oltre il tempo, <br class="hidden sm:block"/>
                <span class="italic text-[#849a8e] font-light">custodiamo</span> <br class="hidden sm:block"/>
                il ricordo.
              </h1>
              <p class="text-sm lg:text-xl text-black/50 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed animate-content text-balance">
                La prima piattaforma dedicata alle onoranze funebri per trasformare la memoria in un'esperienza digitale senza tempo, sicura e dignitosa.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-content">
              <Button @click="router.push('/register')" class="w-full sm:w-auto bg-[#1a1a1a] hover:bg-black text-white rounded-xl px-10 h-14 text-xs font-bold uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">
                Inizia ora
              </Button>
              <button @click="scrollToSection('how-it-works')" class="flex items-center gap-3 group font-bold text-xs uppercase tracking-[0.2em] text-black/50 hover:text-black transition-all">
                Scopri di più 
                <div class="w-8 h-px bg-black/10 group-hover:w-12 group-hover:bg-black transition-all"></div>
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 relative aspect-square sm:aspect-video lg:aspect-square lg:max-h-[60vh] hero-image">
            <div class="absolute inset-0 bg-[#849a8e]/5 rounded-[3rem] lg:rounded-[4rem] -rotate-2 scale-105"></div>
            <div class="relative w-full h-full rounded-[3rem] lg:rounded-[4rem] overflow-hidden border border-black/5 shadow-2xl bg-white">
              <img :src="heroImage" alt="RIP Platform" class="w-full h-full object-cover scale-110" />
            </div>
            <!-- Floating Quote -->
            <div class="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-white p-5 lg:p-6 rounded-3xl shadow-2xl border border-black/5 animate-bounce-slow hidden sm:block">
              <IconQuote class="size-5 lg:size-6 text-[#849a8e] mb-2 opacity-20" />
              <p class="font-serif italic text-base lg:text-lg leading-tight text-black/80 max-w-[180px]">"Sempre nei nostri cuori, una luce perenne."</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps -->
    <section id="how-it-works" class="relative h-screen snap-start snap-always flex flex-col pt-16 bg-white/50 shrink-0 overflow-hidden">
      <div class="grow flex items-center justify-center">
        <div class="max-w-7xl mx-auto px-5 md:px-12 w-full">
          <div class="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-10 lg:mb-12">
            <div class="lg:col-span-7 space-y-3 lg:space-y-4 text-center lg:text-left">
              <p class="text-[11px] uppercase tracking-[0.5em] text-[#849a8e] font-bold">Il Percorso</p>
              <h2 class="text-3xl md:text-5xl lg:text-7xl font-serif tracking-tighter leading-none text-balance">Semplicità, <br/><span class="italic text-[#849a8e] font-light">passo dopo passo.</span></h2>
            </div>
            <div class="lg:col-span-5 text-center lg:text-left">
              <p class="text-sm lg:text-base text-black/60 font-medium leading-relaxed text-balance">Abbiamo reso la creazione di un memoriale digitale un processo fluido e rispettoso, integrato perfettamente nel tuo lavoro quotidiano.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div v-for="(step, i) in steps" :key="step.title" class="animate-card group p-5 lg:p-10 rounded-4xl lg:rounded-[3rem] bg-white border border-black/3 transition-all duration-700 hover:shadow-2xl hover:-translate-y-1">
              <div class="size-10 lg:size-12 rounded-xl lg:rounded-2xl bg-black text-white flex items-center justify-center text-xs font-black mb-6 lg:mb-8 group-hover:bg-[#849a8e] transition-colors">
                0{{ i + 1 }}
              </div>
              <h3 class="text-xl lg:text-2xl font-serif mb-3 lg:mb-4">{{ step.title }}</h3>
              <p class="text-xs lg:text-sm font-bold text-black/50 leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="relative h-screen snap-start snap-always flex flex-col pt-16 shrink-0 overflow-hidden">
      <div class="grow flex items-center justify-center">
        <div class="max-w-7xl mx-auto px-5 md:px-12 w-full">
          <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 lg:mb-16 text-center lg:text-left">
            <div class="max-w-3xl space-y-3 lg:space-y-4">
              <p class="text-[11px] uppercase tracking-[0.5em] text-[#849a8e] font-bold">Funzionalità</p>
              <h2 class="text-3xl md:text-5xl lg:text-7xl font-serif tracking-tighter leading-none text-balance">Strumenti per un <br/><span class="italic text-[#849a8e] font-light">nuovo standard.</span></h2>
            </div>
            
            <!-- Trust Badges Desktop -->
            <div class="hidden lg:flex items-center gap-8 text-black/30">
              <div class="flex flex-col items-center gap-2">
                <IconShieldCheck class="size-6" />
                <span class="text-[9px] font-black uppercase tracking-widest">GDPR Ready</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <IconCertificate class="size-6" />
                <span class="text-[9px] font-black uppercase tracking-widest">Premium Quality</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            <div v-for="feature in features" :key="feature.title" class="animate-card p-5 lg:p-10 rounded-3xl lg:rounded-[3rem] border border-black/3 hover:border-[#849a8e]/20 hover:bg-white transition-all duration-500 bg-white/30 backdrop-blur-sm group">
              <component :is="feature.icon" class="size-6 lg:size-8 text-[#849a8e] mb-4 lg:mb-8 group-hover:scale-110 transition-transform" />
              <h3 class="text-base lg:text-xl font-serif mb-2 lg:mb-4 leading-tight">{{ feature.title }}</h3>
              <p class="text-xs lg:text-sm font-bold text-black/75 leading-tight lg:leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Showcase -->
    <section id="showcase" class="relative h-screen snap-start snap-always flex flex-col pt-16 bg-[#F8F7F2]/50 shrink-0 overflow-hidden">
      <!-- Entire group (Content + Stats) centered as one block -->
      <div class="grow flex flex-col justify-center relative z-10 py-12 lg:py-0">
        <!-- Main Content Grid -->
        <div class="max-w-7xl mx-auto w-full px-5 md:px-12 relative z-10 mb-12 lg:mb-16">
          <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <!-- Text Column -->
            <div class="lg:col-span-5 space-y-6 lg:space-y-8 text-center lg:text-left">
              <div class="space-y-4">
                <p class="text-[11px] uppercase tracking-[0.5em] text-[#849a8e] font-bold">Showcase</p>
                <h2 class="text-3xl md:text-5xl lg:text-7xl font-serif tracking-tighter leading-none text-balance">La Bellezza <br/><span class="italic text-[#849a8e] font-light">del Ricordo.</span></h2>
                <p class="text-sm lg:text-base text-black/60 font-medium leading-relaxed text-balance max-w-md mx-auto lg:mx-0">
                  Ogni pagina è un tributo unico, disegnato per durare per sempre e accessibile da qualsiasi luogo tramite un semplice QR Code.
                </p>
              </div>
              
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button @click="router.push('/register')" class="bg-[#849a8e] hover:bg-[#5d6d65] text-white rounded-xl px-8 h-12 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">
                  Esplora Demo
                </Button>
              </div>
            </div>

            <!-- Image Column -->
            <div class="lg:col-span-7 animate-card">
              <div class="group relative aspect-square lg:aspect-video rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl border border-black/5 bg-white">
                <img :src="showcaseImage" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 lg:p-10">
                  <p class="text-white font-serif text-xl lg:text-2xl">Esempio di Memoriale Digitale</p>
                  <p class="text-[#849a8e] text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                    Dettagli <IconArrowRight class="size-4" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Stats Strip - Part of the centered group -->
        <div class="w-full px-5 md:px-12 hidden lg:block">
          <div class="max-w-7xl mx-auto bg-white/30 backdrop-blur-md border border-black/5 rounded-3xl py-6 lg:py-8 flex justify-around">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <p class="text-2xl lg:text-3xl font-serif text-[#849a8e] mb-0.5">{{ stat.value }}</p>
              <p class="text-[9px] font-black uppercase tracking-widest text-black/40">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="relative h-screen snap-start snap-always flex flex-col pt-16 bg-white shrink-0 overflow-hidden">
      <div class="grow flex items-center justify-center relative z-10 px-5 md:px-12 py-12 lg:py-0">
        <div class="max-w-7xl mx-auto w-full">
          <div class="text-center space-y-4 mb-12 lg:mb-20">
            <p class="text-[11px] uppercase tracking-[0.5em] text-[#849a8e] font-bold">Feedback</p>
            <h2 class="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tighter leading-none text-balance">Dicono di <span class="italic text-[#849a8e] font-light">noi.</span></h2>
          </div>

          <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div v-for="testimonial in testimonials" :key="testimonial.name" class="animate-card p-8 lg:p-10 rounded-[2.5rem] bg-[#FDFCF6] border border-black/3 relative flex flex-col hover:border-[#849a8e]/20 transition-all duration-500 group">
              <IconQuote class="size-10 text-[#849a8e]/10 absolute top-8 right-8 group-hover:scale-110 transition-transform" />
              <p class="text-sm lg:text-base font-medium text-black/70 italic leading-relaxed mb-8 grow">"{{ testimonial.content }}"</p>
              <div class="flex items-center gap-4">
                <div class="size-12 rounded-full overflow-hidden border border-black/5 bg-white">
                  <img :src="testimonial.avatar" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 class="text-sm font-serif font-bold">{{ testimonial.name }}</h4>
                  <p class="text-[10px] font-black uppercase tracking-widest text-[#849a8e]">{{ testimonial.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="relative h-screen snap-start snap-always flex flex-col pt-16 bg-[#FDFCF6]/50 shrink-0 overflow-hidden">
      <div class="grow flex items-center justify-center relative z-10 px-5 md:px-12 py-12 lg:py-0">
        <div class="max-w-7xl mx-auto w-full">
          <div class="text-center space-y-4 mb-8">
            <div class="space-y-2">
              <p class="text-[11px] uppercase tracking-[0.5em] text-[#849a8e] font-bold">Investimento</p>
              <h2 class="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tighter leading-none text-balance">Piani chiari, <br/><span class="italic text-[#849a8e] font-light">senza</span> sorprese.</h2>
            </div>

            <!-- Billing Toggle -->
            <div class="flex items-center justify-center gap-4">
              <span class="text-xs font-bold transition-colors" :class="billingCycle === 'monthly' ? 'text-black' : 'text-black/30'">Mensile</span>
              <button 
                @click="billingCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly'"
                class="w-10 h-5 lg:w-12 lg:h-6 rounded-full bg-black/5 border border-black/10 relative p-0.5 lg:p-1 transition-colors hover:border-[#849a8e]/40"
              >
                <div 
                  class="size-3.5 lg:size-4 rounded-full bg-[#849a8e] shadow-lg transition-transform duration-300 ease-spring"
                  :class="billingCycle === 'yearly' ? 'translate-x-5 lg:translate-x-6' : 'translate-x-0'"
                ></div>
              </button>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold transition-colors" :class="billingCycle === 'yearly' ? 'text-black' : 'text-black/30'">Annuale</span>
                <span class="px-2 py-0.5 rounded bg-[#849a8e]/10 text-[#849a8e] text-[11px] font-black uppercase tracking-widest">-20%</span>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <div 
              v-for="plan in pricingPlans" 
              :key="plan.name" 
              class="animate-card rounded-4xl lg:rounded-[2.5rem] p-6 lg:p-8 border transition-all duration-700 relative flex flex-col group"
              :class="[
                plan.featured ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-2xl lg:scale-105' : 'bg-white border-black/5 hover:border-[#849a8e]/20',
                plan.name === 'Enterprise' ? 'md:col-span-2 lg:col-span-1' : ''
              ]"
            >
              <div v-if="plan.badge" class="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#849a8e] text-white text-[11px] font-black tracking-widest uppercase shadow-xl">
                {{ plan.badge }}
              </div>

              <div class="mb-5 lg:mb-6 space-y-2 lg:space-y-3">
                <h3 class="text-xl lg:text-2xl font-serif">{{ plan.name }}</h3>
                <p class="text-xs font-medium" :class="plan.featured ? 'text-white/60' : 'text-black/60'">{{ plan.description }}</p>
                
                <div class="pt-3 lg:pt-4 flex items-baseline gap-1">
                  <template v-if="plan.monthlyPrice !== 'Su misura'">
                    <span class="text-lg lg:text-xl font-serif text-[#849a8e]">€</span>
                    <span class="text-4xl lg:text-5xl font-serif tracking-tighter tabular-nums transition-all leading-none">
                      {{ billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice }}
                    </span>
                    <span class="text-[11px] font-black uppercase tracking-widest opacity-40 ml-2">/ mese</span>
                  </template>
                  <template v-else>
                    <span class="text-2xl lg:text-3xl font-serif tracking-tighter">Su misura</span>
                  </template>
                </div>
              </div>
              
              <ul class="grid grid-cols-1 gap-2.5 lg:gap-3 mb-6 lg:mb-8 grow">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2.5">
                  <div class="size-3.5 lg:size-4 rounded-full flex items-center justify-center" :class="plan.featured ? 'bg-white/10' : 'bg-[#849a8e]/10'">
                    <IconCheck class="size-1.5 lg:size-2" :class="plan.featured ? 'text-white' : 'text-[#849a8e]'" />
                  </div>
                  <span class="text-xs font-bold" :class="plan.featured ? 'text-white/90' : 'text-black/70'">{{ feature }}</span>
                </li>
              </ul>

              <Button 
                @click="handlePricingClick(plan.link)"
                class="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500"
                :class="plan.featured ? 'bg-white text-black hover:bg-white/90 shadow-xl' : 'bg-black text-white hover:bg-black/90 shadow-lg'"
              >
                {{ plan.cta }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="relative h-screen snap-start snap-always flex flex-col pt-16 bg-white shrink-0 overflow-hidden">
      <div class="grow flex items-center justify-center relative z-10 px-5 md:px-12 py-12 lg:py-0">
        <div class="max-w-4xl mx-auto w-full">
          <div class="text-center space-y-4 mb-12 lg:mb-16">
            <p class="text-[11px] uppercase tracking-[0.5em] text-[#849a8e] font-bold">FAQ</p>
            <h2 class="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tighter leading-none text-balance">Domande <span class="italic text-[#849a8e] font-light">frequenti.</span></h2>
          </div>

        <div class="space-y-3">
          <div 
            v-for="(faq, i) in faqs" 
            :key="faq.q" 
            class="animate-card border border-black/5 rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-500"
            :class="faq.open ? 'bg-[#FDFCF6] border-[#849a8e]/20' : 'bg-white hover:border-black/10'"
          >
            <button 
              @click="faq.open = !faq.open"
              class="w-full flex items-center justify-between p-6 lg:p-8 text-left group"
            >
              <span class="text-sm lg:text-lg font-serif font-bold group-hover:text-[#849a8e] transition-colors">{{ faq.q }}</span>
              <div class="size-6 rounded-full flex items-center justify-center bg-black/5 group-hover:bg-[#849a8e]/10 transition-colors">
                <IconMinus v-if="faq.open" class="size-3 text-[#849a8e]" />
                <IconPlus v-else class="size-3 text-black/40 group-hover:text-[#849a8e]" />
              </div>
            </button>
            <div v-show="faq.open" class="px-6 pb-6 lg:px-8 lg:pb-8">
              <p class="text-xs lg:text-sm font-medium text-black/50 leading-relaxed max-w-2xl">{{ faq.a }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <p class="text-[10px] font-black uppercase tracking-widest text-black/30 mb-4">Hai altre domande?</p>
          <a href="mailto:info@restinpixel.com" class="text-xs font-bold text-[#849a8e] hover:underline">Contatta il nostro team di supporto</a>
        </div>
        </div>
      </div>
    </section>

    <!-- Final CTA & Footer Section -->
    <section id="footer" class="relative h-screen snap-start snap-always flex flex-col pt-16 bg-[#1a1a1a] text-white shrink-0 overflow-hidden">
      <!-- Decor Blur -->
      <div class="absolute -bottom-24 -right-24 size-[500px] bg-[#849a8e]/10 blur-[150px] rounded-full"></div>
      
      <!-- Top CTA -->
      <div class="grow flex items-center justify-center relative z-10 px-5 py-24 lg:py-0">
        <div class="max-w-4xl text-center space-y-8 lg:space-y-14">
          <div class="space-y-4 lg:space-y-8">
            <h2 class="text-3xl md:text-6xl lg:text-8xl font-serif tracking-tighter leading-tight lg:leading-none text-balance">Pronto a dare un <br/><span class="italic text-[#849a8e] font-light">nuovo volto</span> al ricordo?</h2>
            <p class="text-sm lg:text-xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed text-balance">Unisciti alle migliori agenzie che hanno già scelto Rest in Pixel per onorare la memoria nell'era digitale.</p>
          </div>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
            <Button @click="router.push('/register')" class="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-xl lg:rounded-2xl px-12 h-14 lg:h-16 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-2xl">
              Inizia ora — Prova gratuita
            </Button>
            <Button @click="handlePricingClick('mailto:info@restinpixel.com')" class="w-full sm:w-auto bg-white/5 border border-white/20 text-white hover:bg-white/10 rounded-xl lg:rounded-2xl px-12 h-14 lg:h-16 text-xs font-bold uppercase tracking-widest transition-all">
              Parla con un esperto
            </Button>
          </div>
        </div>
      </div>

      <!-- Links & Info -->
      <div class="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-3xl pt-12 lg:pt-16 pb-10 px-5 md:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-16 mb-12 lg:mb-16">
            <!-- Brand Column -->
            <div class="col-span-2 space-y-5 lg:space-y-6">
              <div class="flex flex-col">
                <span class="text-3xl lg:text-4xl font-serif tracking-tighter font-bold leading-none">RIP</span>
                <span class="text-[10px] lg:text-[11px] uppercase tracking-[0.5em] text-[#849a8e] font-black mt-2.5">Rest in Pixel</span>
              </div>
              <p class="text-xs lg:text-sm text-white/40 leading-relaxed max-w-xs font-medium italic">
                L'eccellenza digitale per le onoranze funebri. <br/>Dignità, bellezza e memoria, per sempre.
              </p>
            </div>

            <!-- Links Columns -->
            <div v-for="group in [
              { t: 'Prodotto', l: [
                { n: 'Funzionalità', a: 'features' }, 
                { n: 'Showcase', a: 'showcase' }, 
                { n: 'Prezzi', a: 'pricing' }, 
                { n: 'FAQ', a: 'faq' }
              ] },
              { t: 'Azienda', l: [
                { n: 'Chi siamo', a: 'hero' }, 
                { n: 'Dicono di noi', a: 'testimonials' }, 
                { n: 'Vision', a: 'hero' }, 
                { n: 'Contatti', m: 'mailto:info@restinpixel.com' }
              ] }
            ]" :key="group.t" class="space-y-5 lg:space-y-6">
              <h4 class="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{{ group.t }}</h4>
              <ul class="space-y-2.5 lg:space-y-3">
                <li v-for="link in group.l" :key="link.n">
                  <a 
                    href="javascript:void(0)" 
                    @click="link.a ? scrollToSection(link.a) : (link.m ? handlePricingClick(link.m) : null)"
                    class="text-xs lg:text-sm font-bold text-white/50 hover:text-[#849a8e] transition-colors"
                  >
                    {{ link.n }}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Bar -->
          <div class="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white/20 text-center md:text-left">
            <div class="flex flex-col md:flex-row items-center gap-4 lg:gap-10">
              <span>© 2026 RIP — Rest in Pixel. Tutti i diritti riservati.</span>
              <span class="flex items-center gap-2"><div class="size-1 bg-[#849a8e] rounded-full"></div> Made with heart in IT</span>
            </div>
            <div class="flex items-center gap-8">
              <a href="https://instagram.com" target="_blank" class="hover:text-white transition-colors">Instagram</a>
              <a href="https://linkedin.com" target="_blank" class="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://facebook.com" target="_blank" class="hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce-slow 6s infinite ease-in-out;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.ease-spring {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.h-screen {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
