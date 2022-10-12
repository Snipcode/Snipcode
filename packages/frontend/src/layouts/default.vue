<template>
  <div
    class="
      w-full
      h-full
      bg-black
      min-w-screen min-h-screen
      flex
      overflow-hidden
    "
  >
    <div
      class="
        absolute
        bg-gray-800
        top-0
        right-0
        rounded-bl-xl
        shadow-xl
        inline-block
        px-4
        py-3
      "
    >
      <div class="inline-flex gap-x-2 justify-center">
        <Link v-if="route.path !== '/'"> Home </Link>
        <Link to="/pastes"> Your Pastes </Link>
        <Link to="/editor"> Editor </Link>
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
import { alert, user } from '../store'
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
      alert,
      logout,
      route: router.currentRoute,
    }
  },
})
</script>
