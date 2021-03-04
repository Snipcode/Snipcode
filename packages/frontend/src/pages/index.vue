<template>
  <div>
    <Header :showHome="false">
      <Button
        :disabled="state.newPaste.replaceAll(' ', '').length < 1"
        @click.prevent="createPaste"
      >
        Save
      </Button>
    </Header>
    <with-arrow class="px-5 py-6">
      <textarea
        type="text"
        v-model="state.newPaste"
        class="w-full min-h-full min-w-full text-gray-200 bg-transparent outline-none font-mono resize-none pr-4"
        autofocus
        style="height: 74vh"
      />
    </with-arrow>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import { PasteDto } from '@pastte/backend/src/http/dto/db/pasteDto'
import socketSend from '@pastte/backend/src/ws/helpers/socketSend'
import { create as newPaste, remove as deletePaste } from '../api/paste'
import { baseUrl } from '../api/axios'
import { createEventEmitter } from '../api/ws/createEventEmitter'
import { Paste } from '@pastte/backend/src/http/schemas'
import Header from '../components/layout/Header.vue'
import Button from '../components/elements/Button.vue'
import WithArrow from '../components/elements/WithArrow.vue'

export default defineComponent({
  middleware: 'requiredAuth',
  components: { Header, Button, WithArrow },
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

    const removePaste = async (data: Paste.ById['Params']) => {
      try {
        if (socket) {
          socketSend(socket, {
            action: 'delete_paste',
            data,
          })
        } else {
          const res = await deletePaste({ id: data.id })
          if (!res.data.success) throw new Error('Failed to delete paste.')
        }
      } catch (_) {}
    }

    const logout = () => {}

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
      emitter.on('paste_delete', (msg) => {
        state.pastes = state.pastes.filter((el) => el.id !== msg.data.paste.id)
      })
    }

    return {
      state,
      createPaste,
      removePaste,
      logout,
      truncate: (str: string) => str.substring(0, 35),
    }
  },
})
</script>
