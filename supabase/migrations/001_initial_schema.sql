-- ============================================================================
-- ACM UTA Platform - Full Schema (squashed)
-- Migration: 001_initial_schema.sql
--
-- Sections:
--   1. Extensions
--   2. Enum types
--   3. Core tables (in FK dependency order)
--   4. Site-content tables (committees, news, sponsors, projects, albums)
--   5. Indexes
--   6. Helper functions (security definer)
--   7. Triggers (domain restriction + profile auto-create)
--   8. RPC functions (check-in, admin actions, leaderboard, notifications)
--   9. Notification triggers
--  10. Row-Level Security policies
-- ============================================================================


-- ─── 1. EXTENSIONS ───────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";


-- ─── 2. ENUM TYPES ───────────────────────────────────────────────────────────
create type public.committee_role     as enum ('member', 'officer', 'director');
create type public.application_type   as enum ('member', 'officer', 'mentor', 'mentee');
create type public.application_status as enum ('pending', 'interview', 'accepted', 'declined');
create type public.term_type          as enum ('semester', 'year');
create type public.point_source       as enum ('attendance', 'manual', 'bonus');


-- ─── 3. CORE TABLES ──────────────────────────────────────────────────────────

-- Allowlist for non-@mavs.uta.edu emails (e.g. graduating officers/maintainers)
create table public.admin_allowlist (
  email      text        primary key,
  note       text,
  added_by   uuid        references auth.users(id),
  created_at timestamptz not null default now()
);

