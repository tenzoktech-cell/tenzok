-- Tenzok profile system, projects, and chat — run ONCE in the Supabase
-- dashboard: SQL Editor → New query → paste → Run.
--
-- Assumes profiles.sql has already been run (profiles table + signup trigger).
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE / DROP-then-CREATE.

-- ===========================================================================
-- 1. Extend profiles
-- ===========================================================================

alter table public.profiles
  add column if not exists username text,
  add column if not exists role text not null default 'student'
    check (role in ('student', 'company', 'freelancer', 'recruiter', 'admin')),
  add column if not exists avatar_url text,
  add column if not exists cover_url text,
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists bio text,
  add column if not exists skills text[] not null default '{}',
  add column if not exists website text,
  add column if not exists linkedin text,
  add column if not exists github text,
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro', 'enterprise')),
  add column if not exists plan_expires_at timestamptz,
  add column if not exists status text not null default 'active'
    check (status in ('active', 'suspended')),
  add column if not exists prefs jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

-- Backfill role + username for rows created before this migration.
update public.profiles
set role = case lower(coalesce(designation, '')) when 'company' then 'company' else 'student' end
where role = 'student' and lower(coalesce(designation, '')) = 'company';

update public.profiles
set username = split_part(email, '@', 1)
where username is null and email is not null;

-- Recreate the signup trigger so new users get username + role immediately.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles
    (id, email, username, full_name, designation, role, country, address)
  values (
    new.id,
    new.email,
    split_part(coalesce(new.email, ''), '@', 1),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'designation',
    case lower(coalesce(new.raw_user_meta_data ->> 'designation', ''))
      when 'company' then 'company'
      else 'student'
    end,
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'address'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ===========================================================================
-- 2. Role helpers (security definer: safe to call from RLS policies)
-- ===========================================================================

create or replace function public.my_role()
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'student');
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select public.my_role() = 'admin';
$$;

-- ===========================================================================
-- 3. Role-specific tables
-- ===========================================================================

create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  college text,
  university text,
  degree text,
  department text,
  semester text,
  graduation_year text,
  cgpa text,
  resume_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.company_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  organization_name text,
  industry text,
  website text,
  company_size text,
  description text,
  headquarters text,
  contact_number text,
  gst_number text,
  updated_at timestamptz not null default now()
);

alter table public.student_profiles enable row level security;
alter table public.company_profiles enable row level security;

drop policy if exists "student_profiles own or admin" on public.student_profiles;
create policy "student_profiles own or admin" on public.student_profiles
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "company_profiles own or admin" on public.company_profiles;
create policy "company_profiles own or admin" on public.company_profiles
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- ===========================================================================
-- 4. Projects
-- ===========================================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects (owner_id);

alter table public.projects enable row level security;

drop policy if exists "projects own or admin" on public.projects;
create policy "projects own or admin" on public.projects
  for all using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

-- ===========================================================================
-- 5. Chat: conversations, members, messages
-- ===========================================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  primary key (conversation_id, user_id)
);

create index if not exists conversation_members_user_idx on public.conversation_members (user_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at);

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

-- Membership check must be security definer: a plain RLS subquery on
-- conversation_members from its own policy recurses infinitely.
create or replace function public.is_conversation_member(conv uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.conversation_members
    where conversation_id = conv and user_id = auth.uid()
  );
$$;

drop policy if exists "conversations member or admin" on public.conversations;
create policy "conversations member or admin" on public.conversations
  for select using (public.is_conversation_member(id) or public.is_admin());

drop policy if exists "members visible to members or admin" on public.conversation_members;
create policy "members visible to members or admin" on public.conversation_members
  for select using (public.is_conversation_member(conversation_id) or public.is_admin());

drop policy if exists "messages member or admin" on public.messages;
create policy "messages member or admin" on public.messages
  for select using (public.is_conversation_member(conversation_id) or public.is_admin());

drop policy if exists "messages insert by members" on public.messages;
create policy "messages insert by members" on public.messages
  for insert with check (
    sender_id = auth.uid() and public.is_conversation_member(conversation_id)
  );

drop policy if exists "messages delete by sender or admin" on public.messages;
create policy "messages delete by sender or admin" on public.messages
  for delete using (sender_id = auth.uid() or public.is_admin());

-- Conversations and membership rows are created ONLY through the RPC below
-- (security definer), so no direct insert policies are needed.

-- ===========================================================================
-- 6. Chat RPCs — the messaging rules live HERE, in the database, so no
--    client bug can route a student to anyone but the admin.
-- ===========================================================================

