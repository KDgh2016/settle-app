-- Run this whole file once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

-- One row per user: their visa route and key dates.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  route_id text not null default 'other',
  qualifying_years numeric,
  visa_start date not null,
  visa_expiry date,
  companion_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Many rows per user: each trip abroad.
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dep_date date not null,
  ret_date date not null,
  companion text not null check (companion in ('alone', 'with_family', 'partial')),
  destination text,
  reason text,
  notes text,
  created_at timestamptz default now()
);

alter table public.trips enable row level security;

create policy "trips_select_own" on public.trips
  for select using (auth.uid() = user_id);

create policy "trips_insert_own" on public.trips
  for insert with check (auth.uid() = user_id);

create policy "trips_update_own" on public.trips
  for update using (auth.uid() = user_id);

create policy "trips_delete_own" on public.trips
  for delete using (auth.uid() = user_id);

create index if not exists trips_user_id_idx on public.trips (user_id);

-- These policies are what make every user's data private automatically:
-- Postgres itself refuses to return or modify rows that don't belong to
-- the signed-in user, regardless of what the app code does.

-- ────────────────────────────────────────────────────────────────────
-- MIGRATING FROM AN EARLIER VERSION OF THIS APP?
--
-- From the original spouse-only version (had "partner_name", no "route_id"):
--   alter table public.profiles add column if not exists route_id text not null default 'other';
--   alter table public.profiles add column if not exists qualifying_years numeric;
--   alter table public.profiles rename column partner_name to companion_name;
--   alter table public.trips drop constraint if exists trips_companion_check;
--   update public.trips set companion = 'with_family' where companion = 'together';
--   update public.trips set companion = 'alone' where companion = 'solo';
--   update public.trips set companion = 'partial' where companion = 'mixed';
--   alter table public.trips add constraint trips_companion_check
--     check (companion in ('alone', 'with_family', 'partial'));
--
-- From the multi-route version without "qualifying_years":
--   alter table public.profiles add column if not exists qualifying_years numeric;
-- ────────────────────────────────────────────────────────────────────
