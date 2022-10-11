import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monaco from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // @ts-ignore idfk
    monaco.default({
      languageWorkers: [
        'editorWorkerService',
        'css',
        'html',
        'json',
        'typescript',
      ],
    }),
  ],
})
