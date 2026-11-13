-- Tenzok finance ledger: money received and money spent, admin-only.
-- Run this after dashboard.sql (it uses public.is_admin() and
-- public.touch_updated_at()) in the Supabase SQL editor.

create table if not exists public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  kind text not null check (kind in ('income', 'expense')),
  category text not null
    check (category in ('student_project', 'webinar', 'client', 'product', 'other')),
  title text not null check (char_length(title) between 1 and 140),
  amount numeric(12, 2) not null check (amount > 0 and amount < 10000000000),
  details text check (details is null or char_length(details) <= 2000),
  -- Nullable so removing a team member's account keeps the money history.
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists finance_entries_date_idx
  on public.finance_entries (entry_date desc, created_at desc);

-- Row level security: nobody but an admin can see or change a single row,
-- whatever the client sends. The app's own admin check is only a courtesy.
alter table public.finance_entries enable row level security;

drop policy if exists "Admins manage finance entries" on public.finance_entries;
create policy "Admins manage finance entries" on public.finance_entries
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists touch_finance_entries on public.finance_entries;
create trigger touch_finance_entries before update on public.finance_entries
  for each row execute function public.touch_updated_at();
