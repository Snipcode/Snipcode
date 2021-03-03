<template>
  <div v-if="state.paste" class="text-console text-xs font-mono">
    {{ state.paste.content }}

    <div class="mt-6 flex text-console font-mono gap-x-2 text-xs">
      >
      <div class="flex gap-x-4">
        <nuxt-link
          class="border-b mx-1 text-console font-mono border-console text-right hover:font-bold cursor-pointer uppercase"
          to="/"
        >
          Go Back
        </nuxt-link>
        <div
          @click.prevent="deletePaste"
          class="border-b mx-1 text-console font-mono border-console text-right hover:font-bold cursor-pointer uppercase"
        >
          Delete Paste
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import { PasteDto } from '@pastte/backend/src/http/dto/db/pasteDto'
import { get, remove } from '../api/paste'

export default defineComponent({
  setup() {
    const state = reactive({
      paste: null as PasteDto | null,
    })

    const router = useRouter()

    const loadPaste = async () => {
      try {
        const { data } = await get({
          id: router.currentRoute.params.id,
        })

        if (!data.success)
          throw new Error(`${data.error.kind}: ${data.error.message}`)

        state.paste = data.data.paste
      } catch (_) {
        alert('Paste not found.') // make something more fancy
        router.push('/')
      }
    }

    const deletePaste = async () => {
      try {
        const { data } = await remove({
          id: router.currentRoute.params.id,
        })

        if (!data.success)
          throw new Error(`${data.error.kind}: ${data.error.message}`)

        router.push('/')
      } catch (_) {
        alert('An error occurred.') // make something more fancy
      }
    }

    loadPaste()

    return {
      state,
      deletePaste,
    }
  },
})
</script>
