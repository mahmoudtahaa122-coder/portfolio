"use client"

import { GraduationCap, Building2, Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { EducationRow, ExperienceRow } from "@/lib/admin/types"

function AnimatedSection({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [loading, setLoading] = useState(true)
  const [experiences, setExperiences] = useState<ExperienceRow[]>([])
  const [educationRows, setEducationRows] = useState<EducationRow[]>([])
  const [aboutBio, setAboutBio] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [expRes, eduRes, profRes] = await Promise.all([
          supabase
            .from("experience")
            .select("*")
            .order("sort_order", { ascending: true }),
          supabase
            .from("education")
            .select("*")
            .order("sort_order", { ascending: true }),
          supabase.from("profile").select("about_bio").limit(1).maybeSingle(),
        ])
        if (cancelled) return
        setExperiences(
          !expRes.error && expRes.data?.length ? (expRes.data as ExperienceRow[]) : [],
        )
        setEducationRows(
          !eduRes.error && eduRes.data?.length ? (eduRes.data as EducationRow[]) : [],
        )
        const bio =
          profRes.data &&
          typeof (profRes.data as { about_bio?: string | null }).about_bio === "string"
            ? String((profRes.data as { about_bio: string | null }).about_bio).trim() ||
              null
            : null
        setAboutBio(bio || null)
      } catch {
        if (!cancelled) {
          setExperiences([])
          setEducationRows([])
          setAboutBio(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const bioText = useMemo(() => aboutBio ?? "", [aboutBio])

  return (
    <section id="about" className="py-20 sm:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A brief overview of my background, education, and professional
            experience.
          </p>
        </motion.div>

        {loading ? (
          <div className="mb-12 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl border border-border" />
          </div>
        ) : bioText ? (
          <AnimatedSection className="mb-12">
            <Card className="border-border bg-card transition-colors hover:border-primary/30">
              <CardContent className="p-6 sm:p-8">
                <p className="text-lg leading-relaxed text-foreground">{bioText}</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ) : null}

        <div
          className={`grid gap-12 ${
            educationRows.length && experiences.length ? "lg:grid-cols-2" : ""
          }`}
        >
          <AnimatedSection>
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" />
              Education
            </h3>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-xl border border-border" />
              </div>
            ) : educationRows.length ? (
              <div className="space-y-4">
                {educationRows.map((ed) => (
                  <motion.div
                    key={ed.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <GraduationCap className="h-6 w-6 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="break-words font-semibold text-foreground">
                              {ed.degree ?? "—"}
                            </h4>
                            {ed.field ? (
                              <p className="break-words font-medium text-primary">{ed.field}</p>
                            ) : null}
                            {ed.institution ? (
                              <p className="mt-1 break-words text-muted-foreground">
                                {ed.institution}
                              </p>
                            ) : null}
                            {ed.period ? (
                              <p className="mt-2 flex flex-wrap items-center gap-1 text-sm text-muted-foreground sm:mt-3">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span className="break-words">{ed.period}</span>
                              </p>
                            ) : null}
                            {ed.location ? (
                              <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="break-words">{ed.location}</span>
                              </p>
                            ) : null}
                            {ed.grade ? (
                              <p className="mt-3 break-words font-medium text-accent">{ed.grade}</p>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No education entries yet.</p>
            )}
          </AnimatedSection>

          <AnimatedSection>
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <Building2 className="h-5 w-5 text-primary" />
              Experience
            </h3>
            <div className="space-y-4">
              {loading ? (
                <>
                  {[0, 1, 2].map((s) => (
                    <Skeleton
                      key={`exp-s-${s}`}
                      className="h-36 w-full rounded-xl border border-border bg-card"
                    />
                  ))}
                </>
              ) : experiences.length ? (
                experiences.map((exp, index) => {
                  const t = String(exp.type ?? "work").toLowerCase()
                  const tagList = Array.isArray(exp.tags) ? exp.tags : []
                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <Card className="cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div
                              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                                t === "military" ? "bg-amber-500" : "bg-primary"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="break-words font-semibold text-foreground">
                                {exp.title}
                              </h4>
                              <span
                                className={`mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-xs capitalize sm:mt-0 sm:ml-0 ${
                                  t === "work"
                                    ? "bg-primary/20 text-primary"
                                    : t === "internship"
                                      ? "bg-accent/20 text-accent"
                                      : t === "military"
                                        ? "bg-amber-500/20 text-amber-500"
                                        : "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                {t === "military" ? "national service" : t}
                              </span>
                              <p className="mt-2 break-words text-sm font-medium text-primary">
                                {exp.company ?? ""}
                              </p>
                              {exp.period ? (
                                <p className="mt-1 flex flex-wrap items-center gap-1 break-words text-xs text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                                  {exp.period}
                                </p>
                              ) : null}
                              {exp.description ? (
                                <p className="mt-2 break-words text-sm leading-relaxed text-muted-foreground sm:line-clamp-4">
                                  {exp.description}
                                </p>
                              ) : null}
                              {tagList.length ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {tagList.map((tag, ti) => (
                                    <span
                                      key={`${exp.id}-t-${ti}`}
                                      className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No experience entries yet.
                </p>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
