create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  car text not null,
  pickup_location text not null,
  pickup_date date not null,
  return_date date not null,
  message text,
  status text not null default 'pending',
  source text not null default 'website',
  created_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reservations_return_after_pickup_check'
  ) then
    alter table public.reservations
      add constraint reservations_return_after_pickup_check
      check (return_date > pickup_date);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reservations_status_check'
  ) then
    alter table public.reservations
      add constraint reservations_status_check
      check (status in ('pending', 'confirmed', 'cancelled'));
  end if;
end $$;

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);

create index if not exists reservations_status_idx
  on public.reservations (status);

alter table public.reservations enable row level security;

create policy "No direct public access to reservations"
on public.reservations
for all
to public
using (false)
with check (false);
