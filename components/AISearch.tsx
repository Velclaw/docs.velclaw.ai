'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type SearchResult = { id: number; content: string; path: string; similarity: number };
export function AISearch() {
  const [query, setQuery] = useState(''); const [results, setResults] = useState<SearchResult[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  useEffect(() => { const listener = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.getElementById('semantic-search')?.focus(); } }; addEventListener('keydown', listener); return () => removeEventListener('keydown', listener); }, []);
  async function search(event: FormEvent) { event.preventDefault(); if (!query.trim()) return; setLoading(true); setError(''); try { const response = await fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Không thể tìm kiếm.'); setResults(data.results ?? []); } catch (cause) { setResults([]); setError(cause instanceof Error ? cause.message : 'Không thể tìm kiếm.'); } finally { setLoading(false); } }
  return <div className="ai-search"><form onSubmit={search}><input id="semantic-search" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={500} placeholder="Tìm kiếm ngữ nghĩa… (Ctrl + K)" aria-label="Tìm kiếm tài liệu" /><button type="submit" disabled={loading}>{loading ? '…' : 'Tìm'}</button></form>{error && <p className="error" role="alert">{error}</p>}{results.length > 0 && <div className="search-results">{results.map((result) => <Link href={result.path} key={result.id}><b>{result.path}</b><br /><small>{result.content}</small></Link>)}</div>}</div>;
}
