-- ============================================================================
-- ACM UTA Platform - Seed Data
-- supabase/seed.sql
--
-- Run AFTER the schema migration.
-- In Supabase CLI:  supabase db reset   (applies migrations + this file)
-- Or paste into the SQL editor after the migration runs.
-- ============================================================================


-- ─── ADMIN ALLOWLIST ─────────────────────────────────────────────────────────
-- Add every email that needs admin access but won't have a @mavs.uta.edu
-- address (graduating officers, maintainers, etc.).  Without an entry here,
-- the domain-restriction trigger will reject their signup.
--
-- Uncomment and fill in real addresses before running:
--
-- insert into public.admin_allowlist (email, note)
-- values
--   ('your.personal@gmail.com', 'ACM President 2025-26, maintaining after graduation'),
--   ('another@gmail.com',       'Role / name');


-- ─── COMMITTEES ──────────────────────────────────────────────────────────────
insert into public.committees
  ( name, slug, tag, summary, description, doing, involve,
    accepts_member_applications, has_teams, has_mentorship_program, sort_order )
values
  (
    'Create', 'create', 'build / ship',
    'Build real projects and ship products on small dev teams.',
    'Create is where ACM builds things people actually use. Members join small product teams, pick up real tickets, and ship: web apps, tools, bots, whatever the team is building that semester. You learn the parts of software that class never covers: working in a repo with other people, reviewing each other''s code, and getting something to done.',
    array[
      'Join a dev team and ship a real product over the semester',
      'Work in a shared repo with code review and standups',
      'Pair with experienced members on your first PRs',
      'Demo what you built at the end-of-semester showcase'
    ],
    'Membership is by application. Teams form at the start of each semester. Apply with your Mavs email.',
    true, true, false, 1
  ),
  (
    'Research', 'research', 'papers / teams',
    'Read papers, run research teams, and dig into open CS problems.',
    'Research pairs students with faculty and each other to dig into real CS research. Teams read papers together, reproduce results, and work toward something publishable. It''s the on-ramp for anyone curious about grad school or just what''s past the edge of the syllabus.',
    array[
      'Join a research team around a topic you''re into',
      'Read and break down papers in a weekly reading group',
      'Reproduce results and run your own experiments',
      'Work toward a poster, talk, or publication'
    ],
    'Membership is by application. Teams are small on purpose. Apply with your Mavs email.',
    true, true, false, 2
  ),
  (
    'Educate', 'educate', 'workshops / mentorship',
    'Workshops, career development, and the mentor/mentee program.',
    'Educate runs the things that level you up: hands-on workshops, career and interview prep, and the mentor/mentee program that pairs newer students with people who''ve been through it. If you''re new to all this, start here, and someone will have your back.',
    array[
      'Get matched with a mentor (or become one)',
      'Hit workshops on Git, the terminal, data structures, and more',
      'Sharpen your resume and run mock interviews',
      'Track a learning path from first-year to internship-ready'
    ],
    'Open to all. Sign up for the mentor/mentee program at the start of the semester.',
    false, false, true, 3
  ),
  (
    'Marketing', 'marketing', 'brand / content',
    'Brand, social, design, and content for the whole org.',
    'Marketing owns how ACM looks and sounds. The team runs social, shoots and edits content at events, designs everything from flyers to this site, and keeps the brand sharp. If you like making things look good and getting them in front of people, this is your committee.',
    array[
      'Design flyers, slides, and social posts',
      'Shoot photo and video at events and edit recaps',
      'Run the Instagram, write the captions, build the brand',
      'Keep the site and visual identity consistent'
    ],
    'Staff committee with officer and director roles. Get involved by showing up and pitching in.',
    false, false, false, 4
  ),
  (
    'Outreach', 'outreach', 'sponsors / partners',
    'Sponsorships, industry relationships, and partnerships.',
    'Outreach is the bridge between ACM and the outside world. The team lands sponsors, builds relationships with companies, and brings industry into the room: recruiters, tech talks, and the funding that makes everything else free for members.',
    array[
      'Reach out to companies and pitch sponsorship',
      'Coordinate industry tech talks and recruiting events',
      'Steward sponsor relationships across the year',
      'Help bring $10k+ of funding to the org'
    ],
    'Staff committee with officer and director roles. Comfortable with email and people? Come talk to us.',
    false, false, false, 5
  ),
  (
    'Community', 'community', 'socials / culture',
    'Socials, culture, and the day-to-day member experience.',
    'Community makes ACM feel like a place you belong, not just a club you joined. The team runs game nights, socials, and the small things that turn a Discord server into actual friends. Culture is a feature, and Community owns it.',
    array[
      'Plan socials, game nights, and end-of-semester parties',
      'Keep the Discord alive and welcoming',
      'Welcome new members and help them find their people',
      'Set the tone for what ACM feels like'
    ],
    'Staff committee with officer and director roles. The easiest place to start. Just hang out.',
    false, false, false, 6
  );


