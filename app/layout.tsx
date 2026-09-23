import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Velclaw TechDocs', template: '%s | Velclaw TechDocs' },
  description: 'Interactive MDX documentation with live code, AI assistance, and semantic search.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
