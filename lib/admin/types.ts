/** Mirrors Supabase public table columns (snake_case). */

export type ProjectRow = {
  id: string
  created_at?: string
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
  created_at?: string
  category: string
  category_icon: string | null
  name: string
  level: number | null
  sort_order: number | null
}

export type ExperienceRow = {
  id: string
  created_at?: string
  title: string
  company: string | null
  location: string | null
  period: string | null
  description: string | null
  type: string | null
  tags: string[] | null
  sort_order: number | null
}

export type CertificationRow = {
  id: string
  created_at?: string
  name: string
  provider: string | null
  link: string | null
  sort_order: number | null
}

export type BlogPostRow = {
  id: string
  created_at?: string
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

export type ProfileRow = {
  id: string
  created_at?: string
  sort_order?: number | null
  display_name: string | null
  title: string | null
  hero_intro: string | null
  availability_badge: string | null
  typewriter_roles: string[] | null
  github_url: string | null
  linkedin_url: string | null
  email: string | null
  phone: string | null
  location: string | null
  about_bio: string | null
}

export type EducationRow = {
  id: string
  created_at?: string
  degree: string | null
  field: string | null
  institution: string | null
  period: string | null
  location: string | null
  grade: string | null
  sort_order: number | null
}

export type TestimonialRow = {
  id: string
  created_at?: string
  name: string
  role: string | null
  relationship: string | null
  date: string | null
  quote: string
  linkedin_url: string | null
  sort_order: number | null
}

export type VolunteeringRow = {
  id: string
  created_at?: string
  title: string
  organization: string
  period: string | null
  location: string | null
  description: string | null
  tags: string[] | null
  sort_order: number | null
}

export type PortfolioAdminData = {
  projects: ProjectRow[]
  skills: SkillRow[]
  experience: ExperienceRow[]
  certifications: CertificationRow[]
  blog_posts: BlogPostRow[]
  profile: ProfileRow | null
  education: EducationRow[]
  testimonials: TestimonialRow[]
  volunteering: VolunteeringRow[]
}
