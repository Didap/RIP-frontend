import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuth } from '@/lib/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
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

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()

  // Check if the route or any parent route requires auth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  if (requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated.value) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
