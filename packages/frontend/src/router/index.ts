import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { globalLoaded, user } from '../store'
import { me } from '../api/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/default.vue'),
    children: [
      {
        path: '/',
        meta: { requiredAuth: true },
        component: () => import('../pages/index.vue'),
      },
      {
        path: '/editor',
        meta: { requiredAuth: true },
        component: () => import('../pages/editor/index.vue'),
      },
      {
        path: '/editor/:id',
        meta: { requiredAuth: true },
        component: () => import('../pages/editor/index.vue'),
      },
      {
        path: '/:id',
        meta: { requiredAuth: true },
        component: () => import('../pages/_id.vue'),
      },
      {
        path: '/invite',
        meta: { requiredAuth: true },
        component: () => import('../pages/invite.vue'),
      },
      {
        path: '/pastes',
        meta: { requiredAuth: true },
        component: () => import('../pages/pastes.vue'),
      }
    ],
  },
  {
    path: '/',
    component: () => import('../layouts/auth.vue'),
    children: [
      {
        path: '/auth/login',
        meta: { requiredUnauth: true },
        component: () => import('../pages/auth/login.vue'),
      },
      {
        path: '/auth/register',
        meta: { requiredUnauth: true },
        component: () => import('../pages/auth/register.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {

  const fetchMe = async () => {
    const { data } = await me()
    user.value = data.success ? data.data.user : null

    return !!user.value
  }

  const loggedIn = await fetchMe()

  if (to.meta.requiredAuth && !loggedIn) {
    return { path: '/auth/login' }
  }

  if (to.meta.requiredUnauth && loggedIn) {
    return { path: '/' }
  }
})

router.afterEach(() => globalLoaded.value = true)

export { router }
