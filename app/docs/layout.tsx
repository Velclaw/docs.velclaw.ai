import Link from 'next/link';
import { AISearch } from '@/components/AISearch';

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="docs-shell"><header className="docs-header"><Link href="/" className="brand">TechDocs 2027_</Link><AISearch /></header><div className="docs-layout"><aside className="docs-sidebar" aria-label="Điều hướng tài liệu"><p>HƯỚNG DẪN</p><Link href="/docs/intro">React tương tác</Link></aside><main className="docs-content">{children}</main></div></div>;
}
