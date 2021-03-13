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
          <with-arrow class="mb-4">
            <Input
              type="text"
              autocomplete="invite-code"
              placeholder="Invite Code"
              tabindex="0"
              v-model.trim="form.code"
            />
            <span class="text-gray-500 text-xs font-mono">(optional)</span>
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
import {
  defineComponent,
  reactive,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
import { register } from '../api/auth'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import Header from '../components/layout/Header.vue'
import Input from '../components/form/Input.vue'
import Error from '../components/elements/Error.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { parseInviteCodeFromRoute } from '../api/user'

export default defineComponent({
  components: { Header, WithArrow, Button, Input, Error },
  middleware: 'requiredUnauth',
  setup() {
    const router = useRouter()

    const form = reactive({
      username: '',
      password: '',
      code: parseInviteCodeFromRoute(router.currentRoute),
      error: null as string | null,
    })

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

    const { $accessor } = useContext()

    const submit = async () => {
      v.value.$touch()
      if (v.value.$error) return

      try {
        const { data } = await register(form)

        if (!data.success)
          return (form.error =
            data.error.message ?? 'An unexpected error has occurred.')

        $accessor.setTimedAlert({
          value: 'Registered successfully.',
          time: 1000,
        })

        router.push('/login')
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
