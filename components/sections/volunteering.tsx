"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Palette, Calendar, MapPin } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { VolunteeringRow } from "@/lib/admin/types"
import { asStringArray } from "@/lib/portfolio-fields"

const ICONS: LucideIcon[] = [Users, Palette]

export function Volunteering() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<VolunteeringRow[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("volunteering")
          .select("*")
          .order("sort_order", { ascending: true })
        if (cancelled) return
        setRows(!error && data?.length ? (data as VolunteeringRow[]) : [])
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
    <section ref={ref} className="py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Community & Volunteering
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Giving back to the community through student organizations and creative
            initiatives.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            [0, 1].map((i) => (
              <Skeleton key={`vol-${i}`} className="min-h-[280px] rounded-xl border border-border" />
            ))
          ) : rows.length ? (
            rows.map((exp, index) => {
              const Icon = ICONS[index % ICONS.length]
              const tags = asStringArray(exp.tags)
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start gap-4">
                        <motion.div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20" whileHover={{ rotate: 5, scale: 1.1 }}>
                          <Icon className="h-7 w-7 text-primary" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {exp.organization}
                          </h3>
                          <p className="font-medium text-primary">{exp.title}</p>
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {exp.period ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {exp.period}
                          </span>
                        ) : null}
                        {exp.location ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exp.location}
                          </span>
                        ) : null}
                      </div>

                      {exp.description ? (
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                          {exp.description}
                        </p>
                      ) : null}

                      {tags.length ? (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((activity, actIndex) => (
                            <motion.span
                              key={`${exp.id}-${actIndex}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: actIndex * 0.05 }}
                              viewport={{ once: true }}
                              className="cursor-default rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                            >
                              {activity}
                            </motion.span>
                          ))}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <p className="col-span-full py-16 text-center text-sm text-muted-foreground md:col-span-2">
              No volunteering entries yet.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
