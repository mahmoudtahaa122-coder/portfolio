"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Quote, Star, Linkedin } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { TestimonialRow } from "@/lib/admin/types"
import { initialsFromName } from "@/lib/portfolio-fields"

function initialsBadge(name: string) {
  const i = initialsFromName(name)
  if (i) return i
  return "?"
}

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<TestimonialRow[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("sort_order", { ascending: true })
        if (cancelled) return
        setRows(!error && data?.length ? (data as TestimonialRow[]) : [])
      } catch {
        if (!cancelled) setRows([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section ref={ref} className="bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Recommendations
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            What colleagues and mentors say about working with me.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-8">
          {loading ? (
            <>
              <Skeleton className="h-80 w-full rounded-xl border border-border" />
              <Skeleton className="h-80 w-full rounded-xl border border-border md:hidden" />
            </>
          ) : rows.length ? (
            rows.map((testimonial, index) => {
              const li = testimonial.linkedin_url?.trim()
              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative overflow-hidden border-border bg-card transition-all hover:border-primary/30">
                    <div className="absolute top-4 right-4 opacity-10">
                      <Quote className="h-24 w-24 text-primary" />
                    </div>

                    <CardContent className="relative p-4 sm:p-8">
                      <div className="mb-6 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            viewport={{ once: true }}
                          >
                            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                          </motion.div>
                        ))}
                      </div>

                      <blockquote className="mb-8 break-words text-base leading-relaxed italic text-foreground sm:text-lg">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-primary-foreground">
                            {initialsBadge(testimonial.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {[testimonial.role, testimonial.relationship].filter(Boolean).join(" • ")}
                            </p>
                            {testimonial.date ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {testimonial.date}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {li ? (
                          <Link
                            href={li}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                            aria-label="View on LinkedIn"
                          >
                            <Linkedin className="h-5 w-5" />
                          </Link>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <p className="text-center text-sm text-muted-foreground">No testimonials yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}
