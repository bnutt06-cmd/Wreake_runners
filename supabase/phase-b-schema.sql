-- ============================================================
-- Wreake Runners — Phase B schema
--
-- Creates everything needed for the Race Hub and Standards portal
-- to persist properly:
--
--   - races                  (race entries with GPX-derived fields)
--   - race_registrations     (I'm Running RSVPs)
--   - standards_lookup       (1,980-row category x distance x tier table)
--   - member_standards_log   (submitted performances)
--
-- Plus Storage bucket policies for race GPX files.
--
-- Safe to re-run: every statement uses IF NOT EXISTS.
-- Run AFTER phase-a-profiles.sql.
-- ============================================================

-- ============================================================
-- 1. races
-- ============================================================
create table if not exists public.races (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  race_date date not null,
  type text,
  location text,
  distance_text text,
  blurb text,
  description text,
  course_notes text,
  external_signup_url text,
  -- GPX-derived (populated when admin uploads a GPX file)
  route jsonb,
  distance_m integer,
  elevation_gain_m integer,
  elevation_loss_m integer,
  start_lat double precision,
  start_lon double precision,
  gpx_storage_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_races_date on public.races (race_date desc);

alter table public.races enable row level security;

drop policy if exists "races readable by all" on public.races;
create policy "races readable by all"
  on public.races for select
  to anon, authenticated using (true);

drop policy if exists "admins write races" on public.races;
create policy "admins write races"
  on public.races for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 2. race_registrations  (I'm Running RSVPs)
-- ============================================================
create table if not exists public.race_registrations (
  id uuid default gen_random_uuid() primary key,
  race_id uuid references public.races(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (race_id, profile_id)
);

create index if not exists idx_race_regs_race on public.race_registrations (race_id);
create index if not exists idx_race_regs_profile on public.race_registrations (profile_id);

alter table public.race_registrations enable row level security;

-- Everyone can see who is running (so the roster can render publicly).
drop policy if exists "regs readable by all" on public.race_registrations;
create policy "regs readable by all"
  on public.race_registrations for select
  to anon, authenticated using (true);

-- Authenticated users insert/delete only their own registration.
drop policy if exists "users insert own reg" on public.race_registrations;
create policy "users insert own reg"
  on public.race_registrations for insert
  to authenticated with check (auth.uid() = profile_id);

drop policy if exists "users delete own reg" on public.race_registrations;
create policy "users delete own reg"
  on public.race_registrations for delete
  to authenticated using (auth.uid() = profile_id);

-- ============================================================
-- 3. standards_lookup
-- (Populate via the separate phase-b-standards-seed.sql script)
-- ============================================================
create table if not exists public.standards_lookup (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  distance text not null,
  tier text not null,
  target_time_seconds integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (category, distance, tier)
);

create index if not exists idx_standards_lookup_lookup
  on public.standards_lookup (category, distance);

alter table public.standards_lookup enable row level security;

drop policy if exists "lookup readable" on public.standards_lookup;
create policy "lookup readable"
  on public.standards_lookup for select
  to authenticated using (true);

drop policy if exists "admins write lookup" on public.standards_lookup;
create policy "admins write lookup"
  on public.standards_lookup for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 4. member_standards_log
-- ============================================================
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

drop policy if exists "members update own unverified" on public.member_standards_log;
create policy "members update own unverified"
  on public.member_standards_log for update
  to authenticated using (auth.uid() = profile_id and is_verified_by_admin = false);

drop policy if exists "members delete own unverified" on public.member_standards_log;
create policy "members delete own unverified"
  on public.member_standards_log for delete
  to authenticated using (auth.uid() = profile_id and is_verified_by_admin = false);

-- Admins read all and verify.
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
-- 5. Storage bucket for race GPX files
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('race-gpx', 'race-gpx', true)
  on conflict (id) do nothing;
-- Public read so the modal can fetch GPX without auth headers.
-- Files contain only route geometry, no personal data.

drop policy if exists "race-gpx admins write" on storage.objects;
create policy "race-gpx admins write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'race-gpx' and public.is_admin());

drop policy if exists "race-gpx admins update" on storage.objects;
create policy "race-gpx admins update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'race-gpx' and public.is_admin());

drop policy if exists "race-gpx admins delete" on storage.objects;
create policy "race-gpx admins delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'race-gpx' and public.is_admin());

drop policy if exists "race-gpx readable" on storage.objects;
create policy "race-gpx readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'race-gpx');

-- ============================================================
-- After running this:
-- 1. Run phase-b-standards-seed.sql to populate the lookup table.
-- 2. Deploy the code.
-- 3. Log in as admin and create races via /admin/races.
-- ============================================================
