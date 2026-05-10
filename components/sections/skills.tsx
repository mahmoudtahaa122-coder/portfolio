"use client"

import {
  Network,
  Server,
  Code2,
  Users,
  Terminal,
  Wifi,
  Monitor,
  FileCode,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { SkillRow } from "@/lib/admin/types"
import { portfolioLucideIcon } from "@/lib/portfolio-lucide"

const FALLBACK_TECH_ICONS = [
  { name: "Python", icon: Code2 },
  { name: "Cisco", icon: Network },
  { name: "Linux", icon: Terminal },
  { name: "Networking", icon: Wifi },
  { name: "Windows Server", icon: Monitor },
  { name: "Scripting", icon: FileCode },
] as const

type CategoryView = {
  title: string
  icon: LucideIcon
  skills: { name: string; level: number }[]
}

const FALLBACK_CATEGORIES: CategoryView[] = [
  {
    title: "Networking",
    icon: Network,
    skills: [
      { name: "Routing & Switching", level: 90 },
      { name: "TCP/IP", level: 95 },
      { name: "DNS & DHCP", level: 85 },
      { name: "VLANs & STP", level: 85 },
      { name: "OSPF", level: 80 },
      { name: "BNG/AAA/DPI", level: 75 },
      { name: "ISP Architecture", level: 80 },
      { name: "Network Troubleshooting", level: 90 },
    ],
  },
  {
    title: "Systems & Tools",
    icon: Server,
    skills: [
      { name: "Linux", level: 75 },
      { name: "Windows Server (MCSA)", level: 70 },
      { name: "Cisco IOS", level: 85 },
      { name: "Python Automation", level: 80 },
      { name: "Netmiko", level: 80 },
      { name: "Microsoft Office", level: 90 },
      { name: "Adobe Creative Suite", level: 75 },
    ],
  },
  {
    title: "Soft Skills",
    icon: Users,
    skills: [
      { name: "Communication", level: 90 },
      { name: "Problem-Solving", level: 95 },
      { name: "Teamwork", level: 90 },
      { name: "Adaptability", level: 85 },
      { name: "Leadership", level: 80 },
      { name: "Teaching", level: 85 },
    ],
  },
]

function groupSkillsFromRows(rows: SkillRow[]): CategoryView[] {
  const titles: string[] = []
  const map = new Map<
    string,
    { iconName: string | null; skills: { name: string; level: number }[] }
  >()

  for (const row of rows) {
    if (!map.has(row.category)) {
      titles.push(row.category)
      map.set(row.category, {
        iconName: row.category_icon,
        skills: [],
      })
    }
    const g = map.get(row.category)!
    if (!g.iconName && row.category_icon) {
      g.iconName = row.category_icon
    }
    g.skills.push({
      name: row.name,
      level:
        typeof row.level === "number"
          ? Math.min(100, Math.max(0, row.level))
          : 0,
    })
  }

  return titles.map((title) => {
    const g = map.get(title)!
    const icon = portfolioLucideIcon(g.iconName, Network)
    return { title, icon, skills: g.skills }
  })
}

function AnimatedProgressBar({
  level,
  delay = 0,
}: {
  level: number
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setWidth(level)
      }, delay * 100)
      return () => clearTimeout(timer)
    }
  }, [isInView, level, delay])

  return (
    <div ref={ref} className="h-2 overflow-hidden rounded-full bg-secondary">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  )
}

export function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [loading, setLoading] = useState(true)
  const [dbSkills, setDbSkills] = useState<SkillRow[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("sort_order", { ascending: true })
        if (cancelled || error || !data?.length) {
          setDbSkills([])
        } else {
          setDbSkills(data as SkillRow[])
        }
      } catch {
        if (!cancelled) setDbSkills([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    if (!dbSkills.length) return FALLBACK_CATEGORIES
    return groupSkillsFromRows(dbSkills)
  }, [dbSkills])

  return (
    <section id="skills" className="py-20 sm:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Technical competencies and professional skills developed through
            education and hands-on experience.
          </p>
        </motion.div>

        {loading ? (
          <div className="mb-16 flex flex-wrap justify-center gap-6">
            {FALLBACK_TECH_ICONS.map((_, idx) => (
              <Skeleton
                key={`t-${idx}`}
                className="h-28 w-[6.75rem] rounded-lg border border-border"
              />
            ))}
          </div>
        ) : (
          <div className="mb-16 flex flex-wrap justify-center gap-6">
            {FALLBACK_TECH_ICONS.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.15, y: -5 }}
                className="flex cursor-default flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <tech.icon className="h-8 w-8 text-primary" />
                <span className="text-xs text-muted-foreground">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [0, 1, 2].map((i) => (
                <Skeleton
                  key={`sk-${i}`}
                  className="min-h-[360px] rounded-xl border border-border"
                />
              ))
            : categories.map((category, index) => {
                const CatIcon = category.icon
                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <motion.div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            <CatIcon className="h-5 w-5 text-primary" />
                          </motion.div>
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {category.skills.map((skill, skillIndex) => (
                          <div key={`${skill.name}-${skillIndex}`}>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm text-foreground">
                                {skill.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {skill.level}%
                              </span>
                            </div>
                            <AnimatedProgressBar
                              level={skill.level}
                              delay={skillIndex}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
