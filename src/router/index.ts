import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import CabinetView from '@/views/CabinetView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Чистый берег' } },
    { path: '/about', name: 'about', component: AboutView, meta: { title: 'О проекте' } },
    { path: '/login', name: 'login', component: LoginView, meta: { title: 'Вход' } },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: CabinetView,
      meta: { title: 'Личный кабинет' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const user = useUserStore()
  if (to.name === 'cabinet' && !user.isAuthed) {
    return { name: 'login', query: { then: 'cabinet' } }
  }
  if (to.name === 'login' && user.isAuthed) {
    return { name: 'cabinet' }
  }
  return true
})

router.afterEach((to) => {
  const base = 'Чистый берег'
  document.title = to.meta.title ? `${to.meta.title as string} — ${base}` : base
})

export default router