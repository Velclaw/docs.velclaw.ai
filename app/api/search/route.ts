import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getServerEnv } from '@/lib/env';

const bodySchema = z.object({ query: z.string().trim().min(2).max(500) });
export async function POST(request: Request) {
  try { const { query } = bodySchema.parse(await request.json()); const env = getServerEnv(); const { embedding } = await embed({ model: google.embedding('text-embedding-004', { apiKey: env.GEMINI_API_KEY }), value: query }); const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } }); const { data, error } = await supabase.rpc('match_documents', { query_embedding: embedding, match_threshold: 0.3, match_count: 5 }); if (error) throw error; return Response.json({ results: data ?? [] }); } catch (error) { if (error instanceof z.ZodError) return Response.json({ error: 'A search query between 2 and 500 characters is required.' }, { status: 400 }); console.error('Semantic search failed.', error); return Response.json({ error: 'Semantic search is not available.' }, { status: 503 }); }
}
