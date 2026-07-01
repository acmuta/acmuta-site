-- News items table
-- Drives the "What's happening." section on the homepage.
-- Admins and directors can create/edit/delete items.
-- Only published items are visible to the public.

drop table if exists news_items;

create table news_items (
  id           uuid primary key default gen_random_uuid(),
  tag          text not null default '',
  title        text not null,
  blurb        text not null default '',
  link         text not null default '/',
  item_date    date not null default current_date,
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  created_by   uuid references profiles(id),
  updated_at   timestamptz not null default now()
);

-- Seed with current static items
insert into news_items (tag, title, blurb, link, item_date, sort_order) values
  ('Apply', 'Applications are open for fall dev teams',
   'Create and Research are taking applications. Pick a team, ship something real this semester.',
   '/committees', '2026-08-25', 1),
  ('HackUTA', 'HackUTA 2026 dates locked: Oct 18-19',
   'Our flagship hackathon returns to College Park Center. Hacker registration opens soon.',
   '/hackuta', '2026-08-20', 2),
  ('Educate', 'Mentor/mentee matching for fall is live',
   'New to CS? Get paired with someone who''s been through it. Sign-ups close the second week.',
   '/educate', '2026-08-18', 3),
  ('Org', 'We crossed 1,700 members',
   'ACM at UTA is now one of the largest tech orgs on campus. Thanks for building this with us.',
   '/about', '2026-08-10', 4);

-- RLS
alter table news_items enable row level security;

-- Public reads only published; admins and directors see all
create policy "read news"
  on news_items for select
  using (
    is_published = true
    or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
    or exists (select 1 from committee_roles where user_id = auth.uid() and role = 'director')
  );

-- Admins and directors can insert
create policy "insert news"
  on news_items for insert
  with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
    or exists (select 1 from committee_roles where user_id = auth.uid() and role = 'director')
  );

-- Admins and directors can update
create policy "update news"
  on news_items for update
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
    or exists (select 1 from committee_roles where user_id = auth.uid() and role = 'director')
  );

-- Admins and directors can delete
create policy "delete news"
  on news_items for delete
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
    or exists (select 1 from committee_roles where user_id = auth.uid() and role = 'director')
  );
