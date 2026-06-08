import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/trending',
      name: 'Trending',
      component: () => import('@/views/TrendingView.vue'),
    },
    {
      path: '/repo/:owner/:repo',
      name: 'RepoDetail',
      component: () => import('@/views/RepoDetailView.vue'),
      props: true,
    },
    {
      path: '/languages',
      name: 'Languages',
      component: () => import('@/views/LanguagesView.vue'),
    },
    {
      path: '/topics',
      name: 'Topics',
      component: () => import('@/views/TopicsView.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

export default router
