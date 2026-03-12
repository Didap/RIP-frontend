import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/pages/dashboard/Dashboard.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'memorials',
          name: 'Memorials',
          component: () => import('@/pages/dashboard/MemorialsView.vue'),
          meta: { title: 'Memoriali' }
        },
        {
          path: 'clients',
          name: 'Clients',
          component: () => import('@/pages/dashboard/ClientsView.vue'),
          meta: { title: 'Clienti' }
        },
        {
          path: 'contributions',
          name: 'Contributi',
          component: () => import('@/pages/dashboard/ContributionsView.vue'),
          meta: { title: 'Contributi' }
        },
        {
          path: 'staff',
          name: 'Staff',
          component: () => import('@/pages/dashboard/StaffView.vue'),
          meta: { title: 'Staff' }
        },
      ],
    },
  ],
})

export default router
