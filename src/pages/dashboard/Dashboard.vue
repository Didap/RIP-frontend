<script setup lang="ts">
import SectionCards from "../../components/SectionCards.vue"
import ActivityFeed from "../../components/ActivityFeed.vue"
import StatusCharts from "../../components/StatusCharts.vue"
import { useAuth } from "@/lib/auth"

const { user } = useAuth()
</script>

<template>
  <div class="flex flex-1 flex-col gap-6">
    <!-- Welcome Header -->
    <div class="flex flex-col gap-1 mb-2">
      <h1 class="text-2xl font-bold tracking-tight">Benvenuto, {{ user?.username || 'Agency' }}</h1>
      <p class="text-sm text-muted-foreground">Ecco una panoramica completa della tua agenzia oggi.</p>
    </div>

    <SectionCards />
    
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2">
        <StatusCharts />
      </div>
      <div class="xl:col-span-1">
        <ActivityFeed />
      </div>
    </div>
  </div>
</template>