import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const generatorPath = fileURLToPath(
  new URL('../scripts/generate-docus-content.mjs', import.meta.url)
)
const locales = ['en', 'vi']
const slugs = [
  'getting-started',
  'architecture',
  'workspace',
  'agents',
  'mcp-apps',
  'typedoc',
  'agents-md',
  'openwiki',
  'build-runtime',
  'github-delivery',
  'velclawhost',
  'velclawdeploy',
  'domains',
  'automation',
  'ci-cd',
  'security',
  'troubleshooting'
]

function documentFor(locale, slug) {
  if (slug === 'getting-started') {
    return {
      title: `  ${locale} "Getting started"\r  `,
      summary: '  First line\r\nsecond line  ',
      sections: [
        {
          heading: '  Install  ',
          body: ['  Run the setup.\r  '],
          bullets: ['  Repeatable  ', '  Localized  '],
          examples: [
            { language: '  BaSh  ', code: '  npm install\r\nnpm run build  ' }
          ]
        }
      ],
      relatedLinks: [{ label: '  Next page  ', id: '  workspace  ' }]
    }
  }

  if (slug === 'architecture') {
    return {
      title: null,
      summary: null,
      sections: [{ heading: null, examples: [{}] }]
    }
  }

  return {
    title: `${locale}:${slug}`,
    summary: `${slug} summary`,
    sections: []
  }
}

function createFixture(t, { malformed, missing } = {}) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'docus-content-test-'))
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }))

  for (const locale of locales) {
    const docsDir = path.join(fixture, 'docs', locale)
    fs.mkdirSync(docsDir, { recursive: true })

    for (const slug of slugs) {
      const key = `${locale}/${slug}`
      if (key === missing) continue

      const sourcePath = path.join(docsDir, `${slug}.json`)
      fs.writeFileSync(
        sourcePath,
        key === malformed ? '{not valid json' : JSON.stringify(documentFor(locale, slug))
      )
    }
  }

  return fixture
}

function runGenerator(fixture) {
  return spawnSync(process.execPath, [generatorPath], {
    cwd: fixture,
    encoding: 'utf8',
    timeout: 10_000
  })
}

test('generates localized Docus Markdown with normalized content', (t) => {
  const fixture = createFixture(t)
  const staleOutput = path.join(fixture, 'content', 'en', 'openwiki.md')
  fs.mkdirSync(path.dirname(staleOutput), { recursive: true })
  fs.writeFileSync(staleOutput, 'stale content')

  const result = runGenerator(fixture)

  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stderr, '')
  assert.match(result.stdout, /Docus content generated from docs\/en and docs\/vi/)

  for (const locale of locales) {
    const outputDir = path.join(fixture, 'content', locale)
    const outputNames = fs.readdirSync(outputDir).sort()
    assert.deepEqual(
      outputNames,
      [...slugs.map((slug) => `${slug}.md`), 'index.md'].sort()
    )

    const page = fs.readFileSync(path.join(outputDir, 'getting-started.md'), 'utf8')
    assert.ok(page.includes(`title: ${JSON.stringify(`${locale} "Getting started"`)}`))
    assert.match(page, /description: "First line\\nsecond line"/)
    assert.ok(page.includes(`# ${locale} "Getting started"`))
    assert.match(page, /## Install\n\nRun the setup\./)
    assert.match(page, /- Repeatable\n- Localized/)
    assert.match(page, /~~~bash\nnpm install\nnpm run build\n~~~/)
    assert.match(page, new RegExp(`- \\[Next page\\]\\(\\/${locale}\\/workspace\\)`))
    assert.doesNotMatch(page, /```|\r/)

    const index = fs.readFileSync(path.join(outputDir, 'index.md'), 'utf8')
    assert.match(index, /^---\ntitle:/)
    assert.doesNotMatch(index, /asIndexPage|# .*Getting started/)
    assert.match(index, /## Install/)

    const defaults = fs.readFileSync(path.join(outputDir, 'architecture.md'), 'utf8')
    assert.match(defaults, /title: ""/)
    assert.match(defaults, /description: ""/)
    assert.match(defaults, /~~~text\n\n~~~/)

    for (const newSlug of ['typedoc', 'agents-md', 'openwiki']) {
      assert.match(
        fs.readFileSync(path.join(outputDir, `${newSlug}.md`), 'utf8'),
        new RegExp(`# ${locale}:${newSlug}`)
      )
    }
  }

  assert.doesNotMatch(fs.readFileSync(staleOutput, 'utf8'), /stale content/)
})

test('reports every missing documentation source added by the Docus migration', async (t) => {
  for (const locale of locales) {
    for (const slug of ['typedoc', 'agents-md', 'openwiki']) {
      await t.test(`${locale}/${slug}`, (t) => {
        const fixture = createFixture(t, { missing: `${locale}/${slug}` })
        const result = runGenerator(fixture)

        assert.notEqual(result.status, 0)
        assert.match(result.stderr, /Missing documentation source:/)
        assert.match(result.stderr, new RegExp(`docs[\\\\/]${locale}[\\\\/]${slug}\\.json`))
      })
    }
  }
})

test('fails without writing the malformed document when JSON input is invalid', (t) => {
  const fixture = createFixture(t, { malformed: 'en/openwiki' })
  const result = runGenerator(fixture)

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /SyntaxError/)
  assert.equal(fs.existsSync(path.join(fixture, 'content', 'en', 'openwiki.md')), false)
})
