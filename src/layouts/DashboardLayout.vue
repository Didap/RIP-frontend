<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from "@/components/AppSidebar.vue"
import SiteHeader from "@/components/SiteHeader.vue"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
</script>

<template>
  <SidebarProvider :style="{
    '--sidebar-width': 'calc(var(--spacing) * 72)',
    '--header-height': 'calc(var(--spacing) * 12)',
  }">
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div class="@container/main flex flex-1 flex-col px-4 py-4 lg:px-6 lg:py-6 pb-10 overflow-x-hidden">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
