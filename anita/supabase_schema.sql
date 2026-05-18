-- ============================================================
-- ANITA — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES — extended user info (auto-created on signup)
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  avatar_url   text,
  streak       int  default 0,
  created_at   timestamptz default now()
);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. DECISIONS — every choice the user confirms
create table if not exists public.decisions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  scenario     text not null,          -- 'travel' | 'food' | 'shopping'
  option_id    text not null,          -- e.g. 't3'
  option_name  text not null,
  co2_chosen   numeric(6,3) not null,  -- kg CO₂ of chosen option
  co2_baseline numeric(6,3) not null,  -- kg CO₂ of worst option
  co2_saved    numeric(6,3) generated always as (co2_baseline - co2_chosen) stored,
  decided_at   timestamptz default now()
);

-- 3. DAILY_FOOTPRINT — aggregated per user per day (materialized by trigger)
create table if not exists public.daily_footprint (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade not null,
  date       date not null,
  travel_co2  numeric(6,3) default 3.2,
  food_co2    numeric(6,3) default 5.1,
  shopping_co2 numeric(6,3) default 2.8,
  total_co2   numeric(6,3) generated always as (travel_co2 + food_co2 + shopping_co2) stored,
  eco_score   int default 55,
  updated_at  timestamptz default now(),
  unique(user_id, date)
);

-- 4. LEADERBOARD VIEW — global eco scores for today
create or replace view public.leaderboard as
select
  p.display_name,
  df.eco_score,
  df.total_co2,
  df.date,
  row_number() over (partition by df.date order by df.eco_score desc) as rank
from public.daily_footprint df
join public.profiles p on p.id = df.user_id
where df.date = current_date
order by df.eco_score desc;

-- 5. ROW LEVEL SECURITY
alter table public.profiles       enable row level security;
alter table public.decisions      enable row level security;
alter table public.daily_footprint enable row level security;

-- Profiles: users can read/update their own
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Decisions: users can read/insert their own
create policy "decisions_select_own" on public.decisions for select using (auth.uid() = user_id);
create policy "decisions_insert_own" on public.decisions for insert with check (auth.uid() = user_id);

-- Daily footprint: users can read/upsert their own
create policy "footprint_select_own" on public.daily_footprint for select using (auth.uid() = user_id);
create policy "footprint_insert_own" on public.daily_footprint for insert with check (auth.uid() = user_id);
create policy "footprint_update_own" on public.daily_footprint for update using (auth.uid() = user_id);

-- Leaderboard: readable by all authenticated users
create policy "leaderboard_select_all" on public.daily_footprint
  for select using (true);
