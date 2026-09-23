import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

function loadConfig(relativePath, factoryName, env = {}) {
  const configPath = fileURLToPath(new URL(relativePath, import.meta.url))
  const source = fs
    .readFileSync(configPath, 'utf8')
    .replace(`export default ${factoryName}(`, `globalThis.__config = ${factoryName}(`)
  const context = {
    [factoryName]: (config) => config,
    process: { env: { ...env } }
  }

  vm.runInNewContext(source, context, { filename: configPath })
  return JSON.parse(JSON.stringify(context.__config))
}

test('configures Docus with prefixed English and Vietnamese routes', () => {
  const config = loadConfig('../nuxt.config.ts', 'defineNuxtConfig')

  assert.deepEqual(config.extends, ['docus'])
  assert.deepEqual(config.modules, ['@nuxtjs/i18n'])
  assert.deepEqual(config.i18n, {
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix'
  })
  assert.equal(config.app.baseURL, '/docs.velclaw.ai/')
  assert.equal(config.runtimeConfig.public.siteUrl, 'https://velclaw.github.io/docs.velclaw.ai/')
  assert.equal(config.llms.domain, 'https://velclaw.github.io/docs.velclaw.ai/')
  assert.equal(config.nitro.prerender.crawlLinks, true)
  assert.deepEqual(config.nitro.prerender.routes, [
    '/en/',
    '/vi/',
    '/llms.txt',
    '/llms-full.txt'
  ])
})

test('honors deployment URL overrides consistently', () => {
  const config = loadConfig('../nuxt.config.ts', 'defineNuxtConfig', {
    NUXT_APP_BASE_URL: '/preview/',
    NUXT_SITE_URL: 'https://docs.example.test/preview/'
  })

  assert.equal(config.app.baseURL, '/preview/')
  assert.equal(config.runtimeConfig.public.siteUrl, 'https://docs.example.test/preview/')
  assert.equal(config.llms.domain, 'https://docs.example.test/preview/')
})

test('exposes the Velclaw Docus theme and repository links', () => {
  const config = loadConfig('../app.config.ts', 'defineAppConfig')

  assert.equal(config.docus.title, 'Velclaw')
  assert.equal(config.docus.socials.github, 'Velclaw/velclaw')
  assert.equal(config.docus.header.logo, true)
  assert.equal(config.docus.header.showLinkIcon, true)
  assert.equal(config.docus.footer.credits.href, 'https://github.com/Velclaw/velclaw')
  assert.deepEqual(config.ui.colors, { primary: 'violet', neutral: 'zinc' })
})
