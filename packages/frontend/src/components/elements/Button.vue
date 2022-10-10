<template>
  <button
    :disabled="disabled"
    :class="[
      disabled
        ? 'border-gray-600 bg-gray-600 cursor-not-allowed'
        : 'border-gray-700 hover:bg-gray-700 text-white',
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
