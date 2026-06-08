-- ============================================================
-- Wreake Runners — Standards schema migration
-- Run this when you're ready to wire the Standards portal to
-- Supabase (currently mock-data-only).
--
-- Adds:
--  - gender + date_of_birth columns on profiles
--  - standards_lookup table (the 1,980-row target time table)
--  - member_standards_log table (member submissions)
--  - RLS policies
-- ============================================================

-- ---------- profiles: add member attributes for category assignment ----------
alter table public.profiles add column if not exists gender text check (gender in ('Male', 'Female'));
alter table public.profiles add column if not exists date_of_birth date;

-- ---------- standards_lookup ----------
create table if not exists public.standards_lookup (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  distance text not null,
  tier text not null,
  target_time_seconds integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists idx_standards_lookup_lookup
  on public.standards_lookup (category, distance);

alter table public.standards_lookup enable row level security;

-- Lookup is read-only to all authenticated users; only admins write.
drop policy if exists "lookup readable" on public.standards_lookup;
create policy "lookup readable"
  on public.standards_lookup for select
  to authenticated using (true);

drop policy if exists "admins write lookup" on public.standards_lookup;
create policy "admins write lookup"
  on public.standards_lookup for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- member_standards_log ----------
create table if not exists public.member_standards_log (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  distance text not null,
  achieved_time_seconds integer not null,
  formatted_time text not null,
  race_name text not null,
  race_date date not null,
  is_virtual boolean default false not null,
  is_leicestershire_region boolean default false not null,
  is_valid_lrrl_5k boolean default true not null,
  proof_url text,
  is_verified_by_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_msl_profile on public.member_standards_log (profile_id);

alter table public.member_standards_log enable row level security;

-- Members read/write their own logs.
drop policy if exists "members read own logs" on public.member_standards_log;
create policy "members read own logs"
  on public.member_standards_log for select
  to authenticated using (auth.uid() = profile_id);

drop policy if exists "members insert own logs" on public.member_standards_log;
create policy "members insert own logs"
  on public.member_standards_log for insert
  to authenticated with check (auth.uid() = profile_id);

drop policy if exists "members update own unverified logs" on public.member_standards_log;
create policy "members update own unverified logs"
  on public.member_standards_log for update
  to authenticated using (auth.uid() = profile_id and is_verified_by_admin = false);

drop policy if exists "members delete own unverified logs" on public.member_standards_log;
create policy "members delete own unverified logs"
  on public.member_standards_log for delete
  to authenticated using (auth.uid() = profile_id and is_verified_by_admin = false);

-- Admins read & verify everything.
drop policy if exists "admins read all logs" on public.member_standards_log;
create policy "admins read all logs"
  on public.member_standards_log for select
  to authenticated using (public.is_admin());

drop policy if exists "admins update any log" on public.member_standards_log;
create policy "admins update any log"
  on public.member_standards_log for update
  to authenticated using (public.is_admin());

drop policy if exists "admins delete any log" on public.member_standards_log;
create policy "admins delete any log"
  on public.member_standards_log for delete
  to authenticated using (public.is_admin());

-- ============================================================
-- After running this:
-- 1. Populate standards_lookup by exporting from lib/standards/lookup.js
--    (or running a one-off seed script — let me know if you want one).
-- 2. Set your own profile's gender + date_of_birth via SQL or a profile-edit
--    UI:  update public.profiles set gender = 'Male', date_of_birth = '1990-05-10'
--        where id = auth.uid();
-- ============================================================
