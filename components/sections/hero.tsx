"use client"

import Link from "next/link"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { ProfileRow } from "@/lib/admin/types"

const DEFAULT_AVAILABILITY = "Available for opportunities"
const DEFAULT_DISPLAY_NAME = "Mahmoud Taha"
const DEFAULT_INTRO =
  "Network Engineer graduate with hands-on experience in live Cisco-based ISP environments. Skilled in TCP/IP, switching, routing, and ISP architecture with practical automation skills in Python."
const DEFAULT_ROLES = [
  "Network Engineer",
  "Python Developer",
  "Cisco Certified",
  "Network Automation",
]

const DEFAULT_SOCIAL = {
  github: "https://github.com/mahmoudtahaa111",
  linkedin: "https://linkedin.com/in/mahmoud-taha-salama",
  email: "Mahmoudtahaa111@gmail.com",
}

function normalizeRoles(raw: ProfileRow["typewriter_roles"]): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x) => typeof x === "string" && x.trim().length > 0)
}

function ParticleNetwork() {
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([])

  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }))
    setParticles(initialParticles)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + p.vx + 100) % 100,
          y: (p.y + p.vy + 100) % 100,
        })),
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <svg className="absolute inset-0 h-full w-full opacity-30">
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r="2"
          fill="currentColor"
          className="text-primary"
        />
      ))}
      {particles.map((p1, i) =>
        particles.slice(i + 1).map((p2, j) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
          if (dist < 15) {
            return (
              <line
                key={`${i}-${j}`}
                x1={`${p1.x}%`}
                y1={`${p1.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke="currentColor"
                strokeOpacity={0.3 - dist / 50}
                className="text-primary"
              />
            )
          }
          return null
        }),
      )}
    </svg>
  )
}

function useTypewriter(
  texts: string[],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!texts.length) return

    let timeoutTwo: ReturnType<typeof setTimeout> | undefined
    const currentText = texts[currentIndex % texts.length]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1))
          } else {
            timeoutTwo = setTimeout(() => setIsDeleting(true), pauseTime)
          }
        } else if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => {
      clearTimeout(timeout)
      clearTimeout(timeoutTwo)
    }
  }, [
    displayText,
    currentIndex,
    isDeleting,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ])

  useEffect(() => {
    setDisplayText("")
    setCurrentIndex(0)
    setIsDeleting(false)
  }, [texts])

  return displayText
}

export function Hero() {
  const [loading, setLoading] = useState(true)
  const [dbProfile, setDbProfile] = useState<ProfileRow | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .limit(1)
          .maybeSingle()
        if (cancelled || error || !data) {
          setDbProfile(null)
        } else {
          setDbProfile(data as ProfileRow)
        }
      } catch {
        if (!cancelled) setDbProfile(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const availabilityBadge = dbProfile?.availability_badge ?? DEFAULT_AVAILABILITY
  const displayName = dbProfile?.display_name ?? DEFAULT_DISPLAY_NAME
  const intro =
    dbProfile?.hero_intro && dbProfile.hero_intro.trim()
      ? dbProfile.hero_intro
      : DEFAULT_INTRO

  const typewriterTexts = useMemo(() => {
    const fromDb = normalizeRoles(dbProfile?.typewriter_roles ?? null)
    return fromDb.length ? fromDb : DEFAULT_ROLES
  }, [dbProfile])

  const typewriterText = useTypewriter(typewriterTexts, 100, 50, 2000)

  const socialLinks = useMemo(
    () => [
      {
        href: dbProfile?.github_url?.trim() || DEFAULT_SOCIAL.github,
        icon: Github,
        label: "GitHub",
      },
      {
        href: dbProfile?.linkedin_url?.trim() || DEFAULT_SOCIAL.linkedin,
        icon: Linkedin,
        label: "LinkedIn",
      },
      {
        href:
          dbProfile?.email?.trim()
            ? `mailto:${dbProfile.email.trim()}`
            : `mailto:${DEFAULT_SOCIAL.email}`,
        icon: Mail,
        label: "Email",
      },
    ],
    [dbProfile?.github_url, dbProfile?.linkedin_url, dbProfile?.email],
  )

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <ParticleNetwork />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-8">
              <Skeleton className="mb-8 h-9 w-[min(20rem,calc(100vw-4rem))] rounded-full md:w-[20rem]" />
              <Skeleton className="h-12 w-[min(32rem,calc(100vw-4rem))] md:h-16 lg:h-20" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="mx-auto mb-12 h-[4.75rem] w-full max-w-2xl" />
              <div className="mb-16 flex flex-col gap-4 sm:flex-row">
                <Skeleton className="h-11 w-40 mx-auto sm:mx-0" />
                <Skeleton className="h-11 w-40 mx-auto sm:mx-0" />
              </div>
              <div className="flex gap-8">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                <code className="font-mono text-sm text-muted-foreground">
                  {availabilityBadge}
                </code>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <span className="text-foreground">Hi, I&apos;m </span>
                <span className="animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
                  {displayName}
                </span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 h-10 text-xl font-medium text-muted-foreground sm:h-11 sm:text-2xl md:text-3xl"
              >
                <span className="text-primary">{typewriterText}</span>
                <span className="animate-pulse">|</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground"
              >
                {intro}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Button
                  asChild
                  size="lg"
                  className="group gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="#projects">
                    View My Work
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 border-border transition-colors hover:border-primary hover:bg-secondary"
                >
                  <Link href="#contact">
                    <Mail className="h-4 w-4" />
                    Get in Touch
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center justify-center gap-6"
              >
                {socialLinks.map((social) => (
                  <motion.div
                    key={social.label}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={social.href}
                      target={
                        social.href.startsWith("mailto") ? undefined : "_blank"
                      }
                      rel={
                        social.href.startsWith("mailto")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label={social.label}
                    >
                      <social.icon className="h-6 w-6" />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {!loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-2"
          >
            <div className="h-2 w-1 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      ) : null}
    </section>
  )
}
