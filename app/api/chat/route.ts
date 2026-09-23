import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';
import { getServerEnv } from '@/lib/env';

const bodySchema = z.object({ messages: z.array(z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string().min(1).max(4000) })).min(1).max(20) });
export async function POST(request: Request) {
  try { const { messages } = bodySchema.parse(await request.json()); const env = getServerEnv(); const result = streamText({ model: google('gemini-1.5-flash', { apiKey: env.GEMINI_API_KEY }), system: 'You are a concise programming assistant. Explain code and safe fixes in Markdown. Never reveal secrets or claim to execute code.', messages }); return result.toDataStreamResponse(); } catch (error) { if (error instanceof z.ZodError) return Response.json({ error: 'Invalid chat request.' }, { status: 400 }); console.error('Chat request failed.', error); return Response.json({ error: 'The AI assistant is not available.' }, { status: 503 }); }
}
