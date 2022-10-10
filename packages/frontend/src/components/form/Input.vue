<template>
  <input
    @input="() => $emit('input', val)"
    class="border-b bg-transparent font-mono border-gray-700 focus:border-gray-600 placeholder-gray-700 focus:placeholder-gray-600 text-gray-600 focus:text-white outline-none"
    v-model="val"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const val = ref('')
    return { val }
  },
})
</script>
