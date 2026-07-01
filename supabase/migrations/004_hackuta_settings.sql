-- HackUTA settings table
-- Stores a single row of configuration for the /hackuta public page.
-- Only admins can update this (RLS enforced).

create table if not exists hackuta_settings (
  id               integer primary key default 1,
  enabled          boolean  not null default true,
  year             integer  not null default 2026,
  date_display     text     not null default 'OCT 18–19, 2026',
  location         text     not null default 'UTA COLLEGE PARK CENTER',
  apps_open        boolean  not null default false,
  apps_url         text,
  updated_at       timestamptz not null default now(),
  updated_by       uuid references profiles(id),
  constraint single_row check (id = 1)
);

-- Seed with one row if empty
insert into hackuta_settings (id) values (1) on conflict do nothing;

-- Allow anyone to read (public page needs this)
alter table hackuta_settings enable row level security;

create policy "public read hackuta_settings"
  on hackuta_settings for select
  using (true);

create policy "admin update hackuta_settings"
  on hackuta_settings for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );
