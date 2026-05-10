import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostClient } from '@/components/blog/blog-post-client'
import type { BlogPostRow } from '@/lib/admin/types'
import { supabase } from '@/lib/supabase'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .maybeSingle()

  if (!data) {
    return { title: 'Post not found' }
  }

  const row = data as Pick<BlogPostRow, 'title' | 'excerpt'>
  return {
    title: `${row.title} | Mahmoud Taha`,
    description: row.excerpt?.trim() || undefined,
  }
}

export default async function BlogBySlugPage({ params }: PageProps) {
  const { slug } = await params

  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (postError || !post) {
    notFound()
  }

  const { data: navRows } = await supabase
    .from('blog_posts')
    .select('slug, title, sort_order')
    .order('sort_order', { ascending: true })

  return (
    <BlogPostClient
      post={post as BlogPostRow}
      navPosts={
        (navRows ?? []) as Pick<BlogPostRow, 'slug' | 'title' | 'sort_order'>[]
      }
    />
  )
}
