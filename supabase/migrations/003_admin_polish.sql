-- ============================================================================
-- ACM UTA Platform - Admin/member polish pass
-- Migration: 003_admin_polish.sql
--
-- Additive alongside 001_initial_schema.sql and
-- 002_application_builder.sql, neither of which is edited.
--
-- Sections:
--   1. current_semester_term_id() - date-driven semester/year terms,
--      auto-creating + activating rows on first access each period
--   2. Align existing seeded `terms` rows to the new Aug1-Dec31 / Jan1-May31
--      convention so (1) matches them instead of inserting duplicates
--   3. Repoint check_in()/admin_check_in() at current_semester_term_id()
--   4. get_officer_leaderboard() - leaderboard scoped to officers/directors/admins
-- ============================================================================


-- ─── 1. CURRENT SEMESTER TERM ────────────────────────────────────────────────
-- Fall = Aug 1 - Dec 31, Spring = Jan 1 - May 31, "year" = Fall + following
-- Spring. June/July is a gap with no active semester (returns null). On the
-- first call after a rollover, creates and activates the new term row(s) -
-- no cron/admin action required.
create or replace function public.current_semester_term_id()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today      date := (now() at time zone 'utc')::date;
  v_year       int  := extract(year from v_today)::int;
  v_month      int  := extract(month from v_today)::int;
  v_sem_name   text;
  v_sem_start  date;
  v_sem_end    date;
  v_year_name  text;
  v_year_start date;
  v_year_end   date;
  v_year_id    uuid;
  v_sem_id     uuid;
begin
  if v_month between 8 and 12 then
    v_sem_name   := 'Fall ' || v_year;
    v_sem_start  := make_date(v_year, 8, 1);
    v_sem_end    := make_date(v_year, 12, 31);
    v_year_start := v_sem_start;
    v_year_end   := make_date(v_year + 1, 5, 31);
    v_year_name  := v_year || '-' || (v_year + 1);
  elsif v_month between 1 and 5 then
    v_sem_name   := 'Spring ' || v_year;
    v_sem_start  := make_date(v_year, 1, 1);
    v_sem_end    := make_date(v_year, 5, 31);
    v_year_start := make_date(v_year - 1, 8, 1);
    v_year_end   := v_sem_end;
    v_year_name  := (v_year - 1) || '-' || v_year;
  else
    -- June/July: no active semester.
    update public.terms set is_active = false
    where type in ('semester', 'year') and is_active = true;
    return null;
  end if;

  select id into v_sem_id
  from public.terms
  where type = 'semester' and start_date = v_sem_start and end_date = v_sem_end;

  if not found then
    select id into v_year_id
    from public.terms
    where type = 'year' and start_date = v_year_start and end_date = v_year_end;

    if not found then
      update public.terms set is_active = false where type = 'year' and is_active = true;

      insert into public.terms (name, type, start_date, end_date, is_active)
      values (v_year_name, 'year', v_year_start, v_year_end, true)
      returning id into v_year_id;
    end if;

    update public.terms set is_active = false where type = 'semester' and is_active = true;

    insert into public.terms (name, type, start_date, end_date, is_active, parent_year_term_id)
    values (v_sem_name, 'semester', v_sem_start, v_sem_end, true, v_year_id)
    returning id into v_sem_id;
  else
    update public.terms set is_active = false
    where type = 'semester' and id <> v_sem_id and is_active = true;
    update public.terms set is_active = true
    where id = v_sem_id and is_active = false;
  end if;

  return v_sem_id;
end;
$$;


-- ─── 2. ALIGN EXISTING SEEDED TERM ROWS ─────────────────────────────────────
-- seed.sql created "Fall 2026" (2026-08-25..2026-12-15) and "2026-2027"
-- (2026-08-01..2027-07-31). Realign their date ranges to the Aug1-Dec31 /
-- Aug1-May31 convention so current_semester_term_id() finds these rows
-- instead of inserting duplicates once Fall 2026 begins.
update public.terms
set start_date = '2026-08-01', end_date = '2026-12-31'
where type = 'semester' and name = 'Fall 2026';

update public.terms
set start_date = '2026-08-01', end_date = '2027-05-31'
where type = 'year' and start_date = '2026-08-01' and end_date = '2027-07-31';


-- ─── 3. REPOINT CHECK-IN FUNCTIONS AT current_semester_term_id() ────────────
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

  v_term := public.current_semester_term_id();

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

  v_term := public.current_semester_term_id();

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


-- ─── 4. OFFICER-ONLY LEADERBOARD ─────────────────────────────────────────────
-- Mirrors get_leaderboard(), scoped to admins/officers/directors. Self-gates:
-- a caller who is not an officer/director/admin gets an empty result set even
-- if they call the RPC directly.
create or replace function public.get_officer_leaderboard(p_term_id uuid default null)
returns table (user_id uuid, full_name text, total_points bigint, rank bigint)
language plpgsql
security definer
stable
set search_path = ''
as $$
begin
  if not (
    public.is_admin()
    or exists (
      select 1 from public.committee_roles
      where user_id = auth.uid() and role in ('officer', 'director')
    )
  ) then
    return;
  end if;

  return query
    select
      p.id,
      p.full_name,
      coalesce(sum(pt.amount), 0)::bigint as total_points,
      rank() over (order by coalesce(sum(pt.amount), 0) desc)
    from public.profiles p
    left join public.point_transactions pt
      on pt.user_id = p.id
      and (p_term_id is null or pt.semester_term_id = p_term_id)
    where p.is_alumni = false
      and (
        p.is_admin = true
        or exists (
          select 1 from public.committee_roles cr
          where cr.user_id = p.id and cr.role in ('officer', 'director')
        )
      )
    group by p.id, p.full_name
    having coalesce(sum(pt.amount), 0) > 0
    order by total_points desc, p.full_name asc
    limit 100;
end;
$$;
