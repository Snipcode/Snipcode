<template>
  <div class="flex flex-col gap-y-4">
    <form @submit.prevent="submit" class="w-full flex flex-col gap-y-6">
      <h1 class="text-white text-4xl mb-4">Login</h1>
      <div class="flex flex-col gap-y-2">
        <Input
          type="text"
          autocomplete="username"
          placeholder="Username"
          tabindex="0"
          required
          @input="v.username.$touch"
          v-model.trim="form.username"
        />
        <div v-if="v.username.$error" class="text-red-500 text-sm font-mono">
          You need to enter the username.
        </div>
      </div>
      <div class="flex flex-col gap-y-2">
        <Input
          type="password"
          autocomplete="password"
          placeholder="Password"
          tabindex="0"
          required
          @input="v.password.$touch"
          v-model.trim="form.password"
        />
        <div
          v-if="v.password.$error"
          class="text-red-500 text-sm font-mono"
        >
          You need to enter the password.
        </div>
      </div>
      <div>
        <Input
          type="text"
          autocomplete="invite-code"
          placeholder="Invite Code"
          tabindex="0"
          v-model.trim="form.code"
        />
        <span class="text-gray-400 text-xs ml-2">(optional)</span>
      </div>
      <div class="flex items-center gap-4">
        <Button type="submit">Register</Button>
        <router-link
          to="/auth/login"
          class="text-gray-400 hover:text-gray-200 transition"
          >Already have an account?</router-link
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { register } from '../../api/auth'
import Button from '../../components/elements/Button.vue'
import WithArrow from '../../components/elements/WithArrow.vue'
import Input from '../../components/form/Input.vue'
import Error from '../../components/elements/Error.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { parseInviteCodeFromRoute } from '../../api/user'
import { useRouter } from 'vue-router'
import { addTimedAlert, Alert } from '../../store/Alert'

export default defineComponent({
  components: { WithArrow, Button, Input, Error },
  middleware: 'requiredUnauth',
  setup() {
    const router = useRouter()

    const form = reactive({
      username: '',
      password: '',
      code: parseInviteCodeFromRoute(router.currentRoute.value),
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

    const submit = async () => {
      v.value.$touch()
      if (v.value.$error) return

      try {
        const { data } = await register(form)

        if (!data.success)
          return (form.error =
            data.error.message ?? 'An unexpected error has occurred.')

        addTimedAlert(new Alert('Registered successfully'), 1000)

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
