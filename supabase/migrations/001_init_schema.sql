-- ============================================================
-- Migration 001: Initial Schema
-- Run this once in Supabase Dashboard → SQL Editor
-- ============================================================

-- ----------------------------------------------------------------
-- PROFILES table
-- Mirrors auth.users; one row per user. Created automatically
-- via trigger on signup. Holds display metadata for the app.
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  avatar_url   text,
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is
  'Public user profile data linked 1-1 to auth.users.';

-- ----------------------------------------------------------------
-- Trigger: auto-insert a profile row when a user signs up
-- ----------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer   -- runs with elevated rights to write to profiles
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;  -- idempotent in case of replays
  return new;
end;
$$;

-- Drop and re-create trigger to keep migration re-runnable
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ----------------------------------------------------------------
-- Row Level Security (RLS)
-- Users can only read and update their own profile row.
-- ----------------------------------------------------------------
alter table public.profiles enable row level security;

-- SELECT: own row only
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- UPDATE: own row only
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT is handled by the trigger with security definer,
-- so no INSERT policy is needed for regular users.
