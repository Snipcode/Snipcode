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

  <div
    class="
      z-10
      absolute
      bg-gray-800
      bottom-0
      right-0
      rounded-tl-xl
      shadow-xl
      inline-block
      px-4
      py-3
    "
  >
    <div class="flex justify-center items-center gap-x-4">
      <Button :disabled="isSaveDisabled" @click="createPaste">Save</Button>
      <p class="text-gray-400">or use <span class="font-mono">Ctrl+S</span></p>
    </div>
  </div>
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

export default defineComponent({
  middleware: 'requiredAuth',
  components: { Button, WithArrow, InviteOnly, Link },
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
            message: 'Saved'
          })
      } catch (_) {}

      state.loading = false
    }

    // Is the save button disabled?
    const isSaveDisabled = computed(
      () => state.loading ?? state.newPaste.trim().length < 1
    )

    // Ctrl+V event
    window.addEventListener('paste', async () => {
      if (!isSaveDisabled.value) return
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

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
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
