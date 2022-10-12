<template>
  <router-view v-if="globalLoaded" />
  <div v-else class="w-screen h-screen flex justify-center items-center bg-gray-900 text-white">
    <div class="text-center flex flex-col items-center gap-y-6">
      <h1 class="text-5xl italic">{{ global.name }}</h1>
      <Spinner class="w-8 h-8"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { global } from './constants'
import { globalLoaded } from './store'
import Spinner from "./components/elements/Spinner.vue"

export default defineComponent({
  components: {Spinner},
  setup() {
    return {
      global,
      globalLoaded,
    }
  },
})
</script>
