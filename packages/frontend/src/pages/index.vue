<template>
  <div>
    <form class="pt-4 pl-2 border-2 border-purple-400 rounded-2xl">
      <div class="pr-2">
        <textarea
          type="text"
          v-model="state.newPaste"
          class="w-full outline-none resize-none"
          placeholder="Enter your paste..."
        />
      </div>
      <div class="cursor-pointer flex justify-end" @click.prevent="createPaste">
        <div
          class="px-4 py-2 border-l-2 border-t-2 border-purple-400 rounded-tl-2xl rounded-br-2xl text-right hover:bg-gray-100"
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
import { defineComponent, reactive, ref } from '@nuxtjs/composition-api'
import { PasteDto } from '@pastte/backend/src/http/dto/db/pasteDto'
import { baseUrl } from '../api/axios'

export default defineComponent({
  middleware: 'requiredAuth',
  setup() {
    const state = reactive({
      pastes: [] as PasteDto[],
      newPaste: '',
    })

    // const ws = new WebSocket(`wss://${baseUrl(true)}/paste/websocket`)

    const socket = new WebSocket(`ws://${baseUrl(true)}/paste/websocket`)

    const createPaste = () => {
      console.log({ state })
      socket.send(
        JSON.stringify({
          action: 'create_paste',
          data: { content: state.newPaste },
        })
      )
    }

    // Connection opened
    socket.addEventListener('open', function (event) {
      socket.send(JSON.stringify({ action: 'fetch_pastes' }))
    })

    // Listen for messages
    socket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data)
      console.log('[server] ', data)

      switch (data.evt) {
        case 'fetch_pastes': {
          state.pastes = data.data.pastes
          console.log(state.pastes)
        }
        case 'paste_create': {
          state.pastes.push(data.data.paste)
        }
        default:
          break
      }

      // console.log('Message from server ', event.data)
    })

    return {
      state,
      createPaste,
      JSON,
    }
  },
})
</script>
