<template>
  <div>
    <form>
      <div class="pr-2 flex text-console font-mono gap-x-2 text-xs">
        >
        <textarea
          v-model="state.newPaste"
          type="text"
          class="bg-transparent w-full outline-none resize-none"
          placeholder="Enter your paste..."
        />
      </div>

      <div class="mb-6 flex text-console font-mono gap-x-2 text-xs">
        >
        <div class="flex gap-x-4">
          <div
            class="border-b mx-1 text-console font-mono border-console text-right hover:font-bold cursor-pointer uppercase"
            @click.prevent="createPaste"
          >
            Submit
          </div>
          <div
            class="border-b mx-1 text-console font-mono border-console text-right hover:font-bold cursor-pointer uppercase"
            @click.prevent="createPaste"
          >
            Editor
          </div>
        </div>
      </div>

      <div class="mb-2 flex text-console font-mono gap-x-2 text-xs">
        >
        <div class="flex gap-x-4">
          <div
            class="border-b mx-1 text-console font-mono border-console text-right hover:font-bold cursor-pointer uppercase"
            @click.prevent="state.showPastes = !state.showPastes"
          >
            Your Pastes
          </div>
          <div
            class="border-b mx-1 text-console font-mono border-console text-right hover:font-bold cursor-pointer uppercase"
          >
            Logout
          </div>
        </div>
      </div>
    </form>

    <div class="mt-6">
      <div v-if="state.showPastes" class="overflow-auto max-h-36">
        <div v-for="(paste, i) in state.pastes" :key="i">
          <nuxt-link
            :to="`/${paste.id}`"
            class="flex justify-between py-1 px-2 mr-2 border-2 border-double border-console mb-2 text-console text-xs font-mono group cursor-pointer"
          >
            <div class="flex gap-x-2">
              <span class="hidden group-hover:flex">></span>
              <div>
                {{ truncate(paste.content) }}

                <div class="mt-1 text-xss">
                  {{ new Date(paste.createdAt).toLocaleString() }}
                </div>
              </div>
            </div>

            <div
              class="flex items-center hover:bg-console hover:text-white"
              @click.prevent="() => removePaste({ id: paste.id })"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import { PasteDto } from '@pastte/backend/src/http/dto/db/pasteDto'
import socketSend from '@pastte/backend/src/ws/helpers/socketSend'
import { create as newPaste, remove as removePaste } from '../api/paste'
import { baseUrl } from '../api/axios'
import { createEventEmitter } from '../api/ws/createEventEmitter'

export default defineComponent({
  middleware: 'requiredAuth',
  setup() {
    const state = reactive({
      pastes: [] as PasteDto[],
      newPaste: '',
      showPastes: true,
      socket: null as any,
    })

    const { store } = useContext()

    // Loads pastes from User Store
    state.pastes = store.getters['user/user'].pastes ?? []

    // Creates the WebSocket connection
    let socket: WebSocket | null = null
    try {
      if (!window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent))
        throw new Error('Websockets are fucked on iOS. Fuck you Apple.')
      else socket = new WebSocket(`${baseUrl(true)}/paste/websocket`)
    } catch (_) {
      alert(
        'Websocket connection failed. This website may not work as expected!'
      )
    }

    // Creates a paste
    const createPaste = async () => {
      try {
        if (socket)
          socketSend(socket, {
            action: 'create_paste',
            data: { content: state.newPaste },
          })
        else {
          const res = await newPaste({ content: state.newPaste })
          if (!res.data.success) throw new Error('Failed to paste.')
        }

        state.newPaste = ''
      } catch (_) {}
    }

    // Ctrl+V event
    window.addEventListener('paste', async () => {
      console.log('[client] paste event triggered')
      try {
        const paste = await navigator.clipboard.readText()
        if (!paste) return

        state.newPaste = paste
        createPaste()
      } catch (_) {}
    })

    // Add event listeners and create an emitter if
    // WebSocket connection is made
    if (socket) {
      socket.addEventListener('open', () => {
        socketSend(socket!, { action: 'fetch_pastes' })
      })
      const emitter = createEventEmitter(socket)
      emitter.on('fetch_pastes', (msg) => {
        state.pastes = msg.data.pastes
      })
      emitter.on('paste_create', (msg) => {
        state.pastes = [msg.data.paste, ...state.pastes]
      })
    }

    return {
      state,
      createPaste,
      removePaste,
      truncate: (str: string) => str.substring(0, 35),
    }
  },
})
</script>
