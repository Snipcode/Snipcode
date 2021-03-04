<template>
  <div>
    <Header :showHome="false">
      <Button :disabled="isSaveDisabled()" @click.prevent="createPaste">
        Save
      </Button>
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

export default defineComponent({
  middleware: 'requiredAuth',
  components: { Header, Button, WithArrow },
  setup() {
    const state = reactive({
      newPaste: '',
      loading: false,
    })

    const router = useRouter()

    // Creates a paste
    const createPaste = async () => {
      if (state.loading) return
      state.loading = true

      try {
        const { data } = await apiCreatePaste({ content: state.newPaste })
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
