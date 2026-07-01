-- ============================================================================
-- ACM UTA Platform - In-app application builder
-- Migration: 002_application_builder.sql
--
-- Replaces the Google-Forms-based application_forms/applications tables with
-- an in-app form builder, applicant flow, and review workflow. Additive
-- alongside 001_initial_schema.sql, which is NOT edited.
--
-- Sections:
--   1. New enum types
--   2. Drop old applications/application_forms + old application_status enum
--   3. Generic updated_at trigger function
--   4. application_templates
--   5. application_forms (recreate)
--   6. applications (recreate)
--   7. Indexes
--   8. profiles - new columns
--   9. Storage bucket + RLS (resumes)
--  10. RLS - application_templates / application_forms / applications
--  11. Lock + open enforcement triggers
--  12. Notification triggers (rewritten)
--
-- Seed data (base template + sample form) lives in supabase/seed.sql, not
-- here, matching the convention of 001_initial_schema.sql.
-- ============================================================================


-- ─── 1. NEW ENUM TYPES ───────────────────────────────────────────────────────
create type public.application_form_status as enum ('draft', 'open', 'closed');
create type public.application_term        as enum ('spring', 'summer', 'fall');


-- ─── 2. DROP OLD APPLICATION TABLES + OLD STATUS ENUM ───────────────────────
-- Drops existing (placeholder/test) application data along with the old
-- 4-value status enum. application_type is reused as-is.
drop trigger  if exists application_status_notify    on public.applications;
drop trigger  if exists application_submitted_notify on public.applications;
drop function if exists public.trg_application_status_notify()    cascade;
drop function if exists public.trg_application_submitted_notify() cascade;

drop table if exists public.applications      cascade;
drop table if exists public.application_forms cascade;
drop type  if exists public.application_status cascade;

create type public.application_status as enum (
  'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted'
);


-- ─── 3. GENERIC updated_at TRIGGER FUNCTION ─────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ─── 4. APPLICATION_TEMPLATES ────────────────────────────────────────────────
create table public.application_templates (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  is_base    boolean     not null default false,
  questions  jsonb       not null default '[]',
  created_by uuid        references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger on_application_templates_updated
  before update on public.application_templates
  for each row execute function public.handle_updated_at();


-- ─── 5. APPLICATION_FORMS (recreate) ─────────────────────────────────────────
create table public.application_forms (
  id                   uuid                            primary key default gen_random_uuid(),
  committee_id         uuid                            not null references public.committees(id) on delete cascade,
  application_type     public.application_type         not null,
  title                text                            not null,
  description          text,
  term                 public.application_term         not null,
  year                 int                             not null,
  questions            jsonb                           not null default '[]',
  show_director_toggle boolean                         not null default false,
  status               public.application_form_status not null default 'draft',
  opens_at             timestamptz,
  closes_at            timestamptz,
  is_locked            boolean                         not null default false,
  created_by           uuid                            references public.profiles(id),
  created_at           timestamptz                     not null default now(),
  updated_at           timestamptz                     not null default now()
);

create trigger on_application_forms_updated
  before update on public.application_forms
  for each row execute function public.handle_updated_at();


-- ─── 6. APPLICATIONS (recreate) ──────────────────────────────────────────────
create table public.applications (
  id             uuid                       primary key default gen_random_uuid(),
  form_id        uuid                       not null references public.application_forms(id) on delete cascade,
  applicant_id   uuid                       not null references public.profiles(id)          on delete cascade,
  answers        jsonb                      not null default '{}',
  resume_path    text,
  wants_director boolean,
  status         public.application_status not null default 'submitted',
  reviewer_notes text,
  reviewed_by    uuid                       references public.profiles(id),
  submitted_at   timestamptz                not null default now(),
  updated_at     timestamptz                not null default now(),
  unique (form_id, applicant_id)
);

create trigger on_applications_updated
  before update on public.applications
  for each row execute function public.handle_updated_at();


-- ─── 7. INDEXES ──────────────────────────────────────────────────────────────
create index on public.application_forms (committee_id);
create index on public.application_forms (application_type);
create index on public.application_forms (status);
create index on public.applications      (form_id);
create index on public.applications      (applicant_id);
create index on public.applications      (status);


-- ─── 8. PROFILES - NEW COLUMNS ───────────────────────────────────────────────
alter table public.profiles
  add column phone            text,
  add column student_id       text,
  add column discord_username text,
  add column linkedin         text,
  add column github            text,
  add column instagram_handle text;


-- ─── 9. STORAGE - resumes BUCKET + RLS ───────────────────────────────────────
-- Object path convention: {form_id}/{applicant_id}/resume.pdf
-- storage.foldername(name) -> array['{form_id}', '{applicant_id}']
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- storage.objects has RLS enabled by default on Supabase projects.
create policy "resumes_applicant_insert" on storage.objects
  for insert
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "resumes_applicant_select_own" on storage.objects
  for select
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "resumes_applicant_delete_own" on storage.objects
  for delete
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "resumes_admin_select" on storage.objects
  for select
  using (
    bucket_id = 'resumes'
    and public.is_admin()
  );

create policy "resumes_director_select" on storage.objects
  for select
  using (
    bucket_id = 'resumes'
    and exists (
      select 1 from public.application_forms f
      where f.id = (storage.foldername(name))[1]::uuid
        and public.directs(f.committee_id)
    )
  );


-- ─── 10. RLS - application_templates / application_forms / applications ────

-- application_templates: admins manage the bank; admins + any director may
-- read it (to clone a template when building a form for their committee).
alter table public.application_templates enable row level security;

create policy "templates_admin_director_read" on public.application_templates
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.committee_roles
      where user_id = auth.uid() and role = 'director'
    )
  );

