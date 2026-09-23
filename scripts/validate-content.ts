import { globby } from 'globby';
async function main() { const pages = await globby('app/docs/**/*.mdx'); if (!pages.length) throw new Error('No MDX documentation pages found.'); console.log(`Validated ${pages.length} MDX documentation page(s).`); }
main().catch((error) => { console.error(error); process.exitCode = 1; });
