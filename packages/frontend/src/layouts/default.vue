<template>
  <div
    class="w-full h-full bg-black min-w-screen min-h-screen flex overflow-hidden"
  >
    <div
      class="flex bg-transparent shadow-2xl w-full border-gray-700 bg-gray-main"
    >
      <div class="w-full h-full">
        <Nuxt />
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
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $accessor } = useContext()

    return {
      alert: computed(() => $accessor.alert),
    }
  },
})
</script>
