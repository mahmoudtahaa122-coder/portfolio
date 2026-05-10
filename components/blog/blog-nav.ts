import type { BlogPostRow } from '@/lib/admin/types'

export type BlogNavEntry = { slug: string; title: string }

export function navNeighbors(
  slug: string,
  chain: BlogNavEntry[],
): {
  prev: { title: string; href: string } | null
  next: { title: string; href: string } | null
} {
  const i = chain.findIndex((p) => p.slug === slug)
  if (i < 0) return { prev: null, next: null }
  const prev = i > 0 ? chain[i - 1] : null
  const next = i < chain.length - 1 ? chain[i + 1] : null
  return {
    prev: prev ? { title: prev.title, href: `/blog/${prev.slug}` } : null,
    next: next ? { title: next.title, href: `/blog/${next.slug}` } : null,
  }
}

export function navChainFromPosts(
  posts: Pick<BlogPostRow, 'slug' | 'title' | 'sort_order'>[],
): BlogNavEntry[] {
  const sorted = [...posts].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )
  return sorted.map((p) => ({ slug: p.slug, title: p.title }))
}
