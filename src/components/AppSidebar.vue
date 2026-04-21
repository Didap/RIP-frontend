<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/lib/auth'
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconWallet,
} from "@tabler/icons-vue"

import NavDocuments from '@/components/NavDocuments.vue'
import NavMain from '@/components/NavMain.vue'
import NavSecondary from '@/components/NavSecondary.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const { user: authUser } = useAuth()

const data = {
  user: computed(() => ({
    name: authUser.value?.username ?? 'Utente',
    email: authUser.value?.email ?? '',
    avatar: '/avatars/shadcn.jpg',
  })),
  navMain: computed(() => {
    const items = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Memoriali",
        url: "/memorials",
        icon: IconListDetails,
      },
      {
        title: "Clienti",
        url: "/clients",
        icon: IconChartBar,
      },
      {
        title: "Contributi",
        url: "/contributions",
        icon: IconListDetails,
      },
      {
        title: "Staff",
        url: "/staff",
        icon: IconUsers,
      },
      {
        title: "Crediti",
        url: "/credits",
        icon: IconWallet,
      },
    ]

    // Solo l'admin può vedere la gestione Staff
    if (authUser.value?.role_type !== 'agency_admin') {
      return items.filter(item => item.title !== 'Staff')
    }

    return items
  }),
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileDescription,
    },
  ],
}
</script>


<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child class="data-[slot=sidebar-menu-button]:p-1.5!">
            <a href="#">
              <IconInnerShadowTop class="size-5!" />
              <span class="text-base font-semibold">RIP</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain.value" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user.value" />
    </SidebarFooter>
  </Sidebar>
</template>
