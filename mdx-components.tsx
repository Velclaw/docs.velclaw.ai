import type { MDXComponents } from 'mdx/types';
import { LiveEditor } from '@/components/LiveEditor';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { LiveEditor, ...components };
}
