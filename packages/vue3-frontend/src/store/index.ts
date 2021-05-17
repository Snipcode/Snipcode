import { App, reactive } from 'vue'
import { Alert } from './types'

const store = reactive({
  alerts: [] as Alert[],
  user: null,
  pageTitle: '',
  title: '',
  options: {
    name: 'Snipcode',
    auth: {
      allowRegister: true,
      requiredAuthToPaste: true,
      requiredAuthToPastePublic: true,
    },
  },
})

const storePlugin = {
  install: (app: App) => {
    app.provide('store', store)
    app.config.globalProperties.$store = store
  },
}

export { store, storePlugin }

// Fluent Store API
export * from './fluent'

export default store
