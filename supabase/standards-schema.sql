-- ============================================================
-- Wreake Runners — Race Hub schema migration
-- Run when wiring the Race Hub to Supabase.
--
-- Builds on the addendum: extends `races` with GPX-derived fields,
-- adds storage policy for gpx files, and the race_registrations
-- table for "I'm Running".
-- ============================================================

-- ---------- races ----------
create table if not exists public.races (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  race_date date not null,
  type text,
  location text,
  distance_text text,                 -- 'stated' distance e.g. "8 miles"
  blurb text,                         -- shown on list view
  description text,                   -- shown in modal
  course_notes text,
  external_signup_url text,
  -- GPX-derived (populated when an admin uploads a GPX)
  route jsonb,                        -- simplified [{lat,lon,ele},...] for map render
  distance_m integer,
  elevation_gain_m integer,
  elevation_loss_m integer,
  start_lat double precision,
  start_lon double precision,
  gpx_storage_path text,              -- e.g. 'race-gpx/uuid.gpx' in Storage bucket
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

-- ---------- race_registrations (the I'm Running RSVPs) ----------
create table if not exists public.race_registrations (
  id uuid default gen_random_uuid() primary key,
  race_id uuid references public.races(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (race_id, profile_id)
);

create index if not exists idx_race_regs_race on public.race_registrations (race_id);

alter table public.race_registrations enable row level security;

-- Everyone can see who's running (so the roster can render publicly).
drop policy if exists "regs readable by all" on public.race_registrations;
create policy "regs readable by all"
  on public.race_registrations for select
  to anon, authenticated using (true);

-- Authenticated users insert/delete only their OWN registration.
drop policy if exists "users insert own reg" on public.race_registrations;
create policy "users insert own reg"
  on public.race_registrations for insert
  to authenticated with check (auth.uid() = profile_id);

drop policy if exists "users delete own reg" on public.race_registrations;
create policy "users delete own reg"
  on public.race_registrations for delete
  to authenticated using (auth.uid() = profile_id);

-- ============================================================
-- Storage bucket for GPX files (run in Supabase Storage UI):
--   1. Create bucket: race-gpx (public: NO)
--   2. Add policy: admins can insert/update/delete; everyone can select.
--
-- Or, to do it via SQL:
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('race-gpx', 'race-gpx', false)
--   on conflict (id) do nothing;
--
-- drop policy if exists "race-gpx admins write" on storage.objects;
-- create policy "race-gpx admins write"
--   on storage.objects for all to authenticated
--   using (bucket_id = 'race-gpx' and public.is_admin())
--   with check (bucket_id = 'race-gpx' and public.is_admin());
--
-- drop policy if exists "race-gpx readable" on storage.objects;
-- create policy "race-gpx readable"
--   on storage.objects for select to anon, authenticated
--   using (bucket_id = 'race-gpx');
