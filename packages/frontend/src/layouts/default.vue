<template>
  <div
    class="
      w-full
      h-full
      bg-gray-main
      min-w-screen min-h-screen
      flex
      overflow-hidden
    "
  >
    <div
      class="
        z-10
        absolute
        bg-gray-800
        bottom-0
        left-0
        rounded-tr-xl
        shadow-xl
        inline-block
        px-4
        py-3
      "
    >
      <div class="inline-flex gap-x-2 justify-center">
        <Link v-if="route.path !== '/'" to="/"> + </Link>
        <Link to="/pastes"> Pastes </Link>
        <Button @click="logout"> Logout </Button>
      </div>
    </div>
    <div
      class="flex bg-transparent shadow-2xl w-full border-gray-700 bg-gray-800"
    >
      <div class="w-full h-full">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../components/elements/Button.vue'
import Link from '../components/elements/Link.vue'
import { globalLoaded, user } from '../store'
import {logout as apiLogout} from "../api/auth"
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { Link, Button },
  setup() {
    const router = useRouter()

    const logout = async () => {
      await apiLogout()
      user.value = null
      router.push('/auth/login')
    }

    return {
      logout,
      route: router.currentRoute,
    }
  },
})
</script>
