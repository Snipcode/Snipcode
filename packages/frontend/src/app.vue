<template>
  <div
    class="w-full h-full bg-black min-w-screen min-h-screen flex overflow-hidden"
  >
    <div
      class="flex bg-transparent shadow-2xl w-full border-gray-700 bg-gray-main"
    >
      <div class="w-full h-full">
        <router-view />
      </div>
    </div>
    <div
      class="border-2 bg-gray-main p-4 absolute z-10 bottom-5 left-5"
      v-if="alert"
    >
      <div class="flex">
        <div class="flex-1 md:flex md:justify-between">
          <p class="text-sm text-white font-mono">
            {{ alert }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { alert, socket, user } from './store'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter();
    const loaded = ref(false)

    return {
      loaded,
      alert,
    }
  },
})
</script>
