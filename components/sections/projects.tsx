"use client"

import Link from "next/link"
import { ExternalLink, Github, Terminal, Library, Award } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { ProjectRow } from "@/lib/admin/types"
import { portfolioLucideIcon } from "@/lib/portfolio-lucide"

type ProjectView = {
  key: string
  title: string
  description: string
  techStack: string[]
  year: string
  github?: string | null
  Icon: LucideIcon
}

const FALLBACK_PROJECTS: ProjectView[] = [
  {
    key: "fb-cisco-scanner",
    title: "Cisco Device Info Scanner",
    description:
      "Built a Python automation script using Netmiko to SSH into Cisco devices, retrieve interface status and device info, and export structured reports to CSV. Tested on Cisco DevNet Sandbox against live Cisco IOS devices.",
    techStack: ["Python", "Netmiko", "Cisco DevNet", "SSH", "CSV"],
    year: "2026",
    github: "https://github.com/mahmoudtahaa111",
    Icon: Terminal,
  },
  {
    key: "fb-subnet-cli",
    title: "Subnet Calculator & IP Planner CLI",
    description:
      "Developed a command-line tool for CIDR subnet breakdown, subnet splitting, and IP range validation using Python's ipaddress module. Supports CSV export of subnet plans; built to simulate a practical tool a network engineer would use daily.",
    techStack: ["Python", "ipaddress", "CLI", "CSV Export"],
    year: "2026",
    github: "https://github.com/mahmoudtahaa111",
    Icon: Terminal,
  },
  {
    key: "fb-mushaf",
    title: "Mushaf Digital Library",
    description:
      "Led a team of 12+ designers and reviewers to create a 70+ resource digital library actively used by 700+ monthly users. Reduced operational errors by 30% through efficient project management and quality control.",
    techStack: [
      "Adobe InDesign",
      "Photoshop",
      "Illustrator",
      "Project Management",
    ],
    year: "2022",
    Icon: Library,
  },
]

const certifications = [
  {
    name: "CCNA Enterprise Networking, Security, and Automation",
    provider: "Cisco/Credly",
    link: "https://credly.com/badges/0f45a6e4-417a-4b65-83c5-58bfe85cfe04",
  },
  {
    name: "CCNA Switching, Routing & Wireless Essentials",
    provider: "Cisco/Credly",
    link: "https://credly.com/badges/b5b99cf7-52fa-4786-b523-2f2e430923c4",
  },
  {
    name: "CCNA Introduction to Networks",
    provider: "Cisco/Credly",
    link: "https://credly.com/badges/202e56d7-5585-4bef-8920-504dbbb39c4d",
  },
  {
    name: "Introduction to Network Automation",
    provider: "Cisco/Coursera",
    link: "https://coursera.org/account/accomplishments/records/ZWQ4YMQ07R7R",
  },
  {
    name: "Using APIs for Network Automation",
    provider: "Cisco/Coursera",
    link: "https://coursera.org/account/accomplishments/records/UD0UW9I17E7C",
  },
  {
    name: "Introduction to Git and GitHub",
    provider: "Google Cloud/Coursera",
    link: "https://coursera.org/account/accomplishments/records/UNNMFA7RZRQJ",
  },
]

function techStackFromRow(row: ProjectRow): string[] {
  const raw = row.tech_stack
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean)
  return []
}

export function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [loading, setLoading] = useState(true)
  const [dbProjects, setDbProjects] = useState<ProjectRow[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("sort_order", { ascending: true })
        if (cancelled || error || !data?.length) {
          setDbProjects([])
        } else {
          setDbProjects(data as ProjectRow[])
        }
      } catch {
        if (!cancelled) setDbProjects([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const projects = useMemo((): ProjectView[] => {
    if (!dbProjects.length) return FALLBACK_PROJECTS
    return dbProjects.map((row) => ({
      key: row.id,
      title: row.title,
      description: row.description ?? "",
      techStack: techStackFromRow(row),
      year: row.year ?? "",
      github: row.github,
      Icon: portfolioLucideIcon(row.icon_name, Terminal),
    }))
  }, [dbProjects])

  return (
    <section id="projects" ref={ref} className="bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Projects & Certifications
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hands-on projects demonstrating network automation skills and
            professional certifications.
          </p>
        </motion.div>

        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [0, 1, 2].map((i) => (
                <Skeleton key={`ps-${i}`} className="h-[420px] rounded-xl border border-border" />
              ))
            : projects.map((project, index) => {
                const PI = project.Icon
                return (
                  <motion.div
                    key={project.key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className="group h-full border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <motion.div
                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            <PI className="h-6 w-6 text-primary" />
                          </motion.div>
                          <span className="font-mono text-xs text-muted-foreground">
                            {project.year}
                          </span>
                        </div>
                        <CardTitle className="mt-4 text-xl transition-colors group-hover:text-primary">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>

                        <div className="mb-6 flex flex-wrap gap-2">
                          {project.techStack.map((tech, techIndex) => (
                            <motion.span
                              key={techIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: techIndex * 0.05 }}
                              viewport={{ once: true }}
                              className="cursor-default rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>

                        {project.github ? (
                          <div className="flex items-center gap-4">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="gap-2 transition-colors hover:border-primary hover:text-primary"
                            >
                              <Link
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="h-4 w-4" />
                                View Code
                              </Link>
                            </Button>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-6 flex items-center justify-center gap-2 text-center text-xl font-semibold">
            <Award className="h-5 w-5 text-accent" />
            Certifications
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.link}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <Link
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="cursor-pointer border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-accent transition-transform group-hover:scale-150" />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-foreground transition-colors group-hover:text-accent">
                          {cert.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {cert.provider}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
