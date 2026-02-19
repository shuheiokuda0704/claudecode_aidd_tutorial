export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxt/eslint'],
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:3001',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Nuxt 4 + PostgreSQL バックエンド付きTODOアプリ' },
      ],
    },
  },
})
