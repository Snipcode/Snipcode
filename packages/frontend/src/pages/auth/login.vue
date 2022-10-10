<template>
  <div>
    <Header :authNav="true" />
    <div class="px-5 py-6">
      <error v-if="form.error">
        {{ form.error }}
      </error>
      <with-arrow class="mb-6">
        <h1 class="font-mono text-white text-2xl">Login</h1>
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
              @input="v.username.$touch"
              v-model.trim="form.username"
            />
            <span
              v-if="v.username.$error"
              class="text-red-500 text-sm font-mono md:ml-2"
              >You need to enter the username.</span
            >
          </with-arrow>
          <with-arrow class="mb-4">
            <Input
              type="password"
              autocomplete="password"
              placeholder="Password"
              tabindex="0"
              required
              @input="v.password.$touch"
              v-model.trim="form.password"
            />
            <span
              v-if="v.password.$error"
              class="text-red-500 text-sm font-mono md:ml-2"
              >You need to enter the password.</span
            >
          </with-arrow>
          <div>
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import {useRouter} from 'vue-router'
import { login } from '../../api/auth'
import Button from '../../components/elements/Button.vue'
import WithArrow from '../../components/elements/WithArrow.vue'
import Header from '../../components/layout/Header.vue'
import Input from '../../components/form/Input.vue'
import Error from '../../components/elements/Error.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

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

    const v = useVuelidate(
      {
        username: {
          required,
        },
        password: {
          required,
        },
      },
      form
    )

    const submit = async () => {
      v.value.$touch()
      if (v.value.$error) return

      try {
        const { data } = await login(form)

        if (!data.success)
          return (form.error =
            data.error.message ?? 'An unexpected error has occurred.')

        router.push('/')
      } catch (_) {
        form.error = 'An unexpected error has occurred.'
      }
    }

    return {
      submit,
      form,
      v,
    }
  },
})
</script>