-- ─── EVENT CATEGORIES ────────────────────────────────────────────────────────
-- bit_value: members earn the HIGHEST value across all categories on an event.
-- e.g. a Workshop + GBM event gives 6 bits, not 4.
insert into public.event_categories (name, bit_value, description)
values
  ('GBM',            6, 'General Body Meeting - org-wide required meeting'),
  ('Hackathon',      8, 'Multi-hour / multi-day build event (HackUTA, etc.)'),
  ('Workshop',       4, 'Hands-on technical or career development session'),
  ('Industry Night', 4, 'Networking or recruiting event with companies'),
  ('Weekly Meeting', 2, 'Regular committee or team meeting'),
  ('Social',         2, 'Game night, hangout, or community event'),
  ('Bonus',          3, 'Special one-off event with admin-set bonus value');


-- ─── TERMS ───────────────────────────────────────────────────────────────────
-- Insert the parent year term, then the active semester under it.
with year_term as (
  insert into public.terms (name, type, start_date, end_date, is_active)
  values ('2026–2027', 'year', '2026-08-01', '2027-07-31', true)
  returning id
)
insert into public.terms (name, type, start_date, end_date, is_active, parent_year_term_id)
select 'Fall 2026', 'semester', '2026-08-25', '2026-12-15', true, id
from year_term;


-- ─── APPLICATION TEMPLATES & FORMS (002_application_builder) ────────────────
-- Run this section after applying the application_builder migration.

-- Standard officer application template. Question ids are fixed UUID
-- literals so #15's conditional can reference #14 directly.
insert into public.application_templates (name, is_base, questions)
values (
  'Standard Officer Application',
  true,
  '[
    {"id":"00000000-0000-4000-8000-000000000001","type":"short_text","label":"Name (First & Last)","required":true,"autofill":"name"},
    {"id":"00000000-0000-4000-8000-000000000002","type":"short_text","label":"Pronouns","required":false,"autofill":"pronouns"},
    {"id":"00000000-0000-4000-8000-000000000003","type":"email","label":"School Email","required":true,"autofill":"email"},
    {"id":"00000000-0000-4000-8000-000000000004","type":"phone","label":"Phone Number","required":true,"save_back":"phone"},
    {"id":"00000000-0000-4000-8000-000000000005","type":"student_id","label":"Student ID","required":true,"save_back":"student_id"},
    {"id":"00000000-0000-4000-8000-000000000006","type":"short_text","label":"Discord Username","required":true,"save_back":"discord_username"},
    {"id":"00000000-0000-4000-8000-000000000007","type":"short_text","label":"Major","required":true,"autofill":"major"},
    {"id":"00000000-0000-4000-8000-000000000008","type":"select","label":"Grade","required":true,"autofill":"grade","options":["Freshman","Sophomore","Junior","Senior","Graduate Student"]},
    {"id":"00000000-0000-4000-8000-000000000009","type":"long_text","label":"How did you hear about ACM? (Include a referrer name if applicable)","required":true},
    {"id":"00000000-0000-4000-8000-00000000000a","type":"short_text","label":"Instagram","required":false},
    {"id":"00000000-0000-4000-8000-00000000000b","type":"url","label":"LinkedIn Link","required":true,"url_kind":"linkedin","save_back":"linkedin"},
    {"id":"00000000-0000-4000-8000-00000000000c","type":"url","label":"GitHub Link","required":true,"url_kind":"github","save_back":"github","placeholder":"https://github.com/username"},
    {"id":"00000000-0000-4000-8000-00000000000d","type":"file","label":"Resume (PDF)","required":true},
    {"id":"00000000-0000-4000-8000-00000000000e","type":"toggle","label":"Would you like to be considered for a Committee Director position?","required":false},
    {"id":"00000000-0000-4000-8000-00000000000f","type":"long_text","label":"Why would you like to be a committee director?","required":true,"word_limit":100,"conditional":{"question_id":"00000000-0000-4000-8000-00000000000e","equals":true}},
    {"id":"00000000-0000-4000-8000-000000000010","type":"long_text","label":"Why are you interested in this position?","required":true,"word_limit":100},
    {"id":"00000000-0000-4000-8000-000000000011","type":"long_text","label":"Please describe any previous leadership experience.","required":true,"word_limit":100},
    {"id":"00000000-0000-4000-8000-000000000012","type":"long_text","label":"List any relevant skills or qualifications you have relating to this position.","required":true,"word_limit":100},
    {"id":"00000000-0000-4000-8000-000000000013","type":"long_text","label":"Have you been involved with ACM before? If so, in what capacity?","required":true,"word_limit":100},
    {"id":"00000000-0000-4000-8000-000000000014","type":"slider","label":"How much time per week can you realistically commit to ACM?","required":true,"slider":{"min":1,"max":40,"unit":"hours/week"}},
    {"id":"00000000-0000-4000-8000-000000000015","type":"long_text","label":"Is there anything else you would like us to know about you?","required":false}
  ]'::jsonb
);

-- Sample open form so /apply isn't empty out of the box: Create -> Officer.
insert into public.application_forms
  (committee_id, application_type, title, description, term, year, questions, show_director_toggle, status)
select
  c.id,
  'officer'::application_type,
  'Officer Application',
  'Apply to join the Create committee as an officer for the upcoming term.',
  'fall',
  2026,
  t.questions,
  true,
  'open'
from public.committees c, public.application_templates t
where c.slug = 'create' and t.is_base = true;