-- Who may talk to whom:
--   student           → admin only
--   freelancer        → admin only
--   company/recruiter → admin, companies, recruiters
--   admin             → anyone
create or replace function public.can_message(target uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  me text := public.my_role();
  them text := (select role from public.profiles where id = target);
begin
  if them is null or target = auth.uid() then return false; end if;
  if me = 'admin' then return true; end if;
  if them = 'admin' then return true; end if;
  if me in ('company', 'recruiter') and them in ('company', 'recruiter') then
    return true;
  end if;
  return false;
end;
$$;

-- Find or create the 1:1 conversation with `target`. Pass null to reach the
-- admin (what the student UI does).
create or replace function public.start_conversation_with(target uuid default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  other uuid := target;
  conv uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;

  if other is null then
    select id into other from public.profiles where role = 'admin'
      order by created_at limit 1;
    if other is null then raise exception 'No admin account exists yet'; end if;
  end if;

  if not public.can_message(other) then
    raise exception 'You cannot start a conversation with this user';
  end if;

  select m1.conversation_id into conv
  from public.conversation_members m1
  join public.conversation_members m2
    on m2.conversation_id = m1.conversation_id and m2.user_id = other
  where m1.user_id = auth.uid()
  limit 1;

  if conv is null then
    insert into public.conversations default values returning id into conv;
    insert into public.conversation_members (conversation_id, user_id)
      values (conv, auth.uid()), (conv, other);
  end if;

  return conv;
end;
$$;

-- Contacts the caller is allowed to message, with only chat-safe columns.
create or replace function public.search_contacts(q text default '')
returns table (id uuid, username text, full_name text, role text, avatar_url text)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.username, p.full_name, p.role, p.avatar_url
  from public.profiles p
  where p.id <> auth.uid()
    and public.can_message(p.id)
    and (
      q = ''
      or p.username ilike '%' || q || '%'
      or p.full_name ilike '%' || q || '%'
    )
  order by p.full_name nulls last
  limit 20;
$$;

-- Everything the chat sidebar needs in one call: each conversation with the
-- counterparty's public details, the latest message, and the unread count.
create or replace function public.my_conversations()
returns table (
  conversation_id uuid,
  other_id uuid,
  other_name text,
  other_role text,
  other_avatar text,
  last_message text,
  last_at timestamptz,
  unread bigint
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    c.id,
    p.id,
    coalesce(p.full_name, p.username, p.email),
    p.role,
    p.avatar_url,
    lm.message,
    lm.created_at,
    (
      select count(*) from public.messages m
      where m.conversation_id = c.id
        and m.sender_id <> auth.uid()
        and m.is_read = false
    )
  from public.conversations c
  join public.conversation_members me
    on me.conversation_id = c.id and me.user_id = auth.uid()
  join public.conversation_members other
    on other.conversation_id = c.id and other.user_id <> auth.uid()
  join public.profiles p on p.id = other.user_id
  left join lateral (
    select message, created_at from public.messages m
    where m.conversation_id = c.id
    order by created_at desc limit 1
  ) lm on true
  order by coalesce(lm.created_at, c.created_at) desc;
$$;

-- Mark everything the OTHER side sent in this conversation as read.
create or replace function public.mark_conversation_read(conv uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.messages
  set is_read = true
  where conversation_id = conv
    and sender_id <> auth.uid()
    and is_read = false
    and public.is_conversation_member(conv);
$$;

-- Total unread across all conversations — powers the badge on the chat button.
create or replace function public.unread_count()
returns bigint
language sql
security definer
set search_path = ''
stable
as $$
  select count(*)
  from public.messages m
  where m.is_read = false
    and m.sender_id <> auth.uid()
    and public.is_conversation_member(m.conversation_id);
$$;

-- ===========================================================================
-- 7. Realtime: stream new messages to connected clients
-- ===========================================================================

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;

-- ===========================================================================
-- 8. Storage: avatars, covers, and resumes
-- ===========================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('resumes', 'resumes', true)
on conflict (id) do nothing;

drop policy if exists "storage read public buckets" on storage.objects;
create policy "storage read public buckets" on storage.objects
  for select using (bucket_id in ('avatars', 'resumes'));

-- Uploads go to a folder named after the user's id: <uid>/<filename>.
drop policy if exists "storage write own folder" on storage.objects;
create policy "storage write own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('avatars', 'resumes')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage update own folder" on storage.objects;
create policy "storage update own folder" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('avatars', 'resumes')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage delete own folder" on storage.objects;
create policy "storage delete own folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('avatars', 'resumes')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ===========================================================================
-- 9. updated_at housekeeping
-- ===========================================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles on public.profiles;
create trigger touch_profiles before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_projects on public.projects;
create trigger touch_projects before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_student_profiles on public.student_profiles;
create trigger touch_student_profiles before update on public.student_profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_company_profiles on public.company_profiles;
create trigger touch_company_profiles before update on public.company_profiles
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 10. Profiles RLS refresh: own row, chat counterparties (via functions
--     above), and full admin visibility.
-- ===========================================================================

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using ((select auth.uid()) = id or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using ((select auth.uid()) = id or public.is_admin());

-- ===========================================================================
-- AFTER the admin account exists (via scripts/seed-admin.mjs or a normal
-- signup with the admin email), promote it by running:
--
--   update public.profiles set role = 'admin' where email = 'info@tenzok.in';
-- ===========================================================================
