<template>
  <div
    class="w-full h-full bg-gray-900 min-w-screen min-h-screen flex items-center justify-center"
  >
    <div
      class="flex justify-center p-7 bg-white shadow-xl rounded-3xl md:min-w-96 m-2"
    >
      <div>
        <div class="text-center">
          <h1 class="text-3xl font-bold text-black">Pastte.it</h1>
          <h2 class="text-xl font-sm text-gray-900">
            Paste-and-save quickly and easily!
          </h2>
        </div>

        <div class="my-6">
          <Nuxt />
        </div>

        <footer class="text-gray-500">
          2021 &copy; Pastte.it &ndash; Made by
          <a
            href="https://github.com/VottusCode"
            target="_blank"
            rel="noreferrer noopener"
            class="font-medium border-b border-gray-500 text-gray-600"
            >VottusCode</a
          >
          &ndash;
          <a
            href="https://github.com/VottusCode/Pastte"
            target="_blank"
            rel="noreferrer noopener"
            class="font-medium border-b border-gray-500 text-gray-600"
            >Source</a
          >
        </footer>
      </div>
    </div>
  </div>
</template>
