<template>
  <div class="w-full">SoonTM</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Button from '../components/elements/Button.vue'
import TextInput from '../components/elements/form/TextInput.vue'
import InlineLink from '../components/elements/InlineLink.vue'
import store, { setTitle } from '../store'

export default defineComponent({
  components: { TextInput, Button, InlineLink },
  setup() {
    const state = reactive({
      loading: false,
    })

    setTitle('Your Account')

    const login = async () => {
      console.log('login')
    }

    return {
      state,
      store,
      login,
    }
  },
})
</script>
