import { z } from 'zod';

const serverSchema = z.object({ GEMINI_API_KEY: z.string().min(1), NEXT_PUBLIC_SUPABASE_URL: z.string().url(), SUPABASE_SERVICE_ROLE_KEY: z.string().min(1) });
export function getServerEnv() { return serverSchema.parse({ GEMINI_API_KEY: process.env.GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY }); }
