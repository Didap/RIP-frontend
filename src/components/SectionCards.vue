<script setup lang="ts">
import { 
  IconArrowUpRight, 
  IconMessage2, 
  IconUsers, 
  IconUser, 
  IconSquareRoundedCheck,
  IconLayoutDashboard
} from "@tabler/icons-vue"

import { Card, CardContent } from '@/components/ui/card'
import { ref, watch, onMounted } from "vue"
import { fetchApi } from "@/lib/api"
import { useAuth } from "@/lib/auth"

const { agencyId } = useAuth()
const memorialCount = ref(0)
const pendingContributionsCount = ref(0)
const staffCount = ref(0)
const clientsCount = ref(0)

async function fetchMetrics() {
  if (!agencyId.value) return

  try {
    const [memorials, contributions, staff, permissions] = await Promise.all([
      fetchApi(`/api/tombstones?filters[agency][id][$eq]=${agencyId.value}&filters[lifecycle_status][$eq]=published&pagination[withCount]=true&pagination[limit]=1`),
      fetchApi(`/api/contributions?filters[tombstone][agency][id][$eq]=${agencyId.value}&filters[is_approved][$eq]=false&pagination[withCount]=true&pagination[limit]=1`),
      fetchApi(`/api/users?filters[agencies][id][$in]=${agencyId.value}&filters[role_type][$eq]=agency_staff`),
      fetchApi(`/api/tombstone-permissions?filters[tombstone][agency][id][$eq]=${agencyId.value}&filters[access_level][$eq]=owner&pagination[withCount]=true&pagination[limit]=1`)
    ])

    memorialCount.value = memorials.meta?.pagination?.total ?? 0
    pendingContributionsCount.value = contributions.meta?.pagination?.total ?? 0
    staffCount.value = Array.isArray(staff) ? staff.length : (staff.meta?.pagination?.total ?? 0)
    clientsCount.value = permissions.meta?.pagination?.total ?? 0
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
  }
}

watch(agencyId, fetchMetrics, { immediate: true })
onMounted(fetchMetrics)

const kpis = [
  {
    title: 'Memoriali attivi',
    value: memorialCount,
    icon: IconLayoutDashboard,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    link: '/memorials'
  },
  {
    title: 'Contributi pendenti',
    value: pendingContributionsCount,
    icon: IconMessage2,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    link: '/contributions'
  },
  {
    title: 'Staffer',
    value: staffCount,
    icon: IconUser,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    link: '/staff'
  },
  {
    title: 'Clienti',
    value: clientsCount,
    icon: IconUsers,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    link: '/clients'
  }
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    <Card 
      v-for="kpi in kpis" 
      :key="kpi.title"
      class="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/40 bg-card/60 backdrop-blur-sm"
    >
      <router-link :to="kpi.link" class="absolute inset-0 z-10" />
      <CardContent class="p-4 flex items-center gap-4">
        <!-- Icon Side -->
        <div :class="['shrink-0 p-3 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-sm', kpi.bg, kpi.color]">
          <component :is="kpi.icon" class="size-6" />
        </div>
        
        <!-- Text Side -->
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-0.5">
            {{ kpi.title }}
          </p>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold tracking-tight text-foreground/90 tabular-nums">
              {{ kpi.value.value }}
            </h3>
            <IconArrowUpRight class="size-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <!-- Subtle Glow -->
        <div class="absolute -right-4 -bottom-4 size-16 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" :class="kpi.bg" />
      </CardContent>
    </Card>
  </div>
</template>
