<template>
  <div
    class="w-screen h-screen bg-no-repeat bg-cover flex items-center"
    style="background-image: url(/src/assets/bg.svg)"
  >
    <transition
      enter-active-class="transition ease-out duration-300 delay-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="m-2 rounded-xl px-8 py-6 max-w-3xl bg-purple-800 mx-auto"
        v-show="showForm"
      >
        <alert-renderer class="w-full mb-4" />
        <div class="flex flex-col md:flex-row justify-between">
          <div>
            <div class="mb-8">
              <div class="text-purple-400">{{ store.options.name }}</div>
              <h1 class="text-white font-medium text-5xl">{{ store.title }}</h1>
            </div>

            <router-view />
          </div>
        </div>

        <div
          class="
            border-t
            pt-8
            mt-8
            inline-flex
            pr-8
            border-purple-700
            text-purple-400
          "
        >
          2021 &copy;
          <inline-link
            is="a"
            href="#"
            target="_blank"
            ref="norefererr noopener"
          >
            Snipcode
          </inline-link>
          &ndash; All rights reserved.
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import AlertRenderer from '../components/elements/alert/AlertRenderer.vue'
import InlineLink from '../components/elements/InlineLink.vue'
import store from '../store'

export default defineComponent({
  components: { InlineLink, AlertRenderer },
  setup() {
    const showForm = ref(false)

    onMounted(() => (showForm.value = true))

    return {
      store,
      showForm,
    }
  },
})
</script>
