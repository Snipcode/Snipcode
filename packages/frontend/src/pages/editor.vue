<template>
  <div>
    <div ref="editor" class="w-full h-full min-w-screen min-h-screen"></div>
    <div
      class="z-10 absolute bottom-0 right-0 bg-gray-main flex justify-center py-4 px-6"
    >
      <div>
        <div class="text-white font-mono">Pastte.it Editor (beta)</div>

        <div class="flex mt-2 justify-center gap-x-2">
          <Button @click.prevent="createPaste">Save</Button>
          <invite-only>
            <div class="flex flex-col justify-center">
              <label for="public" class="text-xs text-white font-mono"
                >Public?</label
              >
              <input type="checkbox" name="public" v-model="state.public" />
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
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import * as monaco from 'monaco-editor'
import { create as apiCreatePaste } from '../api/paste'
import Button from '../components/elements/Button.vue'
import InviteOnly from '../components/logic/InviteOnly.vue'
import configureThemes from '../editor/configureThemes'
import { emmetHTML, emmetCSS } from 'emmet-monaco-es'

export default defineComponent({
  components: { Button, InviteOnly },
  setup() {
    const editor = ref<HTMLDivElement | null>(null)

    const state = reactive({
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
        const { data } = await apiCreatePaste({
          content: state.newPaste,
          public: state.public,
        })
        if (!data.success) throw new Error(data.error.message)

        router.push(`/${data.data.paste.id}`)
      } catch (_) {}

      state.loading = false
    }

    onMounted(async () => {
      if (editor.value) {
        /**
         * Monaco Editor Settings for JS/TS
         */

        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        })

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2015,
          allowNonTsExtensions: true,
          allowJs: true,
        })

        emmetHTML(monaco)
        emmetCSS(monaco)

        /**
         * Configure themes
         */

        await configureThemes(monaco)

        /**
         * Create Theme Instance
         */

        const $m = monaco.editor.create(editor.value, {
          value: state.newPaste,
          language: state.language,
          theme: 'oceanicNext',
        })

        /**
         * Sync changes with state
         */

        $m.onDidChangeModelContent((_) => (state.newPaste = $m.getValue()))

        /**
         * Save on Ctrl+S
         */

        $m.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, createPaste)

        /**
         * Watch language change
         */

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
