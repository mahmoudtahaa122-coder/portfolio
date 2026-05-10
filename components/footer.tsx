'use client'

import Link from 'next/link'
import { Terminal, Github, Linkedin, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ProfileRow } from '@/lib/admin/types'

export function Footer() {
  const currentYear = new Date().getFullYear()
  type FooterProfile = Pick<
    ProfileRow,
    'display_name' | 'github_url' | 'linkedin_url' | 'email'
  >
  const [profile, setProfile] = useState<FooterProfile | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('display_name, github_url, linkedin_url, email')
          .limit(1)
          .maybeSingle()
        if (!cancelled) {
          setProfile(error || !data ? null : (data as FooterProfile))
        }
      } catch {
        if (!cancelled) setProfile(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const displayName = profile?.display_name?.trim() ?? ''
  const gh = profile?.github_url?.trim()
  const li = profile?.linkedin_url?.trim()
  const em = profile?.email?.trim()

  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link
            href="#home"
            className="flex items-center gap-2 font-mono font-bold text-primary"
          >
            <Terminal className="h-5 w-5 shrink-0" />
            <span>{displayName || ''}</span>
          </Link>

          <div className="flex items-center gap-4">
            {gh ? (
              <Link
                href={gh.startsWith('http') ? gh : `https://${gh}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            ) : null}
            {li ? (
              <Link
                href={li.startsWith('http') ? li : `https://${li}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            ) : null}
            {em ? (
              <Link
                href={`mailto:${em}`}
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">
            © {currentYear}
            {displayName ? ` ${displayName}` : ''}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
