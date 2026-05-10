'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type BlogPostLayoutProps = {
  title: string
  category: string
  date: string
  readTime: string
  tags: string[]
  prev: { title: string; href: string } | null
  next: { title: string; href: string } | null
  loading?: boolean
  children: React.ReactNode
}

export function BlogPostLayout({
  title,
  category,
  date,
  readTime,
  tags,
  prev,
  next,
  children,
}: BlogPostLayoutProps) {
  const [copied, setCopied] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      const p = total > 0 ? Math.min(100, Math.max(0, (el.scrollTop / total) * 100)) : 0
      setProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-border/40">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="fixed top-1 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[800px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8 space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <span className="inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                {category}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-11 min-h-11 shrink-0 gap-2 border-border px-4 sm:h-10 sm:min-h-0"
                onClick={() => void handleCopyLink()}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                {copied ? 'Copied' : 'Share link'}
              </Button>
            </div>

            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" />
                {readTime}
              </span>
            </div>

            {tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          <div className="mb-12 border-b border-border" />

          <div className="max-w-none">{children}</div>

          <nav className="mt-16 grid gap-6 border-t border-border pt-12 sm:grid-cols-2">
            <div>
              {prev ? (
                <Link
                  href={prev.href}
                  className="group flex flex-col gap-1 rounded-lg border border-border bg-card/50 p-4 transition-colors hover:border-primary/40 hover:bg-card"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Previous
                  </span>
                  <span className="flex items-center gap-2 font-medium text-foreground group-hover:text-primary">
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-2 break-words">{prev.title}</span>
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
            <div className="sm:text-right">
              {next ? (
                <Link
                  href={next.href}
                  className="group flex flex-col gap-1 rounded-lg border border-border bg-card/50 p-4 transition-colors hover:border-primary/40 hover:bg-card sm:ml-auto sm:max-w-full"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Next
                  </span>
                  <span className="flex items-center justify-end gap-2 font-medium text-foreground group-hover:text-primary sm:flex-row-reverse">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-2 break-words text-left sm:text-right">
                      {next.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        </article>
      </main>
    </div>
  )
}
