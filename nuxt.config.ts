export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix'
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/docs.velclaw.ai/'
  },
  runtimeConfig: {
    public: {
      siteUrl:
        process.env.NUXT_SITE_URL ||
        'https://velclaw.github.io/docs.velclaw.ai/'
    }
  },
  llms: {
    domain:
      process.env.NUXT_SITE_URL ||
      'https://velclaw.github.io/docs.velclaw.ai/',
    title: 'Velclaw Docs',
    description:
      'Official Velclaw documentation for developer tooling, infrastructure, deployment, hosting, domains, automation, MCP and AI agents.',
    full: {
      title: 'Velclaw Docs',
      description:
        'Complete source-traceable documentation for the Velclaw ecosystem.'
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/en/', '/vi/', '/llms.txt', '/llms-full.txt']
    }
  }
})
