<script setup lang="ts">
import { ref } from "vue"
import type { Component } from "vue"
import { RouterLink, useRoute } from "vue-router"
import { IconCirclePlusFilled } from "@tabler/icons-vue"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/auth'
import MemorialDialog from './MemorialDialog.vue'

interface NavItem {
  title: string
  url: string
  icon?: Component
}

defineProps<{
  items: NavItem[]
}>()

const route = useRoute()
const showCreateModal = ref(false)
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent class="flex flex-col gap-2">
      <SidebarMenu>
        <SidebarMenuItem class="flex items-center gap-2">
          <SidebarMenuButton tooltip="Quick Create"
            @click="showCreateModal = true"
            class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-in-out cursor-pointer">
            <IconCirclePlusFilled />
            <span>Crea memoriale</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton
            as-child
            :tooltip="item.title"
            :is-active="route.path === item.url"
          >
            <RouterLink :to="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>

    <MemorialDialog v-model:open="showCreateModal" />
  </SidebarGroup>
</template>
