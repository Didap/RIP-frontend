<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { 
  IconCirclePlus, 
  IconActivity,
  IconMessageShare
} from '@tabler/icons-vue'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

interface Activity {
  id: string
  type: 'memorial' | 'contribution'
  title: string
  subtitle: string
  createdAt: string
  time_ago: string
  icon: any
}

const { agencyId } = useAuth()
const activities = ref<Activity[]>([])
const loading = ref(true)

function formatRelativeTime(date: string) {
  const now = new Date()
  const past = new Date(date)
  const diffInMs = now.getTime() - past.getTime()
  const diffInSec = Math.floor(diffInMs / 1000)
  const diffInMin = Math.floor(diffInSec / 60)
  const diffInHours = Math.floor(diffInMin / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) return `${diffInDays}g fa`
  if (diffInHours > 0) return `${diffInHours}h fa`
  if (diffInMin > 0) return `${diffInMin}m fa`
  return 'adesso'
}

async function fetchActivities() {
  if (!agencyId.value) return
  loading.value = true
  try {
    const [memorialsRes, contributionsRes] = await Promise.all([
      fetchApi(`/api/tombstones?filters[agency][id][$eq]=${agencyId.value}&sort=createdAt:desc&pagination[limit]=5`),
      fetchApi(`/api/contributions?filters[tombstone][agency][id][$eq]=${agencyId.value}&populate[tombstone][fields]=full_name&sort=createdAt:desc&pagination[limit]=5`)
    ])

    const memorials = (memorialsRes.data ?? memorialsRes).map((m: any) => {
      const date = (m.attributes?.createdAt ?? m.createdAt)
      return {
        id: `m-${m.id}`,
        type: 'memorial' as const,
        title: 'Nuovo Memoriale',
        subtitle: (m.attributes?.full_name ?? m.full_name),
        createdAt: date,
        time_ago: formatRelativeTime(date),
        icon: IconCirclePlus
      }
    })

    const contributions = (contributionsRes.data ?? contributionsRes).map((c: any) => {
      const date = (c.attributes?.createdAt ?? c.createdAt)
      return {
        id: `c-${c.id}`,
        type: 'contribution' as const,
        title: 'Nuovo Contributo',
        subtitle: `Per ${(c.attributes?.tombstone?.data?.attributes?.full_name ?? c.tombstone?.full_name ?? 'un memoriale')}`,
        createdAt: date,
        time_ago: formatRelativeTime(date),
        icon: IconMessageShare
      }
    })

    activities.value = [...memorials, ...contributions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching activities:', error)
  } finally {
    loading.value = false
  }
}

watch(agencyId, fetchActivities, { immediate: true })
</script>

<template>
  <Card class="flex flex-col h-full border-border/40 bg-card shadow-sm overflow-hidden transition-shadow duration-300 ease-out hover:shadow-md">
    <CardHeader class="p-3 border-b border-border/10 bg-muted/20">
      <div class="flex items-center gap-2">
        <div class="p-1 px-1.5 rounded-md bg-purple-500/10 text-purple-500">
          <IconActivity class="size-3.5" />
        </div>
        <div>
          <CardTitle class="text-[14px] font-semibold">Attività Recente</CardTitle>
          <CardDescription class="text-[11px]">Ultimi aggiornamenti</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent class="flex-1 p-0">
      <div v-if="loading" class="p-6 space-y-6">
        <div v-for="i in 4" :key="i" class="flex items-start gap-4 animate-pulse">
          <div class="size-8 rounded-full bg-muted/30" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-1/2 bg-muted/30 rounded" />
            <div class="h-2 w-1/3 bg-muted/30 rounded" />
          </div>
        </div>
      </div>
      
      <div v-else-if="activities.length === 0" class="flex flex-col items-center justify-center p-12 text-center opacity-40">
        <div class="size-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
          <IconActivity class="size-8 text-muted-foreground/30" />
        </div>
        <p class="text-sm font-medium">Nessuna attività registrata</p>
        <p class="text-[11px] text-muted-foreground">Inizia a gestire i tuoi memoriali.</p>
      </div>

      <div v-else class="relative p-3 px-6">
        <!-- Vertical Line -->
        <div class="absolute left-[39.5px] top-6 bottom-6 w-px bg-border/40" />
        
        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.id" class="relative flex items-start gap-4 group">
            <div :class="[
              'relative z-10 size-7 rounded-full flex items-center justify-center border-2 border-background ring-4 ring-muted/5 transition-[transform,ring] duration-300 ease-out group-hover:scale-110 group-hover:ring-muted/10',
              activity.type === 'memorial' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
            ]">
              <component :is="activity.icon" class="size-3" />
            </div>
            
            <div class="flex-1 min-w-0 pt-0.5">
              <div class="flex items-center justify-between gap-2">
                <p class="text-[12px] font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {{ activity.title }}
                </p>
                <time class="text-[9px] text-muted-foreground whitespace-nowrap font-bold uppercase tracking-wider bg-muted shadow-xs px-1.5 py-0.5 rounded-sm">
                  {{ activity.time_ago }}
                </time>
              </div>
              <p class="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                {{ activity.subtitle }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="border-t border-border/10 p-3 bg-muted/5 flex justify-center mt-auto">
       <router-link to="/memorials" class="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          Visualizza tutto
       </router-link>
    </CardFooter>
  </Card>
</template>