create policy "templates_admin_all" on public.application_templates
  using (public.is_admin()) with check (public.is_admin());


-- application_forms: public read of non-draft forms; admin all; director
-- full CRUD on forms for their own committee.
alter table public.application_forms enable row level security;

create policy "appforms_public_read" on public.application_forms
  for select using (status <> 'draft');

create policy "appforms_admin_all" on public.application_forms
  using (public.is_admin()) with check (public.is_admin());

create policy "appforms_director_all" on public.application_forms
  using (public.directs(committee_id))
  with check (public.directs(committee_id));


-- applications: applicant reads/inserts own; admin all; director reads/
-- reviews applications for forms belonging to their committee. No
-- self-update policy - submissions are final once created.
alter table public.applications enable row level security;

create policy "apps_read_self" on public.applications
  for select using (applicant_id = auth.uid());

create policy "apps_read_admin" on public.applications
  for select using (public.is_admin());

create policy "apps_read_director" on public.applications
  for select using (
    exists (
      select 1 from public.application_forms f
      where f.id = form_id and public.directs(f.committee_id)
    )
  );

create policy "apps_insert_self" on public.applications
  for insert with check (applicant_id = auth.uid());

create policy "apps_update_reviewer" on public.applications
  for update using (
    public.is_admin()
    or exists (
      select 1 from public.application_forms f
      where f.id = form_id and public.directs(f.committee_id)
    )
  );

create policy "apps_delete_admin" on public.applications
  for delete using (public.is_admin());

create policy "apps_delete_director" on public.applications
  for delete using (
    exists (
      select 1 from public.application_forms f
      where f.id = form_id and public.directs(f.committee_id)
    )
  );


-- ─── 11. LOCK + OPEN ENFORCEMENT TRIGGERS ────────────────────────────────────

-- Defense-in-depth alongside the UI guard: once a form is locked, its
-- question set can no longer change (duplicate the form instead).
create or replace function public.enforce_form_lock()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.is_locked and new.questions is distinct from old.questions then
    raise exception 'Cannot modify questions on a locked application form. Duplicate the form instead.';
  end if;
  return new;
