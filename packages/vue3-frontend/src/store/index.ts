import { reactive, App } from 'vue'

const store = reactive({})

const storePlugin = (app: App) => {
  app.provide('store', store)
  app.config.globalProperties.$store = store
}

export { store, storePlugin }
export default store
