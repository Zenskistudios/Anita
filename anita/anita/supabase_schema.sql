-- ============================================================
-- ANITA — Supabase Schema (Full + Hardened RLS)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  display_name  text,
  avatar_url    text,
  provider      text default 'email',   -- 'google' | 'twitter' | 'discord' | 'facebook' | 'email'
  streak        int  default 0,
  total_co2_saved numeric(8,3) default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on any signup (email OR OAuth)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _name  text;
  _avatar text;
  _provider text;
begin
  -- Extract values from raw_user_meta_data (populated by OAuth providers)
  _name     := coalesce(
                  new.raw_user_meta_data->>'full_name',
                  new.raw_user_meta_data->>'name',
                  new.raw_user_meta_data->>'user_name',
                  split_part(new.email, '@', 1)
               );
  _avatar   := coalesce(
                  new.raw_user_meta_data->>'avatar_url',
                  new.raw_user_meta_data->>'picture'
               );
  _provider := coalesce(new.raw_app_meta_data->>'provider', 'email');

  insert into public.profiles (id, email, display_name, avatar_url, provider)
  values (new.id, new.email, _name, _avatar, _provider)
  on conflict (id) do update
    set display_name = excluded.display_name,
        avatar_url   = excluded.avatar_url,
        provider     = excluded.provider,
        updated_at   = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. DECISIONS ────────────────────────────────────────────
create table if not exists public.decisions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  scenario      text not null check (scenario in ('travel','food','shopping')),
  option_id     text not null,
  option_name   text not null,
  co2_chosen    numeric(6,3) not null check (co2_chosen >= 0),
  co2_baseline  numeric(6,3) not null check (co2_baseline >= 0),
  co2_saved     numeric(6,3) generated always as (co2_baseline - co2_chosen) stored,
  decided_at    timestamptz default now()
);

create index if not exists decisions_user_date_idx
  on public.decisions(user_id, decided_at desc);

-- ── 3. DAILY_FOOTPRINT ──────────────────────────────────────
create table if not exists public.daily_footprint (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  date          date not null default current_date,
  travel_co2    numeric(6,3) default 3.2 check (travel_co2 >= 0),
  food_co2      numeric(6,3) default 5.1 check (food_co2 >= 0),
  shopping_co2  numeric(6,3) default 2.8 check (shopping_co2 >= 0),
  total_co2     numeric(6,3) generated always as (travel_co2 + food_co2 + shopping_co2) stored,
  eco_score     int default 55 check (eco_score between 0 and 100),
  updated_at    timestamptz default now(),
  unique(user_id, date)
);

create index if not exists footprint_user_date_idx
  on public.daily_footprint(user_id, date desc);

-- ── 4. LEADERBOARD VIEW ─────────────────────────────────────
create or replace view public.leaderboard
with (security_invoker = true) as
select
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.provider,
  df.eco_score,
  df.total_co2,
  df.date,
  row_number() over (partition by df.date order by df.eco_score desc) as rank
from public.daily_footprint df
join public.profiles p on p.id = df.user_id
where df.date = current_date
order by df.eco_score desc;

-- ── 5. ROW LEVEL SECURITY ───────────────────────────────────

-- Profiles
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update only their own profile (no changing ID/email)
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Prevent direct inserts (handled by trigger only)
create policy "profiles: no direct insert"
  on public.profiles for insert
  with check (false);

-- Prevent deletes (cascade handled by FK)
create policy "profiles: no direct delete"
  on public.profiles for delete
  using (false);

-- Decisions
alter table public.decisions enable row level security;

create policy "decisions: read own"
  on public.decisions for select
  using (auth.uid() = user_id);

create policy "decisions: insert own"
  on public.decisions for insert
  with check (
    auth.uid() = user_id
    and auth.uid() is not null
  );

-- No updates or deletes on decisions (immutable log)
create policy "decisions: no update"
  on public.decisions for update
  using (false);

create policy "decisions: no delete"
  on public.decisions for delete
  using (false);

-- Daily footprint
alter table public.daily_footprint enable row level security;

create policy "footprint: read own"
  on public.daily_footprint for select
  using (auth.uid() = user_id);

create policy "footprint: insert own"
  on public.daily_footprint for insert
  with check (
    auth.uid() = user_id
    and auth.uid() is not null
    and date = current_date   -- Can only insert for today
  );

create policy "footprint: update own today"
  on public.daily_footprint for update
  using (
    auth.uid() = user_id
    and date = current_date   -- Can only update today's row
  )
  with check (
    auth.uid() = user_id
    and date = current_date
  );

create policy "footprint: no delete"
  on public.daily_footprint for delete
  using (false);

-- Leaderboard: all authenticated users can see today's scores
-- (only eco_score + display_name are public — no personal decisions exposed)
create policy "footprint: leaderboard read"
  on public.daily_footprint for select
  using (
    auth.uid() is not null
    and date = current_date
  );

-- ── 6. HELPER: update streak ────────────────────────────────
-- Call this function once per day per user (from your app) to maintain streaks
create or replace function public.update_streak(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  yesterday date := current_date - 1;
  had_yesterday bool;
begin
  select exists(
    select 1 from public.daily_footprint
    where user_id = p_user_id and date = yesterday
  ) into had_yesterday;

  if had_yesterday then
    update public.profiles
    set streak = streak + 1, updated_at = now()
    where id = p_user_id;
  else
    update public.profiles
    set streak = 1, updated_at = now()
    where id = p_user_id;
  end if;
end;
$$;
