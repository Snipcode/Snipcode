<template>
  <div>
    <form class="pt-4 pl-2 border-2 border-purple-400 rounded-2xl">
      <div class="pr-2">
        <textarea
          v-model="state.newPaste"
          type="text"
          class="w-full outline-none resize-none"
          placeholder="Enter your paste..."
        />
      </div>
      <div class="cursor-pointer flex justify-end">
        <div
          class="px-4 py-2 border-l-2 border-t-2 border-purple-400 rounded-tl-2xl rounded-br-2xl text-right hover:bg-gray-100"
          @click.prevent="createPaste"
        >
          Pastte
        </div>
      </div>
    </form>

    <div class="mt-6">
      <div v-for="(paste, i) in state.pastes" :key="i">
        <div
          v-if="paste"
          class="py-4 px-2 border-2 border-purple-400 rounded-2xl mb-2"
        >
          {{ paste.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { PasteDto } from '@pastte/backend/src/http/dto/db/pasteDto'
import socketSend from '@pastte/backend/src/ws/helpers/socketSend'
import { baseUrl } from '../api/axios'
import { createEventEmitter } from '../api/ws/createEventEmitter'

export default defineComponent({
  middleware: 'requiredAuth',
  setup() {
    const state = reactive({
      pastes: [] as PasteDto[],
      newPaste: '',
    })

    const socket = new WebSocket(`${baseUrl(true)}/paste/websocket`)

    const createPaste = () => {
      try {
        socketSend(socket, {
          action: 'create_paste',
          data: { content: state.newPaste },
        })
        state.newPaste = ''
      } catch (_) {}
    }

    window.addEventListener('paste', async () => {
      try {
        const paste = await navigator.clipboard.readText()
        if (!paste) return

        state.newPaste = paste
        createPaste()
      } catch (_) {}
    })

    socket.addEventListener('open', () => {
      socketSend(socket, { action: 'fetch_pastes' })
    })

    const emitter = createEventEmitter(socket)

    emitter.on('fetch_pastes', (msg) => {
      state.pastes = msg.data.pastes
    })

    emitter.on('paste_create', (msg) => {
      state.pastes.push(msg.data.paste)
    })

    return {
      state,
      createPaste,
      JSON,
    }
  },
})
</script>
