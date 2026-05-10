-- Portfolio schema — run in Supabase SQL Editor.
-- Requires: create extension if not exists "pgcrypto";

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profile (site-wide copy; typically one row)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  display_name text,
  title text,
  hero_intro text,
  availability_badge text,
  typewriter_roles jsonb not null default '[]'::jsonb,
  github_url text,
  linkedin_url text,
  email text,
  phone text,
  location text,
  about_bio text
);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  title text not null,
  description text,
  tech_stack jsonb not null default '[]'::jsonb,
  year text,
  github text,
  icon_name text
);

-- ---------------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  category text not null,
  category_icon text,
  name text not null,
  level int default 0
);

-- ---------------------------------------------------------------------------
-- experience
-- ---------------------------------------------------------------------------
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  title text not null,
  company text,
  location text,
  period text,
  description text,
  type text default 'work',
  tags jsonb not null default '[]'::jsonb
);

-- ---------------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------------
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  name text not null,
  provider text,
  link text
);

-- ---------------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  title text not null,
  excerpt text,
  slug text not null unique,
  category text,
  read_time text,
  date_display text,
  tags jsonb not null default '[]'::jsonb,
  icon_name text
);

-- ---------------------------------------------------------------------------
-- education (About section)
-- ---------------------------------------------------------------------------
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  degree text,
  field text,
  institution text,
  period text,
  location text,
  grade text
);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  name text not null,
  role text,
  relationship text,
  date text,
  quote text not null,
  linkedin_url text
);

-- ---------------------------------------------------------------------------
-- volunteering
-- ---------------------------------------------------------------------------
create table if not exists public.volunteering (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  title text not null,
  organization text not null,
  period text,
  location text,
  description text,
  tags jsonb not null default '[]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Upgrades when migrating an existing database (idempotent)
-- ---------------------------------------------------------------------------
alter table public.profile add column if not exists title text;
alter table public.profile add column if not exists phone text;
alter table public.profile add column if not exists location text;
alter table public.experience add column if not exists tags jsonb default '[]'::jsonb;
