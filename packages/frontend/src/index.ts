import { createApp } from 'vue'
import { RouterView } from 'vue-router'
import highlightPlugin from '@highlightjs/vue-plugin'
import { router } from './router'

import './assets/tailwind.css'
import 'highlight.js/styles/atom-one-dark.css'

const $app = createApp(RouterView)

$app.use(router)
$app.use(highlightPlugin)

$app.mount('#app')
