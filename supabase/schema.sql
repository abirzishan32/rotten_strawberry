-- ============================================================================
-- Rotten Strawberry — Supabase schema
-- ============================================================================
-- Run this whole file once in the Supabase dashboard:
--   Supabase → SQL Editor → New query → paste → Run.
-- It is idempotent-ish (safe to re-run): it uses IF NOT EXISTS / OR REPLACE and
-- drops+recreates policies. It never touches auth.users data.
--
-- Tables:
--   profiles   1:1 with auth.users (public-readable identity + bio)
--   reviews    diary/log entries (rating stars, review text, tags, privacy)
--   favorites  hearted movies (private to the owner)
--   watchlist  "want to watch" movies (private to the owner)
--
-- Security model: Row Level Security is ON for every table. The mobile app only
-- ever uses the anon/public key, so RLS is what actually protects your data —
-- a user can only read/write their own rows (plus everyone can read *public*
-- reviews and all profiles). The service_role key must NEVER ship in the app.
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique,
  display_name text,
  bio          text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- reviews (diary / log entries)
-- ----------------------------------------------------------------------------
-- user_id references public.profiles (not auth.users directly) so PostgREST can
-- embed the author profile into review queries (`select=*,author:profiles(...)`).
-- profiles.id itself references auth.users, and the signup trigger guarantees a
-- profile row exists before any review can be written.
create table if not exists public.reviews (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  movie_id         integer not null,
  movie_title      text not null,
  poster_path      text,
  genre_ids        integer[] not null default '{}',
  rating           numeric(3,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_text      text not null default '',
  watched          boolean not null default true,
  watched_date     timestamptz,
  liked            boolean not null default false,
  contains_spoilers boolean not null default false,
  tags             text[] not null default '{}',
  privacy          text not null default 'public' check (privacy in ('public', 'friends', 'private')),
  created_at       timestamptz not null default now()
);

create index if not exists reviews_user_id_idx  on public.reviews (user_id, created_at desc);
create index if not exists reviews_movie_id_idx on public.reviews (movie_id, created_at desc);

alter table public.reviews enable row level security;

-- Anyone may read PUBLIC reviews; owners always read their own (any privacy).
-- (There is no follow graph yet, so 'friends' behaves like 'private' for now.)
drop policy if exists "Public reviews are viewable by everyone" on public.reviews;
create policy "Public reviews are viewable by everyone"
  on public.reviews for select
  using (privacy = 'public' or auth.uid() = user_id);

drop policy if exists "Users can insert their own reviews" on public.reviews;
create policy "Users can insert their own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own reviews" on public.reviews;
create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own reviews" on public.reviews;
create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- favorites
-- ----------------------------------------------------------------------------
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  movie_id   integer not null,
  movie      jsonb not null,               -- cached TmdbMovieSummary for rendering
  created_at timestamptz not null default now(),
  unique (user_id, movie_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id, created_at desc);

alter table public.favorites enable row level security;

drop policy if exists "Users manage their own favorites" on public.favorites;
create policy "Users manage their own favorites"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- watchlist
-- ----------------------------------------------------------------------------
create table if not exists public.watchlist (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  movie_id   integer not null,
  movie      jsonb not null,               -- cached TmdbMovieSummary for rendering
  created_at timestamptz not null default now(),
  unique (user_id, movie_id)
);

create index if not exists watchlist_user_id_idx on public.watchlist (user_id, created_at desc);

alter table public.watchlist enable row level security;

drop policy if exists "Users manage their own watchlist" on public.watchlist;
create policy "Users manage their own watchlist"
  on public.watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up.
-- SECURITY DEFINER so it can write to public.profiles from the auth trigger.
-- Username is derived to be collision-proof so signup can never fail here.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1) || '-' || substr(md5(random()::text), 1, 4)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any users that already existed before this trigger was
-- installed (otherwise reviews.user_id -> profiles(id) would fail for them).
insert into public.profiles (id, username, display_name)
select
  u.id,
  split_part(u.email, '@', 1) || '-' || substr(md5(random()::text), 1, 4),
  split_part(u.email, '@', 1)
from auth.users u
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Keep profiles.updated_at fresh on update.
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
