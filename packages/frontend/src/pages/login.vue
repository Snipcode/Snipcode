<template>
  <form @submit.prevent="submit">
    <div class="mb-6 text-center font-medium">
      <h3 class="text-xl">Login</h3>
    </div>

    <div
      class="mb-4 px-4 py-1 bg-red-500 w-full rounded-full text-center text-white"
      v-if="form.error"
    >
      {{ form.error }}
    </div>

    <div class="mb-2">
      <input
        type="text"
        class="px-4 py-1 bg-gray-200 border-2 border-transparent focus:border-purple-600 w-full rounded-full outline-none transition duration-1500 ease-in-out"
        placeholder="Username"
        v-model="form.username"
      />
    </div>

    <div class="mb-4">
      <input
        type="text"
        class="px-4 py-1 bg-gray-200 border-2 border-transparent focus:border-purple-600 w-full rounded-full outline-none transition duration-1500 ease-in-out"
        placeholder="Password"
        v-model="form.password"
      />
    </div>

    <div class="text-center mb-6">
      <a
        @click.prevent="submit"
        class="px-6 py-2 rounded-full border-2 border-purple-400 hover:border-purple-500 hover:bg-gray-100 cursor-pointer transition duration-1500 ease-in-out"
        >Login</a
      >
    </div>

    <div class="text-center">
      <span class="text-gray-700"
        >Don't have an account yet? Make a new one
        <nuxt-link
          to="/register"
          class="font-medium border-b border-gray-500 text-gray-600"
          >here</nuxt-link
        >.</span
      >
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import { login } from '../api/auth'

export default defineComponent({
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
    }
  },
})
</script>
