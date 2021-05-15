<template>
  <div
    class="w-screen h-screen bg-no-repeat bg-cover flex items-center"
    style="background-image: url(/src/assets/bg.svg)"
  >
    <div class="m-2 rounded-xl px-8 py-6 max-w-3xl bg-purple-800 mx-auto">
      <!-- <alert-renderer class="w-full mb-4" /> -->
      <router-view />

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
        <a
          href="#"
          target="_blank"
          class="
            mx-1
            underline
            hover:text-purple-300
            transition
            ease-in-out
            duration-300
            font-medium
          "
          ref="norefererr noopener"
          >Snipcode</a
        >
        &ndash; All rights reserved.
      </div>
    </div>
  </div>
</template>
