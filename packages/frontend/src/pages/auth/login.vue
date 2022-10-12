<template>
  <div class="flex flex-col gap-y-4">
    <form @submit.prevent="submit" class="w-full flex flex-col gap-y-6">
      <h1 class="text-white text-4xl mb-4">Login</h1>
      <div class="flex flex-col gap-y-2">
        <Input
          type="text"
          class="w-full"
          autocomplete="username"
          placeholder="Username"
          tabindex="0"
          required
          @input="v.username.$touch"
          v-model.trim="form.username"
        />
        <div
          v-if="v.username.$error"
          class="text-red-500 text-xs"
        >
          You need to enter the username.
        </div>
      </div>
      <div class="flex flex-col gap-y-2">
        <Input
          type="password"
          class="w-full"
          autocomplete="password"
          placeholder="Password"
          tabindex="0"
          required
          @input="v.password.$touch"
          v-model.trim="form.password"
        />
        <p
          v-if="v.password.$error"
          class="text-red-500 text-xs"
        >
          You need to enter the password.
        </p>
      </div>
      <div class="flex items-center gap-4">
        <Button type="submit">Login</Button>
        <router-link
          to="/auth/register"
          class="text-gray-400 hover:text-gray-200 transition"
          >Don't have an account yet?</router-link
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../api/auth'
import Button from '../../components/elements/Button.vue'
import WithArrow from '../../components/elements/WithArrow.vue'
import Input from '../../components/form/Input.vue'
import Error from '../../components/elements/Error.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { notify } from '../../notify'
import { global } from '../../constants'

export default defineComponent({
  components: { WithArrow, Button, Input, Error },
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
          return notify({
            type: 'error',
            message: data.error?.message ?? global.messages.unknownError,
          })

        notify({
          type: 'success',
          message: global.messages.loggedIn,
        })
        router.push('/')
      } catch (_) {
        return notify({
          type: 'error',
          message: global.messages.unknownError,
        })
      }
    }

    return {
      submit,
      form,
      v,
      global,
    }
  },
})
</script>
