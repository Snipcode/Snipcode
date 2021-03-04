<template>
  <div>
    <Header>
      <Button @click.prevent="deletePaste">Delete Paste</Button>
    </Header>
    <highlightjs
      v-if="state.paste"
      :code="state.paste.content"
      autodetect
      class="px-2 py-4"
    />
    <div class="text-white font-mono px-4 py-6" v-else>Loading...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import { PasteDto } from '@pastte/backend/src/http/dto/db/pasteDto'
import { get, remove } from '../api/paste'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import Header from '../components/layout/Header.vue'

export default defineComponent({
  components: { Header, WithArrow, Button },
  middleware: 'requiredAuth',
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
