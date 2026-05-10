'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import { supabase } from '@/lib/supabase'
import type { BlogPostRow } from '@/lib/admin/types'
import { BlogPostLayout } from '@/components/blog/blog-post-layout'
import { blogMarkdownComponents } from '@/components/blog/blog-markdown'

const STATIC_BLOG_SLUGS = [
  'understanding-ospf',
  'acl-best-practices',
  'subnet-calculator-python',
  'network-automation-python',
] as const

const STATIC_TITLE_BY_SLUG: Record<string, string> = {
  'understanding-ospf':
    'Understanding OSPF: A Complete Guide for CCNA Students',
  'acl-best-practices': 'Securing Your Network: ACL Best Practices',
  'subnet-calculator-python': 'Building a Subnet Calculator CLI Tool in Python',
  'network-automation-python':
    'Network Automation with Python: Building a Cisco Device Scanner',
}

type NavEntry = { slug: string; title: string }

function buildNavChain(
  slug: string,
  posts: Pick<BlogPostRow, 'slug' | 'title' | 'sort_order'>[],
): NavEntry[] {
  if (posts.length > 0) {
    const sorted = [...posts].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    )
    if (sorted.some((p) => p.slug === slug)) {
      return sorted.map((p) => ({ slug: p.slug, title: p.title }))
    }
  }
  return STATIC_BLOG_SLUGS.map((s) => ({
    slug: s,
    title: STATIC_TITLE_BY_SLUG[s] ?? s,
  }))
}

function navNeighbors(
  slug: string,
  chain: NavEntry[],
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

export type BlogPostPageProps = {
  slug: string
  fallbackTitle: string
  fallbackCategory: string
  fallbackDate: string
  fallbackReadTime: string
  fallbackTags: string[]
  children: React.ReactNode
}

export function BlogPostPage({
  slug,
  fallbackTitle,
  fallbackCategory,
  fallbackDate,
  fallbackReadTime,
  fallbackTags,
  children,
}: BlogPostPageProps) {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<BlogPostRow | null>(null)
  const [allPosts, setAllPosts] = useState<
    Pick<BlogPostRow, 'slug' | 'title' | 'sort_order'>[]
  >([])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [single, list] = await Promise.all([
        supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle(),
        supabase
          .from('blog_posts')
          .select('slug,title,sort_order')
          .order('sort_order', { ascending: true }),
      ])
      if (!single.error && single.data) {
        setPost(single.data as BlogPostRow)
      } else {
        setPost(null)
      }
      if (!list.error && list.data) {
        setAllPosts(list.data as Pick<BlogPostRow, 'slug' | 'title' | 'sort_order'>[])
      } else {
        setAllPosts([])
      }
    } catch {
      setPost(null)
      setAllPosts([])
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const title = (post?.title?.trim() || fallbackTitle) as string
  const category = (post?.category?.trim() || fallbackCategory) as string
  const date = (post?.date_display?.trim() || fallbackDate) as string
  const readTime = (post?.read_time?.trim() || fallbackReadTime) as string
  const tags =
    post?.tags && post.tags.length > 0 ? post.tags : fallbackTags

  const chain = useMemo(
    () => buildNavChain(slug, allPosts),
    [slug, allPosts],
  )
  const { prev, next } = useMemo(
    () => navNeighbors(slug, chain),
    [slug, chain],
  )

  const md = post?.content?.trim()
  const body = md ? (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={blogMarkdownComponents}
    >
      {md}
    </ReactMarkdown>
  ) : (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:text-foreground prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-lg
        prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:marker:text-primary
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic"
    >
      {children}
    </div>
  )

  return (
    <BlogPostLayout
      title={title}
      category={category}
      date={date}
      readTime={readTime}
      tags={tags}
      prev={prev}
      next={next}
      loading={loading}
    >
      {body}
    </BlogPostLayout>
  )
}
