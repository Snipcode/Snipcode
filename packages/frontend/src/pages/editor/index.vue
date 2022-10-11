<template>
  <div>
    <div ref="editor" class="w-full h-full min-w-screen min-h-screen"></div>
    <div
      class="z-10 absolute bottom-0 right-0 bg-gray-main flex justify-center py-4 px-6"
    >
      <div>
        <div class="text-white font-mono">
          <nuxt-link to="/" class="border-b">Snipcode</nuxt-link> Editor (beta)
        </div>

        <div class="flex mt-2 justify-center gap-x-2">
          <Button @click.prevent="createPaste">Save</Button>
          <invite-only>
            <div class="flex flex-col justify-center">
              <label for="public" class="text-xs text-white font-mono"
                >Public?</label
              >
              <input
                type="checkbox"
                id="public"
                name="public"
                v-model="state.public"
              />
            </div>
          </invite-only>
        </div>

        <div class="flex mt-6 justify-center">
          <select
            class="bg-transparent text-white font-mono"
            v-model="state.language"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="php">PHP</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { create as apiCreatePaste, edit, get } from '../../api/paste'
import Button from '../../components/elements/Button.vue'
import InviteOnly from '../../components/logic/InviteOnly.vue'
import { configureEditor, getTheme } from '../../editor'
import { PasteDto } from '@snipcode/backend/src/dto/db/pasteDto'
import { CreateWebSocket } from '../../api/ws/createWebSocket'
import socketSend from '@snipcode/backend/src/utils/ws/socketSend'
import { useRouter } from 'vue-router'
import { socket as sock } from '../../store'
import { addTimedAlert, Alert } from '../../store/Alert'

export default defineComponent({
  middleware: 'requiredAuth',
  components: { Button, InviteOnly },
  setup: function () {
    const editor = ref<HTMLDivElement | null>(null)

    const state = reactive({
      currentPaste: null as PasteDto | null,
      newPaste: '',
      loading: false,
      public: false,
      monaco: null as any,
      language: 'javascript',
    })

    const router = useRouter()

    const [socket, emitter] = sock.value as CreateWebSocket

    const createPaste = async () => {
      if (state.loading) return
      state.loading = true

      if (!state.newPaste || state.newPaste.trim().length < 1) return

      try {
        if (!state.currentPaste) {
          const { data } = await apiCreatePaste({
            content: state.newPaste,
            public: state.public,
          })
          if (!data.success) throw new Error(data.error.message)

          addTimedAlert(new Alert('Paste created'), 1000)
          router.push(`/editor/${data.data.paste.id}`)
        } else {
          socketSend(socket, {
            action: 'paste_edit',
            data: {
              id: state.currentPaste.id,
              content: state.newPaste,
              public: state.public,
            },
          })

          emitter.once('action_paste_edit', (msg) => {
            state.currentPaste = msg.data.data.paste
            addTimedAlert(new Alert('Paste updateed'), 1000)
          })
        }
      } catch (_) {}

      state.loading = false
    }

    onMounted(async () => {
      const pasteId = router.currentRoute.value.params.id?.toString()
      if (pasteId && pasteId.trim().length > 1) {
        try {
          const { data } = await get({ id: pasteId })
          if (!data.success) throw new Error()

          state.currentPaste = data.data.paste
          state.newPaste = data.data.paste.content
          state.public = data.data.paste.public!
        } catch (_) {
          alert('Paste not found.')
          router.push('/editor/')
        }
      }

      if (editor.value) {
        // Configure Monacop
        await configureEditor(monaco)

        // Create the editor instance
        const $m = monaco.editor.create(editor.value, {
          value: state.newPaste,
          language: state.language,
          theme: getTheme(),
        })

        // Sync changes with state
        $m.onDidChangeModelContent((_) => (state.newPaste = $m.getValue()))

        // Save on Ctrl+S
        $m.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, createPaste)

        // Watch language change
        watch(state, (newVal) => {
          const model = $m.getModel()
          if (model) monaco.editor.setModelLanguage(model, newVal.language)
        })
      }
    })

    return { editor, state, createPaste }
  },
})
</script>
