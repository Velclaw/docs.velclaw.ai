import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { globby } from 'globby';
import matter from 'gray-matter';
import { z } from 'zod';

const env = z.object({ GEMINI_API_KEY: z.string().min(1), NEXT_PUBLIC_SUPABASE_URL: z.string().url(), SUPABASE_SERVICE_ROLE_KEY: z.string().min(1) }).parse(process.env);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
function pathFor(file: string) { return `/${file.replace(/^app/, '').replace(/\/page\.mdx$/, '').replace(/\.mdx$/, '')}`.replace(/\/+/g, '/') || '/docs'; }
function chunks(content: string) { return content.split(/\n\s*\n/).map((part) => part.trim()).filter((part) => part.length >= 40 && !part.startsWith('import ') && !part.startsWith('<')); }
async function main() { const files = await globby('app/docs/**/*.mdx'); for (const file of files) { const { content } = matter(await readFile(file, 'utf8')); for (const contentChunk of chunks(content)) { const content_hash = createHash('sha256').update(contentChunk).digest('hex'); const { data: existing, error: lookupError } = await supabase.from('mdx_documents').select('id').eq('content_hash', content_hash).maybeSingle(); if (lookupError) throw lookupError; if (existing) continue; const { embedding } = await embed({ model: google.embedding('text-embedding-004', { apiKey: env.GEMINI_API_KEY }), value: contentChunk }); const { error } = await supabase.from('mdx_documents').upsert({ content: contentChunk, path: pathFor(file), content_hash, embedding }, { onConflict: 'content_hash' }); if (error) throw error; } } }
main().catch((error) => { console.error(error); process.exitCode = 1; });
