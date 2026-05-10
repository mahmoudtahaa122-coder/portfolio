/** Mirrors expected Supabase public table columns (snake_case). */

export type ProjectRow = {
  id: string
  title: string
  description: string | null
  tech_stack: string[] | null
  year: string | null
  github: string | null
  icon_name: string | null
  sort_order: number | null
}

export type SkillRow = {
  id: string
  category: string
  category_icon: string | null
  name: string
  level: number | null
  sort_order: number | null
}

export type ExperienceRow = {
  id: string
  title: string
  company: string | null
  location: string | null
  period: string | null
  description: string | null
  type: string | null
  sort_order: number | null
}

export type CertificationRow = {
  id: string
  name: string
  provider: string | null
  link: string | null
  sort_order: number | null
}

export type BlogPostRow = {
  id: string
  title: string
  excerpt: string | null
  slug: string
  category: string | null
  read_time: string | null
  date_display: string | null
  tags: string[] | null
  icon_name: string | null
  sort_order: number | null
}

/** Single-row site copy; create one row in Supabase for the portfolio hero / about snippets. */
export type ProfileRow = {
  id: string
  display_name: string | null
  availability_badge: string | null
  hero_intro: string | null
  typewriter_roles: string[] | null
  github_url: string | null
  linkedin_url: string | null
  email: string | null
  about_bio: string | null
}

export type PortfolioAdminData = {
  projects: ProjectRow[]
  skills: SkillRow[]
  experience: ExperienceRow[]
  certifications: CertificationRow[]
  blog_posts: BlogPostRow[]
  profile: ProfileRow | null
}
