import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: '空白流汀 · 记录生活与灵感' } },
    { path: '/moments', name: 'moments', component: () => import('../views/MomentsView.vue'), meta: { title: '生活碎片 · 空白流汀' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }
    return { top: 0 }
  }
})
router.afterEach(to => { document.title = to.meta.title || '空白流汀' })
export default router
