<template>
  <button
    :disabled="disabled"
    :class="[
      disabled
        ? 'border-purple-600/25 bg-purple-600/25 text-gray-400 cursor-not-allowed'
        : 'border-purple-500 border-opacity-50 hover:border-opacity-100 hover:bg-purple-500 transition text-white',
    ]"
    class="px-4 py-1 rounded-full border font-mono uppercase transition duration-150 ease-in-out outline-none focus:outline-none"
    @click="(e) => $emit('click', e)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
