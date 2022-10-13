<template>
  <div>
    <div class="px-5 py-6">
      <h1 class="font-mono text-white text-2xl">Your Pastes</h1>

      <div
        class="mt-6 flex flex-col gap-y-4 pr-5 overflow-y-scroll"
        style="height: 74vh"
      >
        <router-link
          v-for="(paste, i) in pastes"
          :key="i"
          :to="`/${paste.id}`"
          class="
            rounded-2xl
            flex flex-col
            border
            px-4
            py-2
            border-gray-700
            text-white
            font-mono
          "
        >
          <span
            class="
              truncate
              break-all
              overflow-ellipsis overflow-hidden
              tracking-tighter
              max-w-4xl
            "
          >
            {{ paste.content }}
          </span>
          <span class="text-xs text-gray-400">
            ID: {{ paste.id }} &ndash;
            {{ new Date(paste.createdAt).toLocaleString() }} &ndash;
            <span
              class="text-gray-200 border-b border-gray-200 cursor-pointer"
              @click.prevent="() => removePaste({ id: paste.id })"
            >
              Delete
            </span>
            &ndash;
            <span
              class="text-gray-200 border-b border-gray-200 cursor-pointer"
              @click.prevent="() => copyPaste(paste.id)"
            >
              Copy URL
            </span>
          </span>
        </router-link>
        <div v-if="pastes.length < 1" class="text-white font-mono">
          You have no pastes yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { PasteDto } from '@snipcode/backend/src/dto/db/pasteDto'
import { Paste } from '@snipcode/backend/src/schemas'
import { user as sock, user } from '../store'
import { addTimedAlert, Alert } from '../store/Alert'
import { remove, getAll as getAllPastes } from '../api/paste'
import { me, refreshMe } from '../api/user'
import { notify } from '../notify'

export default defineComponent({
  middleware: 'requiredAuth',
  setup() {
    const pastes = computed(() => (user.value ? user.value.pastes ?? [] : []))

    if (!sock.value) {
      throw new Error('Websockets are not supported')
    }

    const removePaste = async (data: Paste.ById['Params']) => {
      try {
        await remove(data)
        await refreshMe()
        notify({
          message: 'Deleted',
          type: 'success',
        })
      } catch (_) {}
    }

    const copyPaste = async (id: string) => {
      await navigator.clipboard.writeText(`${window.location.origin}/${id}`)
      notify({
        message: 'Copied',
        type: 'success',
      })
    }

    return {
      pastes,
      removePaste,
      copyPaste,
    }
  },
})
</script>
