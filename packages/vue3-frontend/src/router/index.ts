import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  routes: [
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: '/',
          component: () => import('../pages/index.vue'),
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('../layouts/auth.vue'),
      children: [
        {
          path: '/auth/login',
          component: () => import('../pages/auth/login.vue'),
        },
      ],
      beforeEnter: (to) => {
        if (to.path === '/auth') return '/auth/login'
      },
    },
  ],
  history: createWebHistory(),
})

export default router
