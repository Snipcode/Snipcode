<template>
  <div>
    <Header>
      <Button
        @click.prevent="deletePaste"
        v-if="state.paste && user && user.id === state.paste.userId"
        >Delete Paste</Button
      >
    </Header>

    <highlightjs
      v-if="state.paste"
      :code="state.paste.content"
      autodetect
      class="px-2 py-4 highlight"
    />
    <div class="text-white font-mono px-4 py-6" v-else>Loading...</div>
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
import {
  computed,
  defineComponent,
  reactive,
} from 'vue'
import { PasteDto } from '@snipcode/backend/src/http/dto/db/pasteDto'
import { ErrorKind } from '@snipcode/backend/src/http/helpers/responseHelper'
import { get, remove } from '../api/paste'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import Header from '../components/layout/Header.vue'
import {useRouter} from "vue-router";
import {addTimedAlert, Alert} from "../store/Alert";
import {user} from "../store";

export default defineComponent({
  components: { Header, WithArrow, Button },
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
        addTimedAlert(new Alert((e as any)?.message ?? 'Unknown error has occurred'), 1000)
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
