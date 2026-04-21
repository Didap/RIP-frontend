<script setup lang="ts">
import SectionCards from "../../components/SectionCards.vue"
import ActivityFeed from "../../components/ActivityFeed.vue"
import StatusCharts from "../../components/StatusCharts.vue"
import { useAuth } from "@/lib/auth"

const { user } = useAuth()
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-extrabold tracking-tight text-foreground/90 leading-tight">Bentornato, {{ user?.username }}</h1>
        <p class="text-[11px] text-muted-foreground font-medium">Panoramica completa della tua agenzia.</p>
      </div>
    </div>
    
    <SectionCards />
    
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="xl:col-span-2">
        <StatusCharts />
      </div>
      <div class="xl:col-span-1">
        <ActivityFeed />
      </div>
    </div>
  </div>
</template>