<template>
  <div class="w-screen h-screen">
    <div
      class="
        w-full
        h-full
        flex flex-col
        md:flex-row
        justify-center
        items-center
        bg-gray-900
      "
    >
      <div class="w-full h-full p-8 md:p-32 flex justify-start items-center text-whiter">
        <router-view/>
      </div>
      <div
        class="
          w-full
          md:h-full
          bg-gray-800 md:bg-transparent
          p-8 md:p-32
          flex md:justify-end items-center
        "
      >
        <div class="">
          <h1 class="text-white text-4xl italic">{{ global.name }}</h1>
          <h2 class="text-gray-200 text-xl">{{ global.description }}</h2>
        </div>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="935"
            height="1080"
            fill="none"
            viewBox="0 0 935 1080"
            class="absolute right-0 bottom-0"
          >
            <path
            class="fill-purple-500 opacity-10"
              d="M0.750412 348.532C13.9894 237.64 139.659 69.9723 200.839 0H935V1080H0.750412C74.8017 1031.63 225.311 894.814 234.94 734.46C246.975 534.017 -15.7983 487.147 0.750412 348.532Z"
            />
          </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { global } from '../constants'

export default defineComponent({
  setup() {
    return {
      global,
    }
  },
})
</script>

