<template>
  <div>
    <Header :showHome="false">
      <invite-only>
        <div class="flex flex-col justify-center">
          <label for="public" class="text-xs text-white font-mono"
            >Public?</label
          >
          <input type="checkbox" name="public" v-model="state.public" />
        </div>
      </invite-only>
      <Button :disabled="isSaveDisabled()" @click.prevent="createPaste">
        Save
      </Button>
      <Link to="/editor">Editor</Link>
    </Header>
    <with-arrow class="px-5 py-6">
      <textarea
        type="text"
        v-model="state.newPaste"
        class="w-full min-h-full min-w-full text-gray-200 bg-transparent outline-none font-mono resize-none pr-4"
        autofocus
        style="height: 74vh"
      />
    </with-arrow>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import Header from '../components/layout/Header.vue'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import { create as apiCreatePaste } from '../api/paste'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import InviteOnly from '../components/logic/InviteOnly.vue'
import Link from '../components/elements/Link.vue'

export default defineComponent({
  middleware: 'requiredAuth',
  components: { Header, Button, WithArrow, InviteOnly, Link },
  setup() {
    const state = reactive({
      newPaste: '',
      public: false,
      loading: false,
    })

    const router = useRouter()

    const v = useVuelidate(
      {
        newPaste: {
          required,
        },
      },
      state
    )

    // Creates a paste
    const createPaste = async () => {
      if (state.loading) return
      state.loading = true

      v.value.$touch()
      if (v.value.$error) return

      try {
        const { data } = await apiCreatePaste({
          content: state.newPaste,
          public: state.public,
        })
        if (!data.success) throw new Error(data.error.message)

        router.push(`/${data.data.paste.id}`)
      } catch (_) {}

      state.loading = false
    }

    // Is the save button disabled?
    const isSaveDisabled = () => {
      if (state.loading) return true
      return state.newPaste.trim().length < 1
    }

    // Ctrl+V event
    window.addEventListener('paste', async () => {
      if (!isSaveDisabled()) return
      if (
        document.activeElement &&
        document.activeElement.tagName === 'TEXTAREA'
      )
        return

      console.log('[client] paste event triggered')
      try {
        const clipboard = await navigator.clipboard.readText()
        if (!clipboard) return

        state.newPaste = clipboard
        createPaste()
      } catch (e) {
        console.log("[client] couldn't paste", { e })
      }
    })

    return {
      state,
      createPaste,
      isSaveDisabled,
    }
  },
})
</script>
