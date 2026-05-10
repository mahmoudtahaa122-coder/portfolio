"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Network,
  Code2,
  Shield,
  Terminal,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { BlogPostRow } from "@/lib/admin/types"
import { portfolioLucideIcon } from "@/lib/portfolio-lucide"

type PostView = {
  key: string
  slug: string
  title: string
  excerpt: string
  Icon: LucideIcon
  category: string
  readTime: string
  date: string
  tags: string[]
}

const FALLBACK_POSTS: PostView[] = [
  {
    key: "fb-ospf",
    slug: "understanding-ospf",
    title: "Understanding OSPF: A Complete Guide for CCNA Students",
    excerpt:
      "Deep dive into OSPF routing protocol, covering areas, LSAs, neighbor relationships, and practical configuration examples on Cisco devices.",
    Icon: Network,
    category: "Networking",
    readTime: "12 min read",
    date: "Mar 2026",
    tags: ["OSPF", "CCNA", "Routing"],
  },
  {
    key: "fb-auto",
    slug: "network-automation-python",
    title: "Network Automation with Python: Building a Cisco Device Scanner",
    excerpt:
      "Learn how to automate network device management using Python and Netmiko. Includes code examples for SSH connections and data extraction.",
    Icon: Code2,
    category: "Automation",
    readTime: "15 min read",
    date: "Feb 2026",
    tags: ["Python", "Netmiko", "Automation"],
  },
  {
    key: "fb-acl",
    slug: "acl-best-practices",
    title: "Securing Your Network: ACL Best Practices",
    excerpt:
      "Comprehensive guide to implementing Access Control Lists for enterprise network security. Covers standard, extended, and named ACLs.",
    Icon: Shield,
    category: "Security",
    readTime: "10 min read",
    date: "Jan 2026",
    tags: ["Security", "ACLs", "Cisco"],
  },
  {
    key: "fb-subnet",
    slug: "subnet-calculator-python",
    title: "Building a Subnet Calculator CLI Tool in Python",
    excerpt:
      "Step-by-step tutorial on creating a command-line subnet calculator using Python's ipaddress module. Perfect for network engineers.",
    Icon: Terminal,
    category: "Development",
    readTime: "8 min read",
    date: "Dec 2025",
    tags: ["Python", "Subnetting", "CLI"],
  },
]

function normalizeTags(tags: BlogPostRow["tags"]): string[] {
  if (!Array.isArray(tags)) return []
  return tags
    .map((t) => (typeof t === "string" ? t.trim() : String(t)))
    .filter(Boolean)
}

export function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [loading, setLoading] = useState(true)
  const [dbPosts, setDbPosts] = useState<BlogPostRow[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("sort_order", { ascending: true })
        if (cancelled || error || !data?.length) {
          setDbPosts([])
        } else {
          setDbPosts(data as BlogPostRow[])
        }
      } catch {
        if (!cancelled) setDbPosts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const blogPosts = useMemo((): PostView[] => {
    if (!dbPosts.length) return FALLBACK_POSTS
    return dbPosts.map((row) => ({
      key: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      Icon: portfolioLucideIcon(row.icon_name, Network),
      category: row.category ?? "",
      readTime: row.read_time ?? "",
      date: row.date_display ?? "",
      tags: normalizeTags(row.tags),
    }))
  }, [dbPosts])

  const startSlug = blogPosts[0]?.slug ?? "understanding-ospf"

  return (
    <section id="blog" ref={ref} className="py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Blog & Insights
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Technical articles and tutorials sharing knowledge about networking,
            automation, and security.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {loading
            ? [0, 1, 2, 3].map((i) => (
                <Skeleton key={`blog-s-${i}`} className="h-[340px] rounded-xl border border-border" />
              ))
            : blogPosts.map((post, index) => {
                const PostIcon = post.Icon
                return (
                  <motion.div
                    key={post.key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="group h-full cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                        <CardHeader className="pb-3">
                          <div className="mb-3 flex items-start justify-between">
                            <motion.div
                              className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                              whileHover={{ rotate: 5, scale: 1.1 }}
                            >
                              <PostIcon className="h-6 w-6 text-primary" />
                            </motion.div>
                            <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                              {post.category}
                            </span>
                          </div>
                          <CardTitle className="group-hover:text-primary text-lg leading-tight transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                            {post.excerpt}
                          </p>

                          <div className="mb-4 flex flex-wrap gap-2">
                            {post.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {post.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime}
                              </span>
                            </div>
                            <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                              Read more
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href={`/blog/${startSlug}`}
            className="group inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            <BookOpen className="h-4 w-4" />
            Start reading
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
