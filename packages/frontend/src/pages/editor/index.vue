<template>
  <div>
    <div ref="editor" class="w-full h-full min-w-screen min-h-screen"></div>
    <Corner class="flex justify-center items-center gap-x-8">
      <div>
        <div class="text-white font-mono">
          <router-link to="/" class="border-b">Snipcode</router-link> Editor
          (beta)
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

      <div>
        <div class="flex justify-center gap-x-2">
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
      </div>
    </Corner>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import {
  create as apiCreatePaste,
  get,
  edit as apiEditPaste,
} from '../../api/paste'
import Button from '../../components/elements/Button.vue'
import InviteOnly from '../../components/logic/InviteOnly.vue'
import { configureEditor, editorThemeName } from '../../editor'
import { PasteDto } from '@snipcode/backend/src/dto/db/pasteDto'
import { useRouter } from 'vue-router'
import { notify } from '../../notify'
import Corner from '../../components/elements/Corner.vue'

export default defineComponent({
  middleware: 'requiredAuth',
  components: { Button, InviteOnly, Corner },
  setup() {
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

          router.push(`/editor/${data.data.paste.id}`)
        } else {
          await apiEditPaste({
            id: state.currentPaste.id,
            content: state.newPaste,
            public: state.public,
          })
        }
        notify({
          type: 'success',
          message: 'Saved',
        })
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
          notify({
            type: 'error',
            message: 'Paste not found'
          })
          router.push('/editor/')
        }
      }

      if (editor.value) {
        // Configure Monaco
        await configureEditor(monaco)

        // Create the editor instance
        const $m = monaco.editor.create(editor.value, {
          value: state.newPaste,
          language: state.language,
          theme: editorThemeName,
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
