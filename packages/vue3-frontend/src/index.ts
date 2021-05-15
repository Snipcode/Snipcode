// Vue

import { createApp } from 'vue'

// Plugins

import router from './router'
import { RouterView } from 'vue-router'
import { storePlugin as store } from './store'
import { httpPlugin as http } from './app'

import './assets/tailwind.css'

// Settings

const bindToWindow = false
const mount = '#app'

// Create App

const app = createApp(RouterView)

app.use(store).use(router).use(http)

app.mount(mount)

if (bindToWindow) (window as any)._app = app
