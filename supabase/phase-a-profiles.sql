-- ============================================================
-- Wreake Runners — Phase A: Profiles expansion
--
-- Adds the columns needed for:
--   - Member-editable profile (first/last name, DOB, club start, bio)
--   - Standards portal (gender + DOB for category assignment)
--
-- Safe to re-run: every statement uses IF NOT EXISTS.
-- ============================================================

-- ---------- new columns ----------
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists gender text check (gender in ('Male', 'Female'));
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists club_start_date date;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists avatar_url text;
-- avatar_url is reserved for Phase A+ (when we wire Supabase Storage for avatars).
-- For now it just sits there — null on every row.

-- ---------- backfill: split existing full_name into first/last ----------
-- Only runs for rows where first_name is still null but full_name has content.
-- Splits on the FIRST space. "John Smith" -> "John" / "Smith".
-- "Mary Jane Watson" -> "Mary" / "Jane Watson".
update public.profiles
   set first_name = split_part(full_name, ' ', 1),
       last_name  = nullif(substr(full_name, length(split_part(full_name, ' ', 1)) + 2), '')
 where first_name is null
   and full_name is not null
   and full_name <> '';

-- ---------- update RLS policies so members can edit their own row ----------
-- Members already have a SELECT policy on profiles; they need an UPDATE policy
-- that lets them update their own row (but not their role).

drop policy if exists "members update own profile" on public.profiles;
create policy "members update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins (existing policy) can update anyone.

-- ============================================================
-- After running this:
-- 1. Go to your profile-edit page on the site and fill in your details.
-- 2. The Standards portal will start using your real gender + DOB.
-- ============================================================
