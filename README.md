# Velclaw TechDocs

An interactive Next.js App Router documentation application. MDX pages can mount React components, Sandpack runs editable React examples in the browser, the server exposes a Gemini-backed code assistant, and semantic search uses Gemini embeddings with Supabase pgvector.

## Prerequisites

- Node.js 20.9+
- A Google AI Studio API key with access to the configured Gemini text and embedding models
- A Supabase PostgreSQL project with the `vector` extension available

## Setup

```bash
cp .env.example .env.local
npm install
# Run supabase/schema.sql once in the Supabase SQL editor.
npm run dev
```

Use `npm run mdx:sync` to index MDX chunks. It is idempotent for unchanged chunks because it stores a SHA-256 content hash. `npm run build:with-index` indexes content before the production build. `npm run build` only compiles the application, so preview deployments do not need production AI or database credentials.

## Security

`GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-only. Never prefix either variable with `NEXT_PUBLIC_`, commit `.env.local`, or use the service-role key in a Client Component. The chat and search route handlers validate and bound request input before calling external services.

## Commands

```bash
npm run dev
npm run test:content
npm run type-check
npm run lint
npm run mdx:sync
npm run build
npm run build:with-index
npm run start
```

## Deploy

The committed `vercel.json` uses the credential-free `npm run build` command, so a Vercel preview can be created before AI and Supabase infrastructure is configured. Connect this repository to Vercel (or run `vercel` while authenticated), then add `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` to the Vercel environment before enabling chat, search, or `npm run build:with-index`. The service-role key must never be exposed to the client.
