-- Optional reference DDL for portfolio tables consumed by `/app/admin`.
-- Run this in Supabase SQL editor (adjust RLS policies for your security model).

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tech_stack jsonb default '[]'::jsonb,
  year text,
  github text,
  icon_name text,
  sort_order int default 0
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  category_icon text,
  name text not null,
  level int default 0,
  sort_order int default 0
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  location text,
  period text,
  description text,
  type text default 'work',
  sort_order int default 0
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text,
  link text,
  sort_order int default 0
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  slug text not null unique,
  category text,
  read_time text,
  date_display text,
  tags jsonb default '[]'::jsonb,
  icon_name text,
  sort_order int default 0
);

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  availability_badge text,
  hero_intro text,
  typewriter_roles jsonb default '[]'::jsonb,
  github_url text,
  linkedin_url text,
  email text,
  about_bio text
);
