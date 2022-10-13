<template>
  <div>
    <with-arrow class="px-3">
      <textarea
        type="text"
        v-model="state.newPaste"
        class="
          w-full
          min-h-full min-w-full
          text-gray-200
          bg-transparent
          outline-none
          font-mono
          resize-none
          pr-1
        "
        autofocus
        style="height: 74vh"
      />
    </with-arrow>
  </div>

  <Corner class="inline-flex justify-center items-center gap-x-4">
    <Button :disabled="isSaveDisabled" @click="createPaste">Save</Button>
    <p class="text-gray-400">or use <span class="font-mono">Ctrl+S</span></p>
  </Corner>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import { create as apiCreatePaste } from '../api/paste'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import InviteOnly from '../components/logic/InviteOnly.vue'
import Link from '../components/elements/Link.vue'
import { useRouter } from 'vue-router'
import { notify } from '../notify'
import Corner from '../components/elements/Corner.vue'

export default defineComponent({
  middleware: 'requiredAuth',
  components: { Button, WithArrow, InviteOnly, Link, Corner },
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
        notify({
          duration: 1000,
          type: 'success',
          message: 'Saved',
        })
      } catch (_) {}

      state.loading = false
    }

    // Is saving the paste disabled
    const isSaveDisabled = computed(
      () => state.loading ?? state.newPaste.trim().length < 1
    )

    // Ctrl+V event
    window.addEventListener('paste', async () => {
      // Do not do anything if there is already text in the textarea,
      // a paste is already being created or the textarea is currently focused.
      if (
        !isSaveDisabled.value ||
        state.loading ||
        (document.activeElement &&
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return
      }

      // Read the clipboard and create a new paste.
      try {
        const clipboard = await navigator.clipboard.readText()
        if (!clipboard) return

        state.newPaste = clipboard
        createPaste()
      } catch (e) {
        console.log('Could not read the clipboard', { e })
      }
    })

    // Ctrl+S shortcut
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return createPaste()
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
