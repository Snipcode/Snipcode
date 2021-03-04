<template>
  <div>
    <Header :authNav="true" />
    <div class="px-5 py-6">
      <error v-if="form.error">
        {{ form.error }}
      </error>
      <with-arrow class="mb-6">
        <h1 class="font-mono text-white text-2xl">Register</h1>
      </with-arrow>

      <div class="flex flex-col gap-y-4">
        <form @submit.prevent="submit">
          <with-arrow class="mb-4">
            <Input
              type="text"
              autocomplete="username"
              placeholder="Username"
              tabindex="0"
              required
              v-model.trim="form.username"
            />
          </with-arrow>
          <with-arrow class="mb-4">
            <Input
              type="password"
              autocomplete="password"
              placeholder="Password"
              tabindex="1"
              required
              v-model.trim="form.password"
            />
          </with-arrow>
          <div>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import { register } from '../api/auth'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import Header from '../components/layout/Header.vue'
import Input from '../components/form/Input.vue'
import Error from '../components/elements/Error.vue'

export default defineComponent({
  components: { Header, WithArrow, Button, Input, Error },
  middleware: 'requiredUnauth',
  setup() {
    const form = reactive({
      username: '',
      password: '',
      error: null as string | null,
    })

    const router = useRouter()

    const submit = async () => {
      try {
        const { data } = await register(form)

        if (!data.success)
          return (form.error =
            data.error.message ?? 'An unexpected error has occurred.')

        router.push('/login')
      } catch (_) {
        form.error = 'An unexpected error has occurred.'
      }
    }

    return {
      submit,
      form,
    }
  },
})
</script>
