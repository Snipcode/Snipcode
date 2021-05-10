const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Snipcode',
    htmlAttrs: {
      lang: 'en',
    },
    bodyAttrs: {
      class: 'overflow-hidden',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  srcDir: 'src',

  router: {
    middleware: 'me',
  },

  server: {
    host: '0.0.0.0',
  },

  ssr: false,

  target: 'static',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/tailwind.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/highlight'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://composition-api.nuxtjs.org
    '@nuxtjs/composition-api',
    // https://typed-vuex.roe.dev/
    'nuxt-typed-vuex',
    // https://github.com/nuxt/nuxt.js/issues/8087
    // '@nuxt/postcss8',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
        'postcss-preset-env': {
          stage: 1,
          features: {
            'focus-within-pseudo-class': false,
          },
        },
      },
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['typescript', 'javascript', 'css', 'json', 'php'],
      }),
    ],
  },
}
