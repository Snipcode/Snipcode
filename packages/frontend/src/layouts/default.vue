<template>
  <div class="w-full h-full bg-black min-w-screen min-h-screen flex">
    <div
      class="flex p-2 bg-transparent border-2 shadow-xl w-full m-2 border-console"
    >
      <div>
        <div class="text-left">
          <h1 class="text-xs tracking-tightest text-console font-mono">
            Pastte.it v2.0
          </h1>
          <h2 class="text-xs tracking-tightest text-console font-mono">
            Paste-and-save quickly and easily!
          </h2>
          <footer class="text-xs tracking-tightest text-console font-mono">
            2021 &copy; Pastte.it &ndash; Made by
            <a
              href="https://github.com/VottusCode"
              target="_blank"
              rel="noreferrer noopener"
              class="font-medium border-b border-console"
              >VottusCode</a
            >
            &ndash;
            <a
              href="https://github.com/VottusCode/Pastte"
              target="_blank"
              rel="noreferrer noopener"
              class="font-medium border-b border-console"
              >Source</a
            >
          </footer>
        </div>

        <div class="my-6">
          <Nuxt />
        </div>
      </div>
    </div>
  </div>
</template>
