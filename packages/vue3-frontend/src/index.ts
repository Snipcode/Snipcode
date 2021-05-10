import { createApp } from 'vue'
import { RouterView } from 'vue-router'
import router from './router'
import { storePlugin as store } from './store'

import './assets/tailwind.css'

const app = createApp(RouterView)

app.use(router).use(store)

app.mount('#app')
