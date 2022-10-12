import { createApp } from 'vue'
import highlightPlugin from '@highlightjs/vue-plugin'
import { router } from './router'

import './assets/app.css'
import 'highlight.js/styles/atom-one-dark.css'

import App from "./app.vue"

const $app = createApp(App)

$app.use(router)
$app.use(highlightPlugin)

$app.mount('#app')
