<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { VisXYContainer, VisLine, VisArea, VisAxis, VisDonut, VisSingleContainer } from '@unovis/vue'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, componentToString } from '@/components/ui/chart'
import { IconLayoutDashboard, IconMessage2 } from '@tabler/icons-vue'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const { agencyId } = useAuth()

// --- Memorials Distribution ---
const statusData = ref([
  { status: 'Pubblicati', count: 0, color: 'var(--primary)' },
  { status: 'Bozze', count: 0, color: 'var(--muted-foreground)' },
])

// --- Contributions Growth ---
const growthData = ref<{ date: Date; count: number }[]>([])

const loading = ref(true)

async function fetchData() {
  if (!agencyId.value) return
  loading.value = true
  try {
    const [memorialsRes, contributionsRes] = await Promise.all([
      fetchApi(`/api/tombstones?filters[agency][id][$eq]=${agencyId.value}&pagination[limit]=100`),
      fetchApi(`/api/contributions?filters[tombstone][agency][id][$eq]=${agencyId.value}&sort=createdAt:asc&pagination[limit]=100`)
    ])

    const memorials = (memorialsRes.data ?? memorialsRes)
    const publishedCount = memorials.filter((m: any) => (m.attributes?.lifecycle_status ?? m.lifecycle_status) === 'published').length
    const draftCount = memorials.length - publishedCount
    statusData.value = [
      { status: 'Pubblicati', count: publishedCount, color: 'hsl(var(--primary))' },
      { status: 'Bozze', count: draftCount, color: 'hsl(var(--muted))' },
    ]

    const contributions = (contributionsRes.data ?? contributionsRes)
    const countsByDate: Record<string, number> = {}
    
    // Last 7 days baseline
    for(let i=6; i>=0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      countsByDate[d.toISOString().split('T')[0]] = 0
    }

    contributions.forEach((c: any) => {
      const date = (c.attributes?.createdAt ?? c.createdAt).split('T')[0]
      if (countsByDate[date] !== undefined) {
        countsByDate[date]++
      }
    })

    growthData.value = Object.entries(countsByDate).map(([date, count]) => ({
      date: new Date(date),
      count
    }))

  } catch (error) {
    console.error('Error fetching chart data:', error)
  } finally {
    loading.value = false
  }
}

watch(agencyId, fetchData, { immediate: true })
onMounted(fetchData)

const totalMemorials = computed(() => statusData.value.reduce((acc, d) => acc + d.count, 0))
</script>

<template>
  <div class="grid grid-cols-1 @4xl/main:grid-cols-2 gap-6 h-full">
    <!-- Memorial Status Distribution -->
    <Card class="flex flex-col h-full transition-all border-border/40 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader class="pb-2 border-b border-border/10 bg-muted/20">
        <div class="flex items-center gap-2">
          <div class="p-1 px-1.5 rounded-md bg-blue-500/10 text-blue-500">
            <IconLayoutDashboard class="size-3.5" />
          </div>
          <div>
            <CardTitle class="text-[14px] font-semibold">Stato Memoriali</CardTitle>
            <CardDescription class="text-[11px]">Bozze vs Pubblicati</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="flex-1 flex flex-col justify-center min-h-[220px] relative p-4">
        <div v-if="loading" class="h-full flex items-center justify-center">
           <div class="size-20 rounded-full border-4 border-muted/30 border-t-primary animate-spin"></div>
        </div>
        <div v-else-if="totalMemorials === 0" class="flex flex-col items-center justify-center text-center opacity-40 py-8">
           <IconLayoutDashboard class="size-10 mb-2 text-muted-foreground/50" />
           <p class="text-xs font-medium">Nessun memoriale</p>
        </div>
        <div v-else class="relative size-full max-h-[170px] mx-auto">
          <VisSingleContainer :data="statusData" :margin="{ top: 5, right: 5, bottom: 5, left: 5 }">
            <VisDonut
              :value="(d: any) => d.count"
              :color="(d: any) => d.color"
              :arc-width="30"
              :central-label="totalMemorials.toString()"
              :central-sub-label="'Totali'"
              :rounded-corners="4"
            />
          </VisSingleContainer>
        </div>
      </CardContent>
      <CardFooter class="border-t border-border/10 px-6 py-4 flex flex-col gap-2 bg-muted/5">
        <div v-for="item in statusData" :key="item.status" class="flex items-center w-full justify-between text-[12px]">
            <div class="flex items-center gap-2">
                <div class="size-2 rounded-full" :style="{ backgroundColor: item.color }"></div>
                <span class="text-muted-foreground font-medium">{{ item.status }}</span>
            </div>
            <span class="font-bold tabular-nums">{{ item.count }}</span>
        </div>
      </CardFooter>
    </Card>

    <!-- Contributions Growth -->
    <Card class="flex flex-col h-full transition-all border-border/40 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader class="pb-2 border-b border-border/10 bg-muted/20">
        <div class="flex items-center gap-2">
          <div class="p-1 px-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
            <IconMessage2 class="size-3.5" />
          </div>
          <div>
            <CardTitle class="text-[14px] font-semibold">Tendenza Contributi</CardTitle>
            <CardDescription class="text-[11px]">Ultimi 7 giorni</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="flex-1 flex items-center min-h-[220px] p-4 pt-0">
        <div v-if="loading" class="w-full h-full flex items-center justify-center p-8">
            <div class="w-full h-20 bg-muted/30 rounded-lg animate-pulse" />
        </div>
        <div v-else-if="growthData.reduce((acc, d) => acc + d.count, 0) === 0" class="w-full flex flex-col items-center justify-center text-center opacity-40 py-8">
           <IconMessage2 class="size-10 mb-2 text-muted-foreground/50" />
           <p class="text-xs font-medium">Nessun contributo</p>
        </div>
        <div v-else class="h-full w-full pt-4">
          <VisXYContainer :data="growthData" :margin="{ top: 10, right: 10, bottom: 25, left: 10 }">
            <VisArea
              :x="(d: any) => d.date"
              :y="(d: any) => d.count"
              color="hsl(var(--primary))"
              :opacity="0.1"
            />
            <VisLine
              :x="(d: any) => d.date"
              :y="(d: any) => d.count"
              color="hsl(var(--primary))"
              :line-width="2.5"
            />
            <VisAxis
              type="x"
              :tick-format="(d: number) => new Date(d).toLocaleDateString('it-IT', { weekday: 'short' })"
              :num-ticks="7"
              :grid-line="false"
              :tick-line="false"
              class="text-[9px] font-medium text-muted-foreground"
            />
            <VisAxis
              type="y"
              :num-ticks="4"
              :grid-line="true"
              :tick-line="false"
              :domain-line="false"
              class="text-[9px] font-medium text-muted-foreground opacity-30"
            />
          </VisXYContainer>
        </div>
      </CardContent>
      <CardFooter class="border-t border-border/10 px-6 py-4 bg-muted/5 flex items-center justify-between">
          <p class="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Real-time update</p>
          <div class="flex items-center gap-1">
             <div class="size-1 rounded-full bg-emerald-500 animate-pulse" />
             <span class="text-[9px] text-emerald-500 font-bold uppercase tracking-tight">Active</span>
          </div>
      </CardFooter>
    </Card>
  </div>
</template>
