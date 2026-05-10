"use client"

import { GraduationCap, Building2, Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { ExperienceRow } from "@/lib/admin/types"

const FALLBACK_EXPERIENCES: Omit<ExperienceRow, "id">[] = [
  {
    title: "Technical Instructor",
    company: "iSchool",
    location: "Egypt",
    period: "Nov 2024 – Dec 2024 | Mar 2026 – Present",
    description:
      "Teaching programming fundamentals using Python, Mblock, and Scratch. Applied modern teaching strategies including project-based learning and interactive sessions.",
    type: "work",
    sort_order: 0,
  },
  {
    title: "Military Service — Electronic Warfare Corps",
    company: "Egyptian Armed Forces",
    location: "Egypt",
    period: "Mar 2025 – Mar 2026",
    description:
      "Served in the Egyptian Army as part of mandatory national service, assigned to the Electronic Warfare branch.",
    type: "military",
    sort_order: 1,
  },
  {
    title: "Network VAS Engineer Intern",
    company: "Telecom Egypt (WE)",
    location: "Egypt",
    period: "Aug 2024 – Oct 2024",
    description:
      "Worked hands-on with Cisco-based ISP infrastructure including BNG, AAA, DNS, and DPI systems. Diagnosed and resolved live network faults across ISP layers.",
    type: "internship",
    sort_order: 2,
  },
  {
    title: "Network Administrator Intern",
    company: "Ministry of Communications (DEPI)",
    location: "Egypt",
    period: "Mar 2024 – Oct 2024",
    description:
      "Configured and troubleshot switching and routing protocols (VLANs, STP, OSPF) alongside TCP/IP, DNS, and DHCP in structured lab environments.",
    type: "internship",
    sort_order: 3,
  },
  {
    title: "Customer Support → Project Manager",
    company: "E-Alim Institute",
    location: "Egypt",
    period: "Jul 2022 – Oct 2022 | Jul 2023 – Sep 2023",
    description:
      "Supported 25+ customers daily, promoted to Project Manager. Launched a 70+ resource digital library used by 700+ users monthly. Reduced operational errors by 30%.",
    type: "work",
    sort_order: 4,
  },
  {
    title: "Data Center Training",
    company: "Telecom Egypt (WE)",
    location: "Egypt",
    period: "Aug 2022",
    description:
      "Assisted in managing data center networking equipment. Studied high-availability design principles including redundancy and failover.",
    type: "training",
    sort_order: 5,
  },
]

const SUMMARY_BODY =
  "Network Engineer graduate from Helwan University with hands-on experience in live Cisco-based ISP environments at Telecom Egypt and the Ministry of Communications. Skilled in TCP/IP, DNS, DHCP, switching, routing, and ISP architecture (BNG, AAA, DPI). Cisco Networking Academy certified with practical automation skills in Python and a passion for network operations and infrastructure. Familiar with Windows Server administration at MCSA level."

const education = {
  degree: "Bachelor's Degree in Engineering",
  field: "Communication, Electronics and Computer",
  school: "Helwan University",
  period: "Aug 2019 – Aug 2024",
  location: "Egypt",
  achievement: "Graduation Project Grade: Excellent",
}

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
  const [dbExperience, setDbExperience] = useState<ExperienceRow[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("experience")
          .select("*")
          .order("sort_order", { ascending: true })
        if (
          cancelled ||
          error ||
          !data?.length
        ) {
          setDbExperience([])
        } else {
          setDbExperience(data as ExperienceRow[])
        }
      } catch {
        if (!cancelled) setDbExperience([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const experiences = useMemo(() => {
    if (dbExperience.length) return dbExperience
    return FALLBACK_EXPERIENCES.map((exp, idx) => ({
      ...exp,
      id: `fallback-${idx}`,
    })) as ExperienceRow[]
  }, [dbExperience])

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

        <AnimatedSection className="mb-12">
          <Card className="border-border bg-card transition-colors hover:border-primary/30">
            <CardContent className="p-6 sm:p-8">
              <p className="text-lg leading-relaxed text-foreground">{SUMMARY_BODY}</p>
            </CardContent>
          </Card>
        </AnimatedSection>

        <div className="grid gap-12 lg:grid-cols-2">
          <AnimatedSection>
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" />
              Education
            </h3>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{education.degree}</h4>
                      <p className="font-medium text-primary">{education.field}</p>
                      <p className="mt-1 text-muted-foreground">{education.school}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {education.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {education.location}
                        </span>
                      </div>
                      <p className="mt-3 font-medium text-accent">{education.achievement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
              ) : (
                experiences.map((exp, index) => {
                  const t = String(exp.type ?? "work").toLowerCase()
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
                          <div className="flex items-start gap-4">
                            <div
                              className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
                                t === "military" ? "bg-amber-500" : "bg-primary"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <h4 className="truncate font-semibold text-foreground">
                                  {exp.title}
                                </h4>
                                <span
                                  className={`w-fit rounded-full px-2 py-0.5 text-xs capitalize ${
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
                              </div>
                              <p className="text-sm font-medium text-primary">
                                {exp.company ?? ""}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {exp.period ?? ""}
                              </p>
                              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                {exp.description ?? ""}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
