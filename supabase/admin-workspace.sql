-- Tenzok admin workspace: enquiries, project updates, and delivery-file links.
-- Run this after dashboard.sql in the Supabase SQL editor.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  role text,
  service text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'qualified', 'closed')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_status_idx on public.enquiries (status, created_at desc);
alter table public.enquiries enable row level security;

drop policy if exists "Anyone can create enquiries" on public.enquiries;
create policy "Anyone can create enquiries" on public.enquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Admins manage enquiries" on public.enquiries
  for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  body text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists project_updates_project_idx on public.project_updates (project_id, created_at desc);
alter table public.project_updates enable row level security;

drop policy if exists "Project updates visible to owner or admin" on public.project_updates;
create policy "Project updates visible to owner or admin" on public.project_updates
  for select using (
    public.is_admin() or exists (
      select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()
    )
  );

drop policy if exists "Admins manage project updates" on public.project_updates;
create policy "Admins manage project updates" on public.project_updates
  for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  url text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists project_files_project_idx on public.project_files (project_id, created_at desc);
alter table public.project_files enable row level security;

drop policy if exists "Project files visible to owner or admin" on public.project_files;
create policy "Project files visible to owner or admin" on public.project_files
  for select using (
    public.is_admin() or exists (
      select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()
    )
  );

drop policy if exists "Admins manage project files" on public.project_files;
create policy "Admins manage project files" on public.project_files
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists touch_enquiries on public.enquiries;
create trigger touch_enquiries before update on public.enquiries
  for each row execute function public.touch_updated_at();