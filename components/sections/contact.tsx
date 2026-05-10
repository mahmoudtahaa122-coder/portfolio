"use client"

import Link from "next/link"
import { Mail, Github, Linkedin, MapPin, Phone, Send, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useMemo, useRef, useState, FormEvent } from "react"
import { supabase } from "@/lib/supabase"
import type { ProfileRow } from "@/lib/admin/types"

function telHref(phone: string): string | null {
  const t = phone.trim()
  if (!t) return null
  const cleaned = t.replace(/[^\d+]/g, "")
  return cleaned ? `tel:${cleaned}` : null
}

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error: err } = await supabase
          .from("profile")
          .select("email, phone, location, github_url, linkedin_url")
          .limit(1)
          .maybeSingle()
        if (!cancelled) {
          setProfile(err || !data ? null : (data as ProfileRow))
        }
      } catch {
        if (!cancelled) setProfile(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const contactBlocks = useMemo(() => {
    const items: Array<{
      icon: typeof Mail
      label: string
      value: string
      href: string | null
    }> = []
    const em = profile?.email?.trim()
    const phone = profile?.phone?.trim()
    const loc = profile?.location?.trim()
    if (em)
      items.push({
        icon: Mail,
        label: "Email",
        value: em,
        href: `mailto:${em}`,
      })
    if (phone) {
      items.push({
        icon: Phone,
        label: "Phone",
        value: phone,
        href: telHref(phone) ?? `tel:${phone}`,
      })
    }
    if (loc)
      items.push({
        icon: MapPin,
        label: "Location",
        value: loc,
        href: null,
      })
    return items
  }, [profile])

  const socialBlocks = useMemo(() => {
    const out: Array<{
      icon: typeof Github
      label: string
      href: string
    }> = []
    const gh = profile?.github_url?.trim()
    const li = profile?.linkedin_url?.trim()
    if (gh) {
      const hrefGh = gh.startsWith("http") ? gh : `https://${gh}`
      out.push({
        icon: Github,
        label: "GitHub",
        href: hrefGh,
      })
    }
    if (li) {
      out.push({
        icon: Linkedin,
        label: "LinkedIn",
        href: li.startsWith("http") ? li : `https://${li}`,
      })
    }
    return out
  }, [profile])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch("https://formspree.io/f/mjglrrak", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setIsSubmitted(true)
        form.reset()
      } else {
        const data = await response.json()
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            I&apos;m currently open to new opportunities. Whether you have a question
            or just want to say hi, feel free to reach out!
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-border bg-card transition-all hover:border-primary/30">
              <CardContent className="p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-semibold">Contact Information</h3>
                {loading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                ) : contactBlocks.length ? (
                  <div className="space-y-6">
                    {contactBlocks.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4"
                      >
                        <motion.div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <item.icon className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.href ? (
                            <Link
                              href={item.href}
                              className="break-all text-foreground transition-colors hover:text-primary"
                            >
                              {item.value}
                            </Link>
                          ) : (
                            <p className="text-foreground">{item.value}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No contact fields set in profile.</p>
                )}

                {!loading ? (
                  <>
                    <div className="mt-8 border-t border-border pt-8">
                      <h4 className="mb-4 text-sm font-semibold">Connect with me</h4>
                      {socialBlocks.length ? (
                        <div className="flex gap-4">
                          {socialBlocks.map((social) => (
                            <motion.div
                              key={social.label}
                              whileHover={{ scale: 1.15, y: -3 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Link
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                aria-label={social.label}
                              >
                                <social.icon className="h-5 w-5" />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No social links in profile.
                        </p>
                      )}
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-border bg-card transition-all hover:border-primary/30">
              <CardContent className="p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-semibold">Send a Message</h3>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
                    >
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </motion.div>
                    <h4 className="mb-2 text-xl font-semibold">Message Sent!</h4>
                    <p className="mb-6 text-muted-foreground">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="border-border hover:bg-secondary"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          className="border-border bg-secondary focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          className="border-border bg-secondary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        required
                        className="border-border bg-secondary focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message..."
                        rows={5}
                        required
                        className="resize-none border-border bg-secondary focus:border-primary"
                      />
                    </div>

                    {error ? (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {error}
                      </motion.p>
                    ) : null}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 min-h-12 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