end;
$$;

create trigger trg_enforce_form_lock
  before update on public.application_forms
  for each row execute function public.enforce_form_lock();

-- Reject submissions to forms that are not currently open.
create or replace function public.enforce_form_open()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_form public.application_forms;
begin
  select * into v_form from public.application_forms where id = new.form_id;

  if not found then
    raise exception 'Application form not found.';
  end if;

  if not (
    v_form.status = 'open'
    and (v_form.opens_at  is null or v_form.opens_at  <= now())
    and (v_form.closes_at is null or v_form.closes_at >  now())
  ) then
    raise exception 'This application form is not currently open.';
  end if;

  return new;
end;
$$;

create trigger trg_enforce_form_open
  before insert on public.applications
  for each row execute function public.enforce_form_open();

-- Lock a form's question set the moment its first submission lands.
create or replace function public.trg_lock_form_on_first_submission()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.application_forms
  set is_locked = true
  where id = new.form_id and is_locked = false;

  return new;
end;
$$;

create trigger lock_form_on_first_submission
  after insert on public.applications
  for each row execute function public.trg_lock_form_on_first_submission();


-- ─── 12. NOTIFICATION TRIGGERS (rewritten) ──────────────────────────────────

-- Application reviewed: notify the applicant when status changes.
create or replace function public.trg_application_status_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_committee text;
  v_title     text;
begin
  if new.status is distinct from old.status
     and new.status in ('accepted', 'rejected', 'under_review', 'waitlisted') then

    select c.name, f.title into v_committee, v_title
    from public.application_forms f
    join public.committees c on c.id = f.committee_id
    where f.id = new.form_id;

    perform public.notify_user(
      new.applicant_id,
      'application_status',
      case new.status
        when 'accepted'   then 'Application accepted'
        when 'rejected'   then 'Application update'
        when 'waitlisted' then 'Application waitlisted'
        else                   'Application under review'
      end,
      case new.status
        when 'accepted'   then 'Your ' || coalesce(v_title, 'application') || ' application for ' || coalesce(v_committee, 'a committee') || ' was accepted. Welcome aboard!'
        when 'rejected'   then 'Your ' || coalesce(v_title, 'application') || ' application for ' || coalesce(v_committee, 'a committee') || ' was not selected this cycle.'
        when 'waitlisted' then 'Your ' || coalesce(v_title, 'application') || ' application for ' || coalesce(v_committee, 'a committee') || ' has been waitlisted.'
        else                   'Your ' || coalesce(v_title, 'application') || ' application for ' || coalesce(v_committee, 'a committee') || ' is now under review.'
      end,
      '/profile'
    );
  end if;
  return new;
end;
$$;

create trigger application_status_notify
  after update on public.applications
  for each row execute function public.trg_application_status_notify();

-- New application submitted: notify org admins and the committee's directors.
create or replace function public.trg_application_submitted_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_committee    text;
  v_title        text;
  v_committee_id uuid;
  v_applicant    text;
  v_recipient    record;
begin
  select f.title, f.committee_id, c.name
    into v_title, v_committee_id, v_committee
  from public.application_forms f
  join public.committees c on c.id = f.committee_id
  where f.id = new.form_id;

  select full_name into v_applicant from public.profiles where id = new.applicant_id;

  for v_recipient in
    select id from public.profiles where is_admin = true
    union
    select user_id as id from public.committee_roles
    where committee_id = v_committee_id and role = 'director'
  loop
    perform public.notify_user(
      v_recipient.id,
      'new_application',
      'New application',
      coalesce(v_applicant, 'Someone') || ' applied to ' || coalesce(v_title, coalesce(v_committee, 'a committee')),
      '/admin/applications'
    );
  end loop;

  return new;
end;
$$;

create trigger application_submitted_notify
  after insert on public.applications
  for each row execute function public.trg_application_submitted_notify();
