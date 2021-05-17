<template>
  <div class="w-screen h-screen bg-purple-900 font-mono text-white px-8 py-4">
    <textarea
      type="text"
      class="w-full h-full bg-transparent outline-none"
      :placeholder="`Welcome to ${store.options.name}. When you're done, just press Ctrl+S to save the snip... code away!`"
      autofocus
    />
    <div class="py-4 bg-purple-800 fixed top-0 right-0 shadow-xl">
      <div class="px-8 pb-4 mb-4 border-b border-purple-500 text-center">
        <inline-link class="text-xl" is="router-link" to="/">
          {{ store.options.name }}
        </inline-link>
      </div>
      <div class="flex px-8">
        <Button href="#" class="mr-2">Save</Button>
        <Button href="#" class="mr-2">Editor</Button>
        <Button to="/" :is="'router-link'">Account</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../components/elements/Button.vue'
import InlineLink from '../components/elements/InlineLink.vue'
import store from '../store'

export default defineComponent({
  components: { Button, InlineLink },
  setup() {
    return {
      store,
    }
  },
})
</script>
