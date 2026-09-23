import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const locales = ['en', 'vi']
const docs = [
  'getting-started',
  'architecture',
  'workspace',
  'agents',
  'mcp-apps',
  'typedoc',
  'agents-md',
  'openwiki',
  'contributing',
  'ecosystem',
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

function text(value) {
  return String(value ?? '').replace(/\r/g, '').trim()
}

/**
 * Renders a parsed documentation source as a Docus Markdown page.
 *
 * The locale becomes the leading URL segment for related-document links. The returned
 * page includes YAML frontmatter and ends with a newline.
 *
 * @param {object} data Parsed JSON documentation source.
 * @param {string} locale Locale used to qualify related-document links.
 * @returns {string} Rendered Markdown page.
 */
function renderDocument(data, locale) {
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
      lines.push('~~~' + text(example.language || 'text').toLowerCase())
      lines.push(text(example.code || ''))
      lines.push('~~~', '')
    }
  }

  if (data.relatedLinks?.length) {
    lines.push('## Related', '')
    for (const link of data.relatedLinks) {
      lines.push('- [' + text(link.label) + '](/' + locale + '/' + text(link.id) + ')')
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
    fs.writeFileSync(path.join(outputDir, slug + '.md'), renderDocument(data, locale))
  }

  const start = JSON.parse(fs.readFileSync(path.join(sourceDir, 'getting-started.json'), 'utf8'))
  fs.writeFileSync(
    path.join(outputDir, 'index.md'),
    [
      '---',
      'title: ' + JSON.stringify(start.title),
      'description: ' + JSON.stringify(start.summary || ''),
      '---',
      '',
      renderDocument(start, locale).split('\n').slice(6).join('\n')
    ].join('\n')
  )
}

console.log('Docus content generated from docs/en and docs/vi')

const homeIndexPath = path.join(root, 'content', locale, 'index.md')
const homeIndex = fs.readFileSync(homeIndexPath, 'utf8')
fs.writeFileSync(homeIndexPath, '<VelclawMotion />\\n\\n' + homeIndex)
