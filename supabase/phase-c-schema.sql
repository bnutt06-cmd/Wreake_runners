-- ============================================================
-- Wreake Runners — Phase C: Events + Pinned Post
--
-- Adds:
--   - club_events       (calendar entries: training nights AND events)
--   - pinned_posts      (admin-editable banner on the Club Area)
--
-- Safe to re-run.
-- Run AFTER phase-b-schema.sql.
-- ============================================================

-- ============================================================
-- 1. club_events
--
-- Single table for both regular training nights AND one-off events.
-- The `event_type` field distinguishes them so the UI can filter:
--   Training, Social, Meeting, Other
-- ============================================================
create table if not exists public.club_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_timestamp timestamp with time zone not null,
  end_timestamp timestamp with time zone,
  event_type text not null default 'Training',
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_club_events_date on public.club_events (event_timestamp);

alter table public.club_events enable row level security;

-- Everyone can read events (so the calendar shows for everyone).
drop policy if exists "events readable" on public.club_events;
create policy "events readable"
  on public.club_events for select
  to anon, authenticated using (true);

-- Only admins write events.
drop policy if exists "admins write events" on public.club_events;
create policy "admins write events"
  on public.club_events for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 2. pinned_posts
--
-- Holds the small banner that shows at the top of the Club Area.
-- Typically only one row at a time (the active pin), but multiple
-- pinned posts can exist; the UI picks the most recent.
-- ============================================================
create table if not exists public.pinned_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  author_id uuid references public.profiles(id) on delete set null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_pinned_active on public.pinned_posts (is_active, created_at desc);

alter table public.pinned_posts enable row level security;

drop policy if exists "pins readable" on public.pinned_posts;
create policy "pins readable"
  on public.pinned_posts for select
  to anon, authenticated using (true);

drop policy if exists "admins write pins" on public.pinned_posts;
create policy "admins write pins"
  on public.pinned_posts for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- After running this:
-- 1. Go to /admin/events to add training nights and events.
-- 2. Go to /admin/pin to set the pinned post on the Club Area.
-- ============================================================
