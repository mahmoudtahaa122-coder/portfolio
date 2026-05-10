'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Terminal, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { initialsFromName } from '@/lib/portfolio-fields'

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [brandInitials, setBrandInitials] = useState<string>('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('display_name')
          .limit(1)
          .maybeSingle()
        if (cancelled || error || !data) {
          setBrandInitials('')
        } else {
          const n = String((data as { display_name?: string | null }).display_name ?? '')
          setBrandInitials(initialsFromName(n) || '')
        }
      } catch {
        if (!cancelled) setBrandInitials('')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('cv')
          .select('pdf_url')
          .limit(1)
          .maybeSingle()
        if (cancelled || error) {
          setPdfUrl(null)
          return
        }
        const raw = String((data as { pdf_url?: string | null } | null)?.pdf_url ?? '')
        setPdfUrl(raw.trim() ? raw.trim() : null)
      } catch {
        if (!cancelled) setPdfUrl(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  function handleDownloadCv() {
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="#home"
            className="flex items-center gap-2 text-lg font-bold font-mono text-primary"
          >
            <Terminal className="h-5 w-5 shrink-0" />
            <span className="min-w-[2ch] text-left tracking-tight">
              {brandInitials}
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            {pdfUrl ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-11 min-h-11 gap-2 border-primary/40 bg-transparent sm:h-9 sm:min-h-0"
                onClick={handleDownloadCv}
              >
                <Download className="h-4 w-4 shrink-0" />
                Download CV
              </Button>
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-11 min-h-11 min-w-11 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isOpen ? (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-11 items-center py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {pdfUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 h-11 min-h-11 w-full justify-center gap-2 border-primary/40"
                  onClick={() => {
                    setIsOpen(false)
                    handleDownloadCv()
                  }}
                >
                  <Download className="h-4 w-4 shrink-0" />
                  Download CV
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
