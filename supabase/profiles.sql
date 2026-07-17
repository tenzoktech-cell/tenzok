-- Run this ONCE in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Signup stores name / designation / country / address in
-- auth.users.raw_user_meta_data. That data is real but lives inside the auth
-- schema; this script gives it a proper table. The trigger copies every new
-- signup into public.profiles automatically — no app code involved.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  designation text, -- "Student" | "Company"
  country text,
  address text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can see and edit their own row; nobody else's. The dashboard and the
-- service-role key bypass RLS, so you can always see everything.
create policy "Users can view own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, designation, country, address)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'designation',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'address'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: copy any users who signed up before this script ran.
insert into public.profiles (id, email, full_name, designation, country, address)
select
  id,
  email,
  raw_user_meta_data ->> 'full_name',
  raw_user_meta_data ->> 'designation',
  raw_user_meta_data ->> 'country',
  raw_user_meta_data ->> 'address'
from auth.users
on conflict (id) do nothing;
