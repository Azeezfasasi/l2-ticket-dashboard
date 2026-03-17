import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/components/DashboardView.vue'
import TicketsView from '@/components/TicketsView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: TicketsView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Always scroll to top when navigating
    return { top: 0 }
  },
})

export default router
