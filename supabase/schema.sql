create extension if not exists vector;

create table if not exists mdx_documents (
  id bigserial primary key,
  content text not null,
  path text not null,
  content_hash text not null unique,
  embedding vector(768) not null,
  created_at timestamptz not null default now()
);

create index if not exists mdx_documents_embedding_hnsw
  on mdx_documents using hnsw (embedding vector_cosine_ops);

create or replace function match_documents(
  query_embedding vector(768),
  match_threshold float,
  match_count int
) returns table (id bigint, content text, path text, similarity float)
language sql stable as $$
  select id, content, path, 1 - (embedding <=> query_embedding) as similarity
  from mdx_documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
