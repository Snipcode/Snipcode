<template>
  <highlightjs
    v-if="state.paste"
    :code="state.paste.content"
    autodetect
    class="highlight px-3 py-1"
  />
  <div class="text-white font-mono px-3" v-else>Loading...</div>

  <div
    v-if="state.paste"
    class="
      absolute
      bg-gray-800
      bottom-24
      left-0
      rounded-xl
      md:bottom-0
      md:right-0
      md:left-auto
      md:rounded-b-none
      md:rounded-tr-none
      shadow-xl
      px-4
      py-3
      inline-flex
      w-fit
      gap-x-2
    "
  >
    <Link :to="`/editor/${state.paste.id}`">Open in editor</LInk>
    <Button
      @click.prevent="deletePaste"
      v-if="user && user.id === state.paste.userId"
    >
      Delete Paste
    </Button>
  </div>
</template>

<style lang="scss">
pre.highlight {
  height: 74vh;

  & > code.hljs {
    height: 74vh;
  }
}
</style>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { PasteDto } from '@snipcode/backend/src/dto/db/pasteDto'
import { ErrorKind } from '@snipcode/backend/src/utils/response'
import { get, remove } from '../api/paste'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import { useRouter } from 'vue-router'
import { addTimedAlert, Alert } from '../store/Alert'
import { user } from '../store'
import Link from '../components/elements/Link.vue'

export default defineComponent({
  components: { WithArrow, Button, Link },
  setup() {
    const state = reactive({
      paste: null as PasteDto | null,
    })

    const router = useRouter()

    const loadPaste = async () => {
      try {
        const { data } = await get({
          id: router.currentRoute.value.params.id.toString(),
        })

        if (!data.success) {
          if (data.error.kind === ErrorKind.FORBIDDEN)
            return router.push('/login')
          throw new Error(`${data.error.kind}: ${data.error.message}`)
        }

        state.paste = data.data.paste
      } catch (_) {
        addTimedAlert(new Alert('Paste not found'), 1000)
        router.push('/')
      }
    }

    const deletePaste = async () => {
      try {
        const { data } = await remove({
          id: router.currentRoute.value.params.id.toString(),
        })

        if (!data.success)
          throw new Error(`${data.error.kind}: ${data.error.message}`)

        router.push('/')
      } catch (e) {
        addTimedAlert(
          new Alert((e as any)?.message ?? 'Unknown error has occurred'),
          1000
        )
      }
    }

    loadPaste()

    return {
      state,
      deletePaste,
      user,
    }
  },
})
</script>
