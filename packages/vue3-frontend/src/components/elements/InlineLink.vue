<template>
  <component
    :is="is"
    class="
      mx-1
      underline
      hover:text-purple-300
      transition
      ease-in-out
      duration-300
      font-medium
      border-purple-700
      text-purple-400
    "
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    is: {
      type: String,
      default: 'a',
    },
  },
})
</script>
