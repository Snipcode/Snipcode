<template>
  <div class="mb-8">
    <div class="text-gray-400">Snipcode v3</div>
    <h1 class="text-white font-medium text-6xl">Login</h1>
  </div>
  <form>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../../components/elements/Button.vue'
import TextInput from '../../components/elements/form/TextInput.vue'

export default defineComponent({
  components: { TextInput, Button },
  setup() {},
})
</script>
