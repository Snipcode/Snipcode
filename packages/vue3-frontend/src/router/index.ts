import { createRouter, createWebHistory } from 'vue-router'
import store, { warn } from '../store'

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
      beforeEnter: () => {
        if (store.options.auth.requiredAuthToPaste && !store.user)
          return '/auth/login'
      },
    },
    {
      path: '/auth',
      component: () => import('../layouts/single.vue'),
      children: [
        {
          path: '/auth/login',
          component: () => import('../pages/auth/login.vue'),
        },
        {
          path: '/auth/register',
          component: () => import('../pages/auth/register.vue'),
          beforeEnter: () => {
            if (!store.options.auth.allowRegister) {
              warn('Registrations are disabled.')
              return '/auth/login'
            }
          },
        },
      ],
      beforeEnter: (to) => {
        if (to.path === '/auth') return '/auth/login'
        if (store.user) return '/'
      },
    },
    {
      path: '/account',
      component: () => import('../layouts/single.vue'),
      children: [
        {
          path: '/account',
          component: () => import('../pages/account.vue'),
        },
      ],
      beforeEnter: () => {
        if (!store.user) return '/auth/login'
      },
    },
  ],
  history: createWebHistory(),
})

export default router
