<template>
  <div
    class="block md:flex text-left border-b border-gray-700 px-4 py-3 justify-between items-center"
  >
    <div class="mb-4 md:mb-0 text-center md:text-left">
      <h1 class="tracking-tightest text-gray-100 font-mono">Snipcode v2.0</h1>
      <h2 class="tracking-tightest text-gray-100 font-mono">
        Paste-and-save quickly and easily!
      </h2>
      <footer class="tracking-tightest text-gray-100 font-mono">
        2021 &copy; Snipcode &ndash; Made by
        <a
          href="https://github.com/VottusCode"
          target="_blank"
          rel="noreferrer noopener"
          class="font-medium border-b border-gray-700"
          >VottusCode</a
        >
        &ndash;
        <a
          href="https://github.com/Snipcode"
          target="_blank"
          rel="noreferrer noopener"
          class="font-medium border-b border-gray-700"
        >
          Source
        </a>
      </footer>
    </div>
    <div v-if="authNav" class="flex gap-x-2 justify-center">
      <slot />
      <Link
        :to="path === '/login' ? '/register' : '/login'"
        class="px-4 py-1 rounded-full border border-gray-700 hover:bg-gray-700 text-white font-mono uppercase transition duration-150 ease-in-out cursor-pointer"
      >
        {{ path === '/login' ? 'Register' : 'Login' }}
      </Link>
    </div>
    <div class="flex gap-x-2 justify-center" v-else>
      <slot />
      <Link
        to="/"
        v-if="showHome"
        class="px-4 py-1 rounded-full border border-gray-700 hover:bg-gray-700 text-white font-mono uppercase transition duration-150 ease-in-out cursor-pointer"
      >
        Home
      </Link>
      <Link
        to="/pastes"
        class="px-4 py-1 rounded-full border border-gray-700 hover:bg-gray-700 text-white font-mono uppercase transition duration-150 ease-in-out cursor-pointer"
      >
        Your Pastes
      </Link>
      <a
        @click.prevent="logout"
        class="px-4 py-1 rounded-full border border-gray-700 hover:bg-gray-700 text-white font-mono uppercase transition duration-150 ease-in-out cursor-pointer"
      >
        Logout
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'
import Link from '../elements/Link.vue'
import { logout as apiLogout } from '../../api/auth'

export default defineComponent({
  props: {
    showHome: {
      type: Boolean,
      default: true,
    },
    authNav: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Link,
  },
  setup() {
    const router = useRouter()

    const { $accessor } = useContext()

    const logout = async () => {
      await apiLogout()
      $accessor.user.setUser(null)
      router.push('/login')
    }

    return {
      logout,
      path: router.currentRoute.path,
    }
  },
})
</script>
