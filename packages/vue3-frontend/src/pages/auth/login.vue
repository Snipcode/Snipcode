<template>
  <div class="flex flex-col md:flex-row justify-between">
    <div>
      <div class="mb-8">
        <div class="text-purple-400">Snipcode v3</div>
        <h1 class="text-white font-medium text-5xl">Login</h1>
      </div>

      <form class="w-full">
        <div class="pb-4">
          <div class="py-2">
            <text-input placeholder="Username" />
          </div>
          <div class="py-2">
            <text-input placeholder="Password" type="password" />
          </div>
        </div>
        <div>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Button from '../../components/elements/Button.vue'
import TextInput from '../../components/elements/form/TextInput.vue'

export default defineComponent({
  components: { TextInput, Button },
  setup() {
    const state = reactive({
      loading: false,
    })

    return {
      state,
    }
  },
})
</script>
