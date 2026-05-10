'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import type { BlogPostRow } from '@/lib/admin/types'
import { BlogPostLayout } from '@/components/blog/blog-post-layout'
import { blogMarkdownComponents } from '@/components/blog/blog-markdown'
import { navChainFromPosts, navNeighbors } from '@/components/blog/blog-nav'

export function BlogPostClient({
  post,
  navPosts,
}: {
  post: BlogPostRow
  navPosts: Pick<BlogPostRow, 'slug' | 'title' | 'sort_order'>[]
}) {
  const chain = useMemo(() => navChainFromPosts(navPosts), [navPosts])
  const { prev, next } = useMemo(
    () => navNeighbors(post.slug, chain),
    [post.slug, chain],
  )

  const tags = Array.isArray(post.tags) ? post.tags : []
  const md = post.content?.trim()

  const body = md ? (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={blogMarkdownComponents}
    >
      {md}
    </ReactMarkdown>
  ) : (
    <p className="text-muted-foreground">
      No article body yet. Add content in the admin panel.
    </p>
  )

  return (
    <BlogPostLayout
      title={post.title}
      category={post.category ?? ''}
      date={post.date_display ?? ''}
      readTime={post.read_time ?? ''}
      tags={tags}
      prev={prev}
      next={next}
    >
      {body}
    </BlogPostLayout>
  )
}
