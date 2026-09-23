import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const locales = ['en', 'vi']
const docs = [
  'getting-started',
  'architecture',
  'workspace',
  'agents',
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
const fence = String.fromCharCode(96).repeat(3)

function text(value) {
  return String(value ?? '').replace(/\r/g, '').trim()
}

function renderDocument(data) {
  const title = text(data.title)
  const description = text(data.summary || '')
  const lines = [
    '---',
    'title: ' + JSON.stringify(title),
    'description: ' + JSON.stringify(description),
    '---',
    '',
    '# ' + title,
    '',
    description,
    ''
  ]

  for (const section of data.sections || []) {
    lines.push('## ' + text(section.heading), '')
    for (const paragraph of section.body || []) lines.push(text(paragraph), '')
    if (section.bullets?.length) {
      for (const bullet of section.bullets) lines.push('- ' + text(bullet))
      lines.push('')
    }
    for (const example of section.examples || []) {
      lines.push(fence + text(example.language || 'text').toLowerCase())
      lines.push(text(example.code || ''))
      lines.push(fence, '')
    }
  }

  if (data.relatedLinks?.length) {
    lines.push('## Related', '')
    for (const link of data.relatedLinks) {
      lines.push('- [' + text(link.label) + '](../' + link.id + ')')
    }
    lines.push('')
  }

  return lines.join('\n') + '\n'
}

for (const locale of locales) {
  const sourceDir = path.join(root, 'docs', locale)
  const outputDir = path.join(root, 'content', locale)
  fs.mkdirSync(outputDir, { recursive: true })

  for (const slug of docs) {
    const sourcePath = path.join(sourceDir, slug + '.json')
    if (!fs.existsSync(sourcePath)) throw new Error('Missing documentation source: ' + sourcePath)
    const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
    fs.writeFileSync(path.join(outputDir, slug + '.mdx'), renderDocument(data))
  }

  const start = JSON.parse(
    fs.readFileSync(path.join(sourceDir, 'getting-started.json'), 'utf8')
  )
  const indexBody = renderDocument(start).split('\n').slice(6).join('\n')
  fs.writeFileSync(
    path.join(outputDir, 'index.mdx'),
    [
      '---',
      'title: ' + JSON.stringify(start.title),
      'description: ' + JSON.stringify(start.summary || ''),
      'asIndexPage: true',
      '---',
      '',
      indexBody
    ].join('\n')
  )
}

console.log('Nextra content generated from docs/en and docs/vi')
