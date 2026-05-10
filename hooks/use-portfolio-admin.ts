'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { ADMIN_AUTH_STORAGE_KEY } from '@/lib/admin/constants'
import type { PortfolioAdminData } from '@/lib/admin/types'

const emptyData: PortfolioAdminData = {
  projects: [],
  skills: [],
  experience: [],
  certifications: [],
  blog_posts: [],
  profile: null,
  education: [],
  testimonials: [],
  volunteering: [],
}

function firstSupabaseError(
  pairs: readonly [label: string, error: { message: string } | null][],
): Error | null {
  for (const [label, err] of pairs) {
    if (err) return new Error(`${label}: ${err.message}`)
  }
  return null
}

async function fetchAllPortfolioData(): Promise<PortfolioAdminData> {
  const [
    projects,
    skills,
    experience,
    certifications,
    blog_posts,
    profileResp,
    education,
    testimonials,
    volunteering,
  ] = await Promise.all([
    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
    supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    supabase.from('experience').select('*').order('sort_order', { ascending: true }),
    supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
    supabase.from('blog_posts').select('*').order('sort_order', { ascending: true }),
    supabase.from('profile').select('*').limit(1).maybeSingle(),
    supabase.from('education').select('*').order('sort_order', { ascending: true }),
    supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
    supabase.from('volunteering').select('*').order('sort_order', { ascending: true }),
  ])

  const err = firstSupabaseError([
    ['projects', projects.error],
    ['skills', skills.error],
    ['experience', experience.error],
    ['certifications', certifications.error],
    ['blog_posts', blog_posts.error],
    ['profile', profileResp.error],
    ['education', education.error],
    ['testimonials', testimonials.error],
    ['volunteering', volunteering.error],
  ])
  if (err) throw err

  return {
    projects: (projects.data ?? []) as PortfolioAdminData['projects'],
    skills: (skills.data ?? []) as PortfolioAdminData['skills'],
    experience: (experience.data ?? []) as PortfolioAdminData['experience'],
    certifications: (certifications.data ??
      []) as PortfolioAdminData['certifications'],
    blog_posts: (blog_posts.data ?? []) as PortfolioAdminData['blog_posts'],
    profile: (profileResp.data ?? null) as PortfolioAdminData['profile'],
    education: (education.data ?? []) as PortfolioAdminData['education'],
    testimonials: (testimonials.data ?? []) as PortfolioAdminData['testimonials'],
    volunteering: (volunteering.data ?? []) as PortfolioAdminData['volunteering'],
  }
}

export function usePortfolioAdmin() {
  const [hydrated, setHydrated] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [data, setData] = useState<PortfolioAdminData>(emptyData)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    try {
      setLoggedIn(localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true')
    } catch {
      setLoggedIn(false)
    }
    setHydrated(true)
  }, [])

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const next = await fetchAllPortfolioData()
      setData(next)
      return next
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (!hydrated || !loggedIn) return
    void refresh().catch((e: unknown) => {
      toast.error(
        e instanceof Error ? e.message : 'Failed to load data from Supabase.',
      )
    })
  }, [hydrated, loggedIn, refresh])

  const login = async (password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) {
      throw new Error(body.error ?? 'Login failed.')
    }
    localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true')
    setLoggedIn(true)
  }

  const logout = () => {
    try {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setLoggedIn(false)
    setData(emptyData)
  }

  return {
    hydrated,
    loggedIn,
    data,
    refreshing,
    refresh,
    login,
    logout,
  }
}