-- One row per Supabase auth user; mirrors auth.users.id
create table public.profiles (
  id               uuid        primary key references auth.users(id) on delete cascade,
  email            text        not null unique,
  secondary_email  text,
  full_name        text        not null,
  display_name     text,
  major            text,
  grad_year        int,
  classification   text,
  pronouns         text,
  is_admin         boolean     not null default false,
  is_alumni        boolean     not null default false,
  discord_joined   boolean     not null default false,
  instagram_joined boolean     not null default false,
  onboarded        boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.committees (
  id                          uuid        primary key default gen_random_uuid(),
  name                        text        not null unique,
  slug                        text        not null unique,
  tag                         text,
  summary                     text,
  description                 text,
  doing                       text[]      not null default '{}',
  involve                     text,
  logo_url                    text,
  accepts_member_applications boolean     not null default false,
  has_teams                   boolean     not null default false,
  has_mentorship_program      boolean     not null default false,
  sort_order                  int         not null default 0,
  created_at                  timestamptz not null default now()
);

create table public.committee_roles (
  id           uuid                  primary key default gen_random_uuid(),
  user_id      uuid                  not null references public.profiles(id)    on delete cascade,
  committee_id uuid                  not null references public.committees(id)  on delete cascade,
  role         public.committee_role not null,
  assigned_by  uuid                  references public.profiles(id),
  assigned_at  timestamptz           not null default now(),
  unique (user_id, committee_id)
);

-- Terms: each semester and its parent year term
create table public.terms (
  id                  uuid             primary key default gen_random_uuid(),
  name                text             not null,
  type                public.term_type not null,
  start_date          date             not null,
  end_date            date             not null,
  is_active           boolean          not null default false,
  parent_year_term_id uuid             references public.terms(id),
  created_by          uuid             references public.profiles(id),
  created_at          timestamptz      not null default now()
);

create table public.event_categories (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null unique,
  -- bit_value drives the points system: max wins when an event has multiple categories
  bit_value   int         not null,
  description text,
  created_at  timestamptz not null default now()
);

create table public.events (
  id                  uuid        primary key default gen_random_uuid(),
  title               text        not null,
  description         text,
  committee_id        uuid        references public.committees(id),
  location            text,
  start_time          timestamptz not null,
  end_time            timestamptz not null,
  google_photos_url   text,
  recurrence_group_id uuid,
  -- qr_token is the secret used for check-in; rotated per event, expires at qr_expires_at
  qr_token            text        not null unique default encode(gen_random_bytes(16), 'hex'),
  qr_expires_at       timestamptz not null,
  created_by          uuid        references public.profiles(id),
  created_at          timestamptz not null default now()
);

create table public.event_category_assignments (
  event_id    uuid not null references public.events(id)           on delete cascade,
  category_id uuid not null references public.event_categories(id) on delete cascade,
  primary key (event_id, category_id)
);

create table public.attendance (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles(id) on delete cascade,
  event_id      uuid        not null references public.events(id)   on delete cascade,
  committee_id  uuid        references public.committees(id),
  bits_awarded  int         not null,
  checked_in_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table public.point_transactions (
  id                   uuid                primary key default gen_random_uuid(),
  user_id              uuid                not null references public.profiles(id)    on delete cascade,
  amount               int                 not null,
  reason               text                not null,
  source_type          public.point_source not null,
  source_attendance_id uuid                references public.attendance(id)           on delete set null,
  committee_id         uuid                references public.committees(id),
  semester_term_id     uuid                references public.terms(id),
  created_by           uuid                references public.profiles(id),
  created_at           timestamptz         not null default now()
);

create table public.application_forms (
  id               uuid                      primary key default gen_random_uuid(),
  committee_id     uuid                      not null references public.committees(id) on delete cascade,
  application_type public.application_type   not null,
  form_url         text                      not null,
  sheet_id         text                      not null,
  is_open          boolean                   not null default true,
  created_at       timestamptz               not null default now(),
  unique (committee_id, application_type)
);

create table public.applications (
  id                      uuid                        primary key default gen_random_uuid(),
  user_id                 uuid                        references public.profiles(id),
  committee_id            uuid                        not null references public.committees(id),
  application_type        public.application_type     not null,
  google_form_response_id text,
  raw_responses           jsonb                       not null default '{}',
  status                  public.application_status   not null default 'pending',
  reviewer_notes          text,
  reviewed_by             uuid                        references public.profiles(id),
  term_id                 uuid                        references public.terms(id),
  submitted_at            timestamptz,
  updated_at              timestamptz                 not null default now()
);

create table public.teams (
  id           uuid        primary key default gen_random_uuid(),
  committee_id uuid        not null references public.committees(id) on delete cascade,
  name         text        not null,
  lead_user_id uuid        references public.profiles(id),
  created_by   uuid        references public.profiles(id),
  created_at   timestamptz not null default now()
);

create table public.team_memberships (
  id        uuid        primary key default gen_random_uuid(),
  team_id   uuid        not null references public.teams(id)    on delete cascade,
  user_id   uuid        not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table public.mentor_mentee_pairings (
  id             uuid        primary key default gen_random_uuid(),
  mentor_user_id uuid        not null references public.profiles(id) on delete cascade,
  mentee_user_id uuid        not null references public.profiles(id) on delete cascade,
  term_id        uuid        references public.terms(id),
  paired_by      uuid        references public.profiles(id),
  created_at     timestamptz not null default now(),
  unique (mentor_user_id, mentee_user_id)
);

create table public.notifications (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  type       text        not null,
  title      text        not null,
  body       text,
  link       text,
  is_read    boolean     not null default false,
  email_sent boolean     not null default false,
  created_at timestamptz not null default now()
);

-- photo_count is a stored integer, not a live count, because the photos live in Google Photos
create table public.photo_albums (
  id                uuid        primary key default gen_random_uuid(),
  title             text        not null,
  event_id          uuid        references public.events(id),
  album_date        date,
  google_photos_url text        not null,
  cover_image_url   text,
  photo_count       int         not null default 0,
  created_by        uuid        references public.profiles(id),
  created_at        timestamptz not null default now()
);

create table public.audit_log (
  id            uuid        primary key default gen_random_uuid(),
  actor_user_id uuid        references public.profiles(id),
  action        text        not null,
  entity_type   text,
  entity_id     uuid,
  metadata      jsonb       not null default '{}',
  created_at    timestamptz not null default now()
);


-- ─── 4. SITE-CONTENT TABLES ──────────────────────────────────────────────────
-- These are not in the core spec but are required by the public pages.
-- Admin-managed via the dashboard; public read.

create table public.news_items (
  id             uuid        primary key default gen_random_uuid(),
  title          text        not null,
  published_date date        not null,
  blurb          text,
  link           text,
  tag            text,
  is_published   boolean     not null default true,
  created_at     timestamptz not null default now()
);

create table public.sponsors (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  logo_url    text,
  tier        text        not null,   -- 'platinum', 'gold', 'silver', 'bronze'
  website_url text,
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

create table public.projects (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  image_url    text,
  summary      text,
  website_url  text,
  code_url     text,
  committee_id uuid        references public.committees(id),
  year         text,
  featured     boolean     not null default false,
  is_published boolean     not null default true,
  sort_order   int         not null default 0,
  created_at   timestamptz not null default now()
);


-- ─── 5. INDEXES ──────────────────────────────────────────────────────────────
create index on public.profiles          (email);
create index on public.committee_roles   (user_id);
create index on public.committee_roles   (committee_id);
create index on public.events            (start_time);
create index on public.events            (committee_id);
create index on public.events            (qr_token);
create index on public.attendance        (user_id);
create index on public.attendance        (event_id);
create index on public.attendance        (committee_id);
create index on public.point_transactions(user_id);
create index on public.point_transactions(semester_term_id);
create index on public.point_transactions(committee_id);
create index on public.applications      (user_id);
create index on public.applications      (committee_id);
create index on public.applications      (status);
create index on public.notifications     (user_id);
create index on public.notifications     (is_read);
create index on public.photo_albums      (album_date desc);


-- ─── 6. HELPER FUNCTIONS (SECURITY DEFINER) ──────────────────────────────────
-- These run with definer privileges to avoid recursive RLS calls.
-- set search_path = '' prevents search-path injection attacks.

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.directed_committees()
returns setof uuid
language sql
security definer
stable
set search_path = ''
as $$
  select committee_id
  from public.committee_roles
  where user_id = auth.uid() and role = 'director';
$$;

create or replace function public.directs(c_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.committee_roles
    where user_id      = auth.uid()
      and committee_id = c_id
      and role         = 'director'
  );
$$;


-- ─── 7. TRIGGERS ─────────────────────────────────────────────────────────────

-- Domain-restriction + profile auto-create on new signup.
-- RAISING an exception here rolls back the auth.users INSERT entirely,
-- so a rejected signup never lands in the database.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Only @mavs.uta.edu OR an explicitly allowed address may sign up
  if not (
    new.email ilike '%@mavs.uta.edu'
    or exists (
      select 1 from public.admin_allowlist
      where lower(email) = lower(new.email)
    )
  ) then
    raise exception 'Signup is restricted to @mavs.uta.edu email addresses.';
  end if;

  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.updated_at current
create or replace function public.handle_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_profile_updated_at();


-- ─── 8. RPC FUNCTIONS ────────────────────────────────────────────────────────

-- Member check-in via QR token. Runs security definer so it can bypass RLS
-- for the atomic attendance + point_transaction insert.
--   supabase.rpc('check_in', { p_qr_token: '<token>' })
create or replace function public.check_in(p_qr_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event  public.events;
  v_uid    uuid := auth.uid();
  v_bits   int;
  v_term   uuid;
  v_att_id uuid;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  select * into v_event
  from public.events
  where qr_token = p_qr_token;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_token');
  end if;

  if now() > v_event.qr_expires_at then
    return jsonb_build_object('ok', false, 'error', 'qr_expired');
  end if;

  if exists (
    select 1 from public.attendance
    where user_id = v_uid and event_id = v_event.id
  ) then
    return jsonb_build_object('ok', false, 'error', 'already_checked_in');
  end if;

  -- Highest bit_value across all categories assigned to this event
  select coalesce(max(ec.bit_value), 0) into v_bits
  from public.event_category_assignments eca
  join public.event_categories ec on ec.id = eca.category_id
  where eca.event_id = v_event.id;

  -- Active semester term for the point snapshot
  select id into v_term
  from public.terms
  where type = 'semester' and is_active = true
  limit 1;

  insert into public.attendance (user_id, event_id, committee_id, bits_awarded)
  values (v_uid, v_event.id, v_event.committee_id, v_bits)
  returning id into v_att_id;

  insert into public.point_transactions (
    user_id, amount, reason, source_type,
    source_attendance_id, committee_id, semester_term_id
  )
  values (
    v_uid,
    v_bits,
    'Check-in: ' || v_event.title,
    'attendance',
    v_att_id,
    v_event.committee_id,
    v_term
  );

  return jsonb_build_object(
    'ok',          true,
    'bits_awarded', v_bits,
    'event_title',  v_event.title
  );
end;
$$;

-- Manual attendance check-in for admins/directors.
-- Mirrors check_in(), but is keyed on an explicit p_user_id (not auth.uid())
-- and skips the QR-token/expiry checks since this is an explicit override by
-- an admin or the directing committee's director.
create or replace function public.admin_check_in(p_event_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event  public.events;
  v_bits   int;
  v_term   uuid;
  v_att_id uuid;
begin
  select * into v_event
  from public.events
  where id = p_event_id;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_token');
  end if;

  if not (public.is_admin() or public.directs(v_event.committee_id)) then
    raise exception 'Not authorized to check in members for this event.';
  end if;

  if exists (
    select 1 from public.attendance
    where user_id = p_user_id and event_id = v_event.id
  ) then
    return jsonb_build_object('ok', false, 'error', 'already_checked_in');
  end if;

  select coalesce(max(ec.bit_value), 0) into v_bits
  from public.event_category_assignments eca
  join public.event_categories ec on ec.id = eca.category_id
  where eca.event_id = v_event.id;

  select id into v_term
  from public.terms
  where type = 'semester' and is_active = true
  limit 1;

  insert into public.attendance (user_id, event_id, committee_id, bits_awarded)
  values (p_user_id, v_event.id, v_event.committee_id, v_bits)
  returning id into v_att_id;

  insert into public.point_transactions (
    user_id, amount, reason, source_type,
    source_attendance_id, committee_id, semester_term_id
  )
  values (
    p_user_id,
    v_bits,
    'Check-in: ' || v_event.title,
    'attendance',
    v_att_id,
    v_event.committee_id,
    v_term
  );

  return jsonb_build_object(
    'ok',          true,
    'bits_awarded', v_bits,
    'event_title',  v_event.title
  );
end;
$$;

-- audit_log is admin-read-only with no insert policy, so the only way to
-- write to it is through this security-definer function. It stamps
-- actor_user_id from auth.uid() itself (the caller can't spoof it) and is
-- restricted to admins and committee directors - the same set of users who
-- can perform the admin actions being logged.
create or replace function public.log_admin_action(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_metadata jsonb default '{}'
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (
    public.is_admin()
    or exists (
      select 1 from public.committee_roles
      where user_id = auth.uid() and role = 'director'
    )
  ) then
    raise exception 'Not authorized to log admin actions';
  end if;

  insert into public.audit_log (actor_user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, p_metadata);
end;
$$;

-- Leaderboard: point_transactions is locked down to self/admin/director via
-- RLS, so this security-definer aggregate exposes only what's needed for a
-- public ranking (name + total bits), nothing per-transaction.
create or replace function public.get_leaderboard(p_term_id uuid default null)
returns table (user_id uuid, full_name text, total_points bigint, rank bigint)
language sql
security definer
stable
set search_path = ''
as $$
  select
    p.id,
    p.full_name,
    coalesce(sum(pt.amount), 0) as total_points,
    rank() over (order by coalesce(sum(pt.amount), 0) desc)
  from public.profiles p
  left join public.point_transactions pt
    on pt.user_id = p.id
    and (p_term_id is null or pt.semester_term_id = p_term_id)
  where p.is_alumni = false
  group by p.id, p.full_name
  having coalesce(sum(pt.amount), 0) > 0
  order by total_points desc, p.full_name asc
  limit 100;
$$;

-- Notifications: notifications has no insert policy at all (owner can only
-- read/update), so the only legal write path is this function and the
-- security-definer triggers below.
create or replace function public.notify_user(
  p_user_id uuid,
  p_type    text,
  p_title   text,
  p_body    text default null,
  p_link    text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (user_id, type, title, body, link)
  values (p_user_id, p_type, p_title, p_body, p_link);
end;
$$;


-- ─── 9. NOTIFICATION TRIGGERS ────────────────────────────────────────────────

-- Application reviewed: notify the applicant when status changes
create or replace function public.trg_application_status_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_committee text;
begin
  if new.status is distinct from old.status and new.status in ('accepted', 'declined', 'interview') then
    select name into v_committee from public.committees where id = new.committee_id;

    perform public.notify_user(
      new.user_id,
      'application_status',
      case new.status
        when 'accepted'  then 'Application accepted'
        when 'declined'  then 'Application update'
        else 'Interview requested'
      end,
      case new.status
        when 'accepted'  then 'Your ' || coalesce(v_committee, 'committee') || ' application was accepted. Welcome aboard!'
        when 'declined'  then 'Your ' || coalesce(v_committee, 'committee') || ' application was not selected this cycle.'
        else 'You''ve been invited to interview for ' || coalesce(v_committee, 'a committee') || '.'
      end,
      '/profile'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists application_status_notify on public.applications;
create trigger application_status_notify
  after update on public.applications
  for each row execute function public.trg_application_status_notify();

-- Points awarded: notify the member who earned them
create or replace function public.trg_points_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.amount > 0 then
    perform public.notify_user(
      new.user_id,
      'points_awarded',
      'You earned ' || new.amount || ' bits',
      new.reason,
      '/profile'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists point_transaction_notify on public.point_transactions;
create trigger point_transaction_notify
  after insert on public.point_transactions
  for each row execute function public.trg_points_notify();

-- Mentor/mentee pairing: notify both sides
create or replace function public.trg_pairing_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_mentor_name text;
  v_mentee_name text;
begin
  select full_name into v_mentor_name from public.profiles where id = new.mentor_user_id;
  select full_name into v_mentee_name from public.profiles where id = new.mentee_user_id;

  perform public.notify_user(
    new.mentor_user_id,
    'mentorship_pairing',
    'New mentee paired',
    'You''ve been paired with ' || coalesce(v_mentee_name, 'a mentee') || '.',
    '/profile'
  );
  perform public.notify_user(
    new.mentee_user_id,
    'mentorship_pairing',
    'Mentor assigned',
    'You''ve been paired with ' || coalesce(v_mentor_name, 'a mentor') || '.',
    '/profile'
  );
  return new;
end;
$$;

drop trigger if exists mentorship_pairing_notify on public.mentor_mentee_pairings;
create trigger mentorship_pairing_notify
  after insert on public.mentor_mentee_pairings
  for each row execute function public.trg_pairing_notify();

-- New application submitted: notify org admins and the committee's directors
create or replace function public.trg_application_submitted_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_committee text;
  v_applicant text;
  v_recipient record;
begin
  select name into v_committee from public.committees where id = new.committee_id;
  select full_name into v_applicant from public.profiles where id = new.user_id;

  for v_recipient in
    select id from public.profiles where is_admin = true
    union
    select user_id as id from public.committee_roles
    where committee_id = new.committee_id and role = 'director'
  loop
    perform public.notify_user(
      v_recipient.id,
      'new_application',
      'New application',
      coalesce(v_applicant, 'Someone') || ' applied to ' || coalesce(v_committee, 'a committee'),
      '/admin/applications'
    );
  end loop;

  return new;
end;
$$;

drop trigger if exists application_submitted_notify on public.applications;
create trigger application_submitted_notify
  after insert on public.applications
  for each row execute function public.trg_application_submitted_notify();


-- ─── 10. ROW-LEVEL SECURITY ──────────────────────────────────────────────────
-- Rule: security lives in the database.
-- Public pages (committees, events, albums, news, sponsors, projects) allow
-- anon reads (using (true)) so the site works without a login.
-- Personal/scoped data is protected by explicit auth.uid() checks.

-- admin_allowlist - admin read/write only
alter table public.admin_allowlist enable row level security;
create policy "admin_allowlist_admin_all" on public.admin_allowlist
  using (public.is_admin())
  with check (public.is_admin());

-- profiles
alter table public.profiles enable row level security;
-- Self read + admin
create policy "profiles_read_self_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
-- Directors can see profiles of members in their committees
create policy "profiles_read_directed_members" on public.profiles
  for select using (
    exists (
      select 1 from public.committee_roles cr
      where cr.user_id      = public.profiles.id
        and cr.committee_id in (select public.directed_committees())
    )
  );
-- Directors can see profiles of applicants to committees they direct
create policy "profiles_read_directed_applicants" on public.profiles
  for select using (
    exists (
      select 1 from public.applications a
      where a.user_id = public.profiles.id
        and a.committee_id in (select public.directed_committees())
    )
  );
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());

-- committees - public read, admin write
alter table public.committees enable row level security;
create policy "committees_public_read" on public.committees
  for select using (true);
create policy "committees_admin_all" on public.committees
  using (public.is_admin()) with check (public.is_admin());

-- committee_roles
alter table public.committee_roles enable row level security;
create policy "committee_roles_read_self_or_admin" on public.committee_roles
  for select using (user_id = auth.uid() or public.is_admin());
create policy "committee_roles_read_directed" on public.committee_roles
  for select using (committee_id in (select public.directed_committees()));
create policy "committee_roles_admin_all" on public.committee_roles
  using (public.is_admin()) with check (public.is_admin());
-- Directors may grant officer (not director) roles within their own committee
create policy "committee_roles_director_grant_officer" on public.committee_roles
  for insert with check (
    public.directs(committee_id) and role = 'officer'
  );

-- terms - public read, admin write
alter table public.terms enable row level security;
create policy "terms_public_read" on public.terms
  for select using (true);
create policy "terms_admin_all" on public.terms
  using (public.is_admin()) with check (public.is_admin());

-- event_categories - public read, admin write
alter table public.event_categories enable row level security;
create policy "event_categories_public_read" on public.event_categories
  for select using (true);
create policy "event_categories_admin_all" on public.event_categories
  using (public.is_admin()) with check (public.is_admin());

-- events - public read; admin all; director write for their committee
alter table public.events enable row level security;
create policy "events_public_read" on public.events
  for select using (true);
create policy "events_admin_all" on public.events
  using (public.is_admin()) with check (public.is_admin());
create policy "events_director_insert" on public.events
  for insert with check (public.directs(committee_id));
create policy "events_director_update" on public.events
  for update using (public.directs(committee_id));
create policy "events_director_delete" on public.events
  for delete using (public.directs(committee_id));

-- event_category_assignments - public read; admin + director write
alter table public.event_category_assignments enable row level security;
create policy "eca_public_read" on public.event_category_assignments
  for select using (true);
create policy "eca_admin_all" on public.event_category_assignments
  using (public.is_admin()) with check (public.is_admin());
create policy "eca_director_insert" on public.event_category_assignments
  for insert with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and public.directs(e.committee_id)
    )
  );

-- attendance - self + admin + director; no direct inserts (check_in RPCs only)
alter table public.attendance enable row level security;
create policy "attendance_read_self_or_admin" on public.attendance
  for select using (user_id = auth.uid() or public.is_admin());
create policy "attendance_read_directed" on public.attendance
  for select using (committee_id in (select public.directed_committees()));

-- point_transactions - self + admin + director; manual inserts admin only
alter table public.point_transactions enable row level security;
create policy "points_read_self_or_admin" on public.point_transactions
  for select using (user_id = auth.uid() or public.is_admin());
create policy "points_read_directed" on public.point_transactions
  for select using (committee_id in (select public.directed_committees()));
create policy "points_admin_manual_insert" on public.point_transactions
  for insert with check (public.is_admin() and source_type = 'manual');

-- application_forms - public read; admin all; director own committee (incl. is_open toggle)
alter table public.application_forms enable row level security;
create policy "appforms_public_read" on public.application_forms
  for select using (true);
create policy "appforms_admin_all" on public.application_forms
  using (public.is_admin()) with check (public.is_admin());
create policy "appforms_director_read" on public.application_forms
  for select using (committee_id in (select public.directed_committees()));
create policy "appforms_director_update" on public.application_forms
  for update
  using (committee_id in (select public.directed_committees()))
  with check (committee_id in (select public.directed_committees()));

-- applications - self + admin + director in that committee
alter table public.applications enable row level security;
create policy "apps_read_self_or_admin" on public.applications
  for select using (user_id = auth.uid() or public.is_admin());
create policy "apps_read_directed" on public.applications
  for select using (committee_id in (select public.directed_committees()));
create policy "apps_insert_self" on public.applications
  for insert with check (user_id = auth.uid());
create policy "apps_update_reviewer" on public.applications
  for update using (
    public.is_admin() or committee_id in (select public.directed_committees())
  );
create policy "apps_delete_admin" on public.applications
  for delete using (public.is_admin());
create policy "apps_delete_director" on public.applications
  for delete using (committee_id in (select public.directed_committees()));

-- teams - authenticated read; admin all; director their committee
alter table public.teams enable row level security;
create policy "teams_auth_read" on public.teams
  for select using (auth.role() = 'authenticated');
create policy "teams_admin_all" on public.teams
  using (public.is_admin()) with check (public.is_admin());
create policy "teams_director_all" on public.teams
  using (public.directs(committee_id)) with check (public.directs(committee_id));

-- team_memberships - authenticated read; admin all; director their committee
alter table public.team_memberships enable row level security;
create policy "team_memberships_auth_read" on public.team_memberships
  for select using (auth.role() = 'authenticated');
create policy "team_memberships_admin_all" on public.team_memberships
  using (public.is_admin()) with check (public.is_admin());
create policy "team_memberships_director_insert" on public.team_memberships
  for insert with check (
    exists (
      select 1 from public.teams t
      where t.id = team_id and public.directs(t.committee_id)
    )
  );

-- mentor_mentee_pairings - involved users + Educate director + admin
alter table public.mentor_mentee_pairings enable row level security;
create policy "mentoring_read_self_or_admin" on public.mentor_mentee_pairings
  for select using (
    mentor_user_id = auth.uid()
    or mentee_user_id = auth.uid()
    or public.is_admin()
  );
create policy "mentoring_read_educate_director" on public.mentor_mentee_pairings
  for select using (
    exists (
      select 1 from public.committees c
      where c.slug = 'educate' and public.directs(c.id)
    )
  );
create policy "mentoring_admin_all" on public.mentor_mentee_pairings
  using (public.is_admin()) with check (public.is_admin());
create policy "mentoring_educate_director_insert" on public.mentor_mentee_pairings
  for insert with check (
    exists (
      select 1 from public.committees c
      where c.slug = 'educate' and public.directs(c.id)
    )
  );

-- notifications - owner only
alter table public.notifications enable row level security;
create policy "notifications_read_self" on public.notifications
  for select using (user_id = auth.uid());
create policy "notifications_update_self" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- photo_albums - public read; admin all; director can add for their event
alter table public.photo_albums enable row level security;
create policy "albums_public_read" on public.photo_albums
  for select using (true);
create policy "albums_admin_all" on public.photo_albums
  using (public.is_admin()) with check (public.is_admin());
create policy "albums_director_insert" on public.photo_albums
  for insert with check (
    event_id is null
    or exists (
      select 1 from public.events e
      where e.id = event_id and public.directs(e.committee_id)
    )
  );

-- audit_log - admin read only; written via security-definer functions
alter table public.audit_log enable row level security;
create policy "audit_log_admin_read" on public.audit_log
  for select using (public.is_admin());

-- news_items - published entries are public; admin manages
alter table public.news_items enable row level security;
create policy "news_items_public_read" on public.news_items
  for select using (is_published = true);
create policy "news_items_admin_all" on public.news_items
  using (public.is_admin()) with check (public.is_admin());

-- sponsors - active entries are public; admin manages
alter table public.sponsors enable row level security;
create policy "sponsors_public_read" on public.sponsors
  for select using (is_active = true);
create policy "sponsors_admin_all" on public.sponsors
  using (public.is_admin()) with check (public.is_admin());

-- projects - published entries are public; admin manages
alter table public.projects enable row level security;
create policy "projects_public_read" on public.projects
  for select using (is_published = true);
create policy "projects_admin_all" on public.projects
  using (public.is_admin()) with check (public.is_admin());
