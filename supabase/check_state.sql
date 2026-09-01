-- ============================================================================
-- One-off diagnostic: is supabase/seed.sql's application-builder section
-- (base template + sample "Officer Application" form) already inserted?
-- Paste into SQL Editor, run, and share the result rows.
-- Safe to delete after use.
-- ============================================================================

select 'application_templates row count' as item, count(*)::text as value
from public.application_templates
union all
select 'base template exists (is_base = true)', exists (
  select 1 from public.application_templates where is_base = true
)::text
union all
select 'application_forms row count', count(*)::text
from public.application_forms
union all
select 'sample "Officer Application" form (Create committee)', exists (
  select 1 from public.application_forms f
  join public.committees c on c.id = f.committee_id
  where c.slug = 'create' and f.title = 'Officer Application'
)::text
union all
select 'applications row count (submissions)', count(*)::text
from public.applications;
