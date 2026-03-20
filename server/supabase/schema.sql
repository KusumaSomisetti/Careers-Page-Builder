create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo text,
  banner text,
  about text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.career_pages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  draft_theme_settings jsonb not null default '{}'::jsonb,
  draft_sections jsonb not null default '[]'::jsonb,
  draft_banner jsonb not null default '{}'::jsonb,
  published_theme_settings jsonb,
  published_sections jsonb,
  published_banner jsonb,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  location text not null,
  type text not null,
  summary text,
  work_policy text,
  department text,
  employment_type text,
  experience_level text,
  job_type text,
  salary_range text,
  job_slug text,
  posted_days_ago integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.jobs add column if not exists work_policy text;
alter table public.jobs add column if not exists department text;
alter table public.jobs add column if not exists employment_type text;
alter table public.jobs add column if not exists experience_level text;
alter table public.jobs add column if not exists job_type text;
alter table public.jobs add column if not exists salary_range text;
alter table public.jobs add column if not exists job_slug text;
alter table public.jobs add column if not exists posted_days_ago integer;

alter table public.career_pages add column if not exists draft_theme_settings jsonb not null default '{}'::jsonb;
alter table public.career_pages add column if not exists draft_sections jsonb not null default '[]'::jsonb;
alter table public.career_pages add column if not exists draft_banner jsonb not null default '{}'::jsonb;
alter table public.career_pages add column if not exists published_theme_settings jsonb;
alter table public.career_pages add column if not exists published_sections jsonb;
alter table public.career_pages add column if not exists published_banner jsonb;
alter table public.career_pages add column if not exists is_published boolean not null default false;
alter table public.career_pages add column if not exists published_at timestamptz;

create index if not exists career_pages_company_id_idx on public.career_pages(company_id);
create index if not exists jobs_company_id_idx on public.jobs(company_id);
create index if not exists jobs_location_idx on public.jobs(location);
create index if not exists jobs_type_idx on public.jobs(type);

drop index if exists jobs_company_job_slug_uidx;
alter table public.jobs drop constraint if exists jobs_company_job_slug_key;
alter table public.jobs add constraint jobs_company_job_slug_key unique (company_id, job_slug);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists career_pages_set_updated_at on public.career_pages;
create trigger career_pages_set_updated_at
before update on public.career_pages
for each row execute function public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();
