import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuth } from '@/lib/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/pages/LandingView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/backoffice',
      name: 'Login',
      component: () => import('@/pages/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/memorial/:slug',
      name: 'PublicMemorial',
      component: () => import('@/pages/PublicMemorial.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard-root', // Temporary path for dashboard container
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
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
          path: 'memorials/:id',
          name: 'MemorialDetail',
          component: () => import('@/pages/dashboard/MemorialDetailView.vue'),
          meta: { title: 'Dettaglio Memoriale' }
        },
        {
          path: 'memorials/editor/:id',
          name: 'MemorialEditor',
          component: () => import('@/pages/dashboard/MemorialEditorView.vue'),
          meta: { title: 'Personalizza Memoriale' }
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
        {
          path: 'credits',
          name: 'Crediti',
          component: () => import('@/pages/dashboard/CreditsView.vue'),
          meta: { title: 'Crediti e Generazione' }
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound.vue'),
      meta: { requiresAuth: false },
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
