create type public.app_role as enum ('couple');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- First two accounts created become the couple
create or replace function public.grant_couple_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.user_roles where role = 'couple') < 2 then
    insert into public.user_roles(user_id, role) values (new.id, 'couple');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_couple after insert on auth.users
for each row execute function public.grant_couple_role();

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  phone text check (char_length(phone) <= 30),
  email text check (char_length(email) <= 255),
  attending boolean not null,
  guests int not null default 1 check (guests between 0 and 10),
  message text check (char_length(message) <= 1000),
  created_at timestamptz not null default now()
);
grant insert on public.rsvps to anon, authenticated;
grant select, delete on public.rsvps to authenticated;
grant all on public.rsvps to service_role;
alter table public.rsvps enable row level security;
create policy "anyone can rsvp" on public.rsvps for insert to anon, authenticated with check (true);
create policy "couple reads" on public.rsvps for select to authenticated using (public.has_role(auth.uid(), 'couple'));
create policy "couple deletes" on public.rsvps for delete to authenticated using (public.has_role(auth.uid(), 'couple'));