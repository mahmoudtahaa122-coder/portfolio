'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Network } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SkillRow } from '@/lib/admin/types'
import { portfolioLucideIcon } from '@/lib/portfolio-lucide'
import { cn } from '@/lib/utils'

type CategoryView = {
  title: string
  icon: LucideIcon
  skills: { name: string; description: string | null }[]
}

function groupSkillsFromRows(rows: SkillRow[]): CategoryView[] {
  const titles: string[] = []
  const map = new Map<
    string,
    { iconName: string | null; skills: { name: string; description: string | null }[] }
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
      description:
        typeof row.description === 'string' && row.description.trim()
          ? row.description.trim()
          : null,
    })
  }

  return titles.map((title) => {
    const g = map.get(title)!
    const icon = portfolioLucideIcon(g.iconName, Network)
    return { title, icon, skills: g.skills }
  })
}

export function Skills() {
  const ref = useRef(null)
  const headerInView = useInView(ref, { once: true, margin: '-100px' })
  const [loading, setLoading] = useState(true)
  const [dbSkills, setDbSkills] = useState<SkillRow[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true })
        if (cancelled) return
        setDbSkills(!error && data?.length ? (data as SkillRow[]) : [])
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

  const categories = useMemo(() => groupSkillsFromRows(dbSkills), [dbSkills])

  return (
    <section id="skills" className="overflow-x-hidden py-20 sm:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl min-w-0 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Technical competencies grouped by focus area. Hover a skill for a
            short description.
          </p>
        </motion.div>

        {!loading && !categories.length ? (
          <p className="text-center text-sm text-muted-foreground">
            No skills listed yet.
          </p>
        ) : null}

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {[0, 1].map((i) => (
              <Skeleton
                key={`sk-${i}`}
                className="min-h-[180px] rounded-xl border border-border"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <TooltipPrimitive.Provider delayDuration={200} skipDelayDuration={0}>
            <div className="flex flex-col gap-12 lg:gap-14">
              {categories.map((category, index) => {
                const CatIcon = category.icon
                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <CatIcon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                        {category.title}
                      </h3>
                    </div>
                    <div className="flex max-w-full flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <SkillBadge
                          key={`${category.title}-${skill.name}`}
                          name={skill.name}
                          description={skill.description}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </TooltipPrimitive.Provider>
        ) : null}
      </div>
    </section>
  )
}

function SkillBadge({
  name,
  description,
}: {
  name: string
  description: string | null
}) {
  const pill = (
    <span
      className={cn(
        'inline-flex cursor-default select-none rounded-full border border-border',
        'bg-secondary/55 px-3 py-1.5 text-sm text-foreground',
        'transition-[background-color,border-color,transform] duration-150',
        description &&
          'hover:-translate-y-0.5 hover:border-primary/35 hover:bg-secondary',
      )}
    >
      {name}
    </span>
  )

  if (!description) return pill

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{pill}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={8}
          className={cn(
            'z-[80] max-w-xs rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2',
            'text-[11px] leading-snug text-zinc-100 shadow-xl',
            'animate-in fade-in-0 zoom-in-95 duration-150',
          )}
        >
          {description}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
