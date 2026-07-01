-- ============================================================================
-- ACM UTA Platform - Dev test data for Stage 7a/7b admin review
-- supabase/dev_test_data.sql
--
-- DEV ONLY. Paste sections into the SQL editor as needed. Not a migration -
-- not applied automatically, safe to edit/re-run, and not referenced by the
-- app. Replace 'you@example.com' with the email you signed up with.
-- ============================================================================


-- ─── OPTION A: make your account a full admin ───────────────────────────────
-- Use this to test the admin paths: org-wide events, full role-assignment
-- select (member/officer/director) on any application, all committees.

update public.profiles
set is_admin = true
where email = 'you@example.com';


-- ─── OPTION B: make your account a director (not admin) ────────────────────
-- Use this to test the RLS-scoped director paths: events locked to your
-- committee, applications limited to that committee, "Grant officer role"
-- only (no member/director assignment, no update of existing roles).
-- Run the "undo" block first if you previously ran Option A.

-- undo Option A first if needed:
-- update public.profiles set is_admin = false where email = 'you@example.com';

insert into public.committee_roles (user_id, committee_id, role)
select p.id, c.id, 'director'
from public.profiles p, public.committees c
where p.email = 'you@example.com'
  and c.slug = 'create'
on conflict (user_id, committee_id) do update set role = 'director';


-- ─── Sample application for the Applications review page ───────────────────
-- Submits one filled-out application from your account against the seeded
-- "Officer Application" form (Create committee, from seed.sql) so the review
-- UI has data. Swap 'you@example.com' for a different test user's email if
-- you have one, so you're not reviewing your own application.
--
-- To test the review workflow across statuses, submit from a couple of
-- different test accounts and then update each row's `status` via the
-- builder/review UI (or directly: `update public.applications set status =
-- 'under_review' where id = '<id>'`).

with applicant as (
  select id from public.profiles where email = 'you@example.com'
),
target_form as (
  select f.id
  from public.application_forms f
  join public.committees c on c.id = f.committee_id
  where c.slug = 'create' and f.application_type = 'officer'
)
insert into public.applications (form_id, applicant_id, answers, wants_director, status, submitted_at)
select
  target_form.id,
  applicant.id,
  '{
    "00000000-0000-4000-8000-000000000001": "Test Applicant",
    "00000000-0000-4000-8000-000000000002": "they/them",
    "00000000-0000-4000-8000-000000000003": "you@example.com",
    "00000000-0000-4000-8000-000000000004": "555-123-4567",
    "00000000-0000-4000-8000-000000000005": "1001234567",
    "00000000-0000-4000-8000-000000000006": "testuser#0001",
    "00000000-0000-4000-8000-000000000007": "Computer Science",
    "00000000-0000-4000-8000-000000000008": "Junior",
    "00000000-0000-4000-8000-000000000009": "Friend recommendation",
    "00000000-0000-4000-8000-00000000000a": "@testuser",
    "00000000-0000-4000-8000-00000000000b": "https://linkedin.com/in/testuser",
    "00000000-0000-4000-8000-00000000000c": "https://github.com/testuser",
    "00000000-0000-4000-8000-00000000000e": true,
    "00000000-0000-4000-8000-00000000000f": "I want to grow my leadership skills and help guide the team.",
    "00000000-0000-4000-8000-000000000010": "I am passionate about building products and want hands-on experience.",
    "00000000-0000-4000-8000-000000000011": "Led a project team during a previous internship.",
    "00000000-0000-4000-8000-000000000012": "React, TypeScript, Postgres, Figma.",
    "00000000-0000-4000-8000-000000000013": "Yes, attended several workshops and GBMs.",
    "00000000-0000-4000-8000-000000000014": 10
  }'::jsonb,
  true,
  'submitted'::application_status,
  now() - interval '1 day'
from applicant, target_form;
