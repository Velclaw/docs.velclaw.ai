import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const generatorPath = fileURLToPath(
  new URL('./generate-docus-content.mjs', import.meta.url)
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

function createWorkspace(t, overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'docus-content-test-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))

  for (const locale of locales) {
    const sourceDir = path.join(root, 'docs', locale)
    fs.mkdirSync(sourceDir, { recursive: true })

    for (const slug of slugs) {
      const fallback = {
        title: `${locale.toUpperCase()} ${slug}`,
        summary: `${locale} summary for ${slug}`,
        sections: []
      }
      const data = overrides[`${locale}/${slug}`] ?? fallback
      fs.writeFileSync(
        path.join(sourceDir, `${slug}.json`),
        JSON.stringify(data)
      )
    }
  }

  return root
}

function runGenerator(root) {
  return spawnSync(process.execPath, [generatorPath], {
    cwd: root,
    encoding: 'utf8'
  })
}

test('generates complete localized Docus content and renders every supported field', (t) => {
  const richDocument = {
    title: '  Getting "Started"  ',
    summary: '  First line\r\nsecond line  ',
    sections: [
      {
        heading: '  Overview\r  ',
        body: ['  A paragraph with surrounding space.  ', 42],
        bullets: ['  First bullet  ', 'Second bullet'],
        examples: [
          { language: 'TypeScript', code: '  const answer = 42\r\n  ' },
          { code: null }
        ]
      }
    ],
    relatedLinks: [
      { id: '  architecture  ', label: '  Architecture  ' }
    ]
  }
  const root = createWorkspace(t, {
    'en/getting-started': richDocument,
    'vi/getting-started': {
      ...richDocument,
      title: 'Bắt đầu',
      relatedLinks: [{ id: 'security', label: 'Bảo mật' }]
    }
  })

  const stalePath = path.join(root, 'content', 'en', 'getting-started.md')
  fs.mkdirSync(path.dirname(stalePath), { recursive: true })
  fs.writeFileSync(stalePath, 'stale output')

  const result = runGenerator(root)

  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stderr, '')
  assert.match(result.stdout, /Docus content generated from docs\/en and docs\/vi/)

  for (const locale of locales) {
    const outputDir = path.join(root, 'content', locale)
    const generatedFiles = fs
      .readdirSync(outputDir)
      .filter((name) => name.endsWith('.md'))
      .sort()
    assert.deepEqual(
      generatedFiles,
      [...slugs.map((slug) => `${slug}.md`), 'index.md'].sort(),
      `${locale} should contain one page per configured document plus its index`
    )
  }

  const english = fs.readFileSync(stalePath, 'utf8')
  assert.ok(!english.includes('stale output'), 'existing output should be replaced')
  assert.ok(!english.includes('\r'), 'carriage returns should be normalized')
  assert.ok(english.startsWith([
    '---',
    'title: "Getting \\"Started\\""',
    'description: "First line\\nsecond line"',
    '---',
    '',
    '# Getting "Started"'
  ].join('\n')))
  assert.ok(english.includes('\n## Overview\n\n'))
  assert.ok(english.includes('\nA paragraph with surrounding space.\n\n42\n'))
  assert.ok(english.includes('\n- First bullet\n- Second bullet\n'))
  assert.ok(english.includes('\n~~~typescript\nconst answer = 42\n~~~\n'))
  assert.ok(english.includes('\n~~~text\n\n~~~\n'))
  assert.ok(english.includes('\n- [Architecture](/en/architecture)\n'))

  const vietnamese = fs.readFileSync(
    path.join(root, 'content', 'vi', 'getting-started.md'),
    'utf8'
  )
  assert.ok(vietnamese.includes('- [Bảo mật](/vi/security)'))

  const index = fs.readFileSync(path.join(root, 'content', 'en', 'index.md'), 'utf8')
  assert.equal(index.match(/^---$/gm)?.length, 2, 'index should have one frontmatter block')
  assert.ok(!index.includes('# Getting "Started"'), 'index should not repeat the document title')
  assert.ok(index.includes('First line\nsecond line'))
  assert.ok(index.includes('## Overview'))
  assert.ok(index.includes('- [Architecture](/en/architecture)'))
})

test('fails with an actionable error when a required localized source is missing', (t) => {
  const root = createWorkspace(t)
  const missingPath = path.join(root, 'docs', 'vi', 'openwiki.json')
  fs.unlinkSync(missingPath)

  const result = runGenerator(root)

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Missing documentation source:/)
  assert.ok(result.stderr.includes(missingPath))
})

test('fails instead of emitting content from malformed JSON', (t) => {
  const root = createWorkspace(t)
  const malformedPath = path.join(root, 'docs', 'en', 'getting-started.json')
  fs.writeFileSync(malformedPath, '{"title": "unterminated"')

  const result = runGenerator(root)

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /SyntaxError/)
  assert.equal(
    fs.existsSync(path.join(root, 'content', 'en', 'getting-started.md')),
    false
  )
})

test('the repository sources generate successfully without modifying the checkout', () => {
  const repositoryRoot = path.dirname(path.dirname(generatorPath))
  const before = execFileSync('git', ['status', '--porcelain=v1'], {
    cwd: repositoryRoot,
    encoding: 'utf8'
  })

  // Generate in a disposable copy so this integration check cannot leave build output behind.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'docus-repository-test-'))
  try {
    fs.cpSync(path.join(repositoryRoot, 'docs'), path.join(root, 'docs'), {
      recursive: true
    })
    const result = runGenerator(root)
    assert.equal(result.status, 0, result.stderr)

    for (const locale of locales) {
      for (const slug of ['typedoc', 'agents-md', 'openwiki']) {
        const output = fs.readFileSync(
          path.join(root, 'content', locale, `${slug}.md`),
          'utf8'
        )
        assert.match(output, /^---\ntitle: ".+"\ndescription: ".*"\n---/)
        assert.ok(output.includes(`(/${locale}/`), `${locale}/${slug} should have localized links`)
      }
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }

  const after = execFileSync('git', ['status', '--porcelain=v1'], {
    cwd: repositoryRoot,
    encoding: 'utf8'
  })
  assert.equal(after, before)
})
