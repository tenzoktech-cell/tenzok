-- Add signup mobile numbers to public profiles.
-- Safe to run more than once in Supabase SQL Editor.

alter table public.profiles
  add column if not exists phone text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles
    (id, email, username, full_name, designation, role, phone, country, address)
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
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'address'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

update public.profiles as profile
set phone = users.raw_user_meta_data ->> 'phone'
from auth.users as users
where profile.id = users.id
  and profile.phone is null
  and users.raw_user_meta_data ->> 'phone' is not null;
