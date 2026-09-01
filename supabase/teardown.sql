-- ============================================================================
-- ACM UTA Platform - Teardown (development only)
-- supabase/teardown.sql
--
-- Wipes every ACM-created object from the public schema so the migration
-- can be re-run from scratch.  Run this in the SQL editor FIRST, then run
-- the migration, then seed.sql.
--
-- Safe: only drops objects this project owns.
-- Do NOT run in a production database that has real member data.
-- ============================================================================

-- ── Triggers (drop before their functions) ───────────────────────────────────
drop trigger if exists on_auth_user_created      on auth.users;
drop trigger if exists on_profile_updated        on public.profiles;
drop trigger if exists application_status_notify on public.applications;
drop trigger if exists application_submitted_notify on public.applications;
drop trigger if exists point_transaction_notify  on public.point_transactions;
drop trigger if exists mentorship_pairing_notify on public.mentor_mentee_pairings;
drop trigger if exists trg_enforce_form_lock     on public.application_forms;
drop trigger if exists trg_enforce_form_open     on public.applications;
drop trigger if exists lock_form_on_first_submission on public.applications;
drop trigger if exists on_application_templates_updated on public.application_templates;
drop trigger if exists on_application_forms_updated     on public.application_forms;
drop trigger if exists on_applications_updated          on public.applications;

-- ── Functions ────────────────────────────────────────────────────────────────
drop function if exists public.handle_new_user()                          cascade;
drop function if exists public.handle_profile_updated_at()                cascade;
drop function if exists public.handle_updated_at()                        cascade;
drop function if exists public.check_in(text)                             cascade;
drop function if exists public.admin_check_in(uuid, uuid)                 cascade;
drop function if exists public.is_admin()                                 cascade;
drop function if exists public.directed_committees()                      cascade;
drop function if exists public.directs(uuid)                              cascade;
drop function if exists public.log_admin_action(text, text, uuid, jsonb)  cascade;
drop function if exists public.get_leaderboard(uuid)                      cascade;
drop function if exists public.notify_user(uuid, text, text, text, text)  cascade;
drop function if exists public.trg_application_status_notify()            cascade;
drop function if exists public.trg_points_notify()                        cascade;
drop function if exists public.trg_pairing_notify()                       cascade;
drop function if exists public.trg_application_submitted_notify()         cascade;
drop function if exists public.enforce_form_lock()                        cascade;
drop function if exists public.enforce_form_open()                        cascade;
drop function if exists public.trg_lock_form_on_first_submission()        cascade;

-- ── Storage (resumes bucket) ─────────────────────────────────────────────────
drop policy if exists "resumes_applicant_insert"     on storage.objects;
drop policy if exists "resumes_applicant_select_own" on storage.objects;
drop policy if exists "resumes_applicant_delete_own" on storage.objects;
drop policy if exists "resumes_admin_select"         on storage.objects;
drop policy if exists "resumes_director_select"      on storage.objects;
delete from storage.objects where bucket_id = 'resumes';
delete from storage.buckets where id = 'resumes';

-- ── Tables (CASCADE drops dependent RLS policies, indexes, and FKs) ─────────
drop table if exists public.audit_log                  cascade;
drop table if exists public.notifications              cascade;
drop table if exists public.mentor_mentee_pairings     cascade;
drop table if exists public.team_memberships           cascade;
drop table if exists public.teams                      cascade;
drop table if exists public.applications               cascade;
drop table if exists public.application_forms          cascade;
drop table if exists public.application_templates      cascade;
drop table if exists public.point_transactions         cascade;
drop table if exists public.attendance                 cascade;
drop table if exists public.event_category_assignments cascade;
drop table if exists public.events                     cascade;
drop table if exists public.event_categories           cascade;
drop table if exists public.terms                      cascade;
drop table if exists public.committee_roles            cascade;
drop table if exists public.committees                 cascade;
drop table if exists public.photo_albums               cascade;
drop table if exists public.projects                   cascade;
drop table if exists public.sponsors                   cascade;
drop table if exists public.news_items                 cascade;
drop table if exists public.profiles                   cascade;
drop table if exists public.admin_allowlist            cascade;

-- ── Enum types ───────────────────────────────────────────────────────────────
drop type if exists public.committee_role          cascade;
drop type if exists public.application_type        cascade;
drop type if exists public.application_status      cascade;
drop type if exists public.application_form_status cascade;
drop type if exists public.application_term        cascade;
drop type if exists public.term_type               cascade;
drop type if exists public.point_source            cascade;
