/**
 * src/lib/api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * THE single data-access seam for the entire app.
 * Components call these async functions and never import from src/data/ directly.
 *
 * Public-content getters still return mock data; the Supabase swap for those
 * comes in Stage 3.  Profile read/write functions are live against Supabase now.
 *
 * Shape notes:
 *  • committee_id fields mirror Supabase FK conventions (snake_case).
 *  • All functions are async so call-sites already handle promises / loading
 *    and won't need to change when real network calls land.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { committeesData, type Committee, type CommitteeKind } from "@/data/committees";
import { projectsData,   type Project }     from "@/data/projects";
import { eventsData,     type EventItem }   from "@/data/events";
import { albumsData,     type PhotoAlbum }  from "@/data/gallery";
import { officersData,   type Officer }     from "@/data/officers";
import { alumniData,     type Alumni }      from "@/data/alumni";
import { hallOfFameData, type HallOfFameMember } from "@/data/officers";
import { newsData,       type NewsItem }    from "@/data/news";
import { sponsorsData,   type Sponsor }     from "@/data/sponsors";
import { statsData,      type Stat }        from "@/data/stats";
import { hackutaConfig, type HackUTAConfig } from "@/data/hackuta";
import { supabase } from "./supabase";
import { downloadBlob } from "./download";
import JSZip from "jszip";

// Re-export types so consumers import from one place.
export type { Committee, Project, EventItem, PhotoAlbum, Officer, Alumni, HallOfFameMember, NewsItem, Sponsor, Stat, HackUTAConfig };

export interface AdminNewsItem {
  id: string;
  tag: string;
  title: string;
  blurb: string;
  link: string;
  date: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

// Simulated async delay of 0 ms (mirrors real network call shape without
// introducing artificial latency).  Replace with `await supabase...` calls.
const resolve = <T>(value: T): Promise<T> => Promise.resolve(value);

// ─────────────────────────────────────────────────────────────────────────────
// Committees
// ─────────────────────────────────────────────────────────────────────────────

// Maps a DB committees row to the Committee interface.
// Uses slug as id to stay compatible with CommitteeMark and existing key usage.
// kind is derived from the DB boolean flags.
function dbRowToCommittee(row: Record<string, unknown>): Committee {
  let kind: CommitteeKind = "staff";
  if (row.has_mentorship_program) kind = "program";
  else if (row.accepts_member_applications) kind = "application";
  return {
    id: row.slug as string,
    name: row.name as string,
    slug: row.slug as string,
    kind,
    tag: (row.tag as string) ?? "",
    summary: (row.summary as string) ?? "",
    description: (row.description as string) ?? "",
    doing: (row.doing as string[]) ?? [],
    involve: (row.involve as string) ?? "",
    logo: (row.logo_url as string) ?? "",
  };
}

export async function getCommittees(): Promise<Committee[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("committees")
    .select("*")
    .order("sort_order");
  if (error) {
    console.error("getCommittees:", error.message);
    return committeesData;
  }
  return (data ?? []).map(dbRowToCommittee);
}

export async function getCommittee(slug: string): Promise<Committee | null> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("committees")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    return committeesData.find((c) => c.slug === slug) ?? null;
  }
  return dbRowToCommittee(data);
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('projects').select('*').order('year', { ascending: false });
  // if (error) throw error;
  // return data as Project[];
  return resolve(projectsData);
}

// ─────────────────────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────────────────────

function dbRowToEvent(row: Record<string, unknown>): EventItem {
  const c = row.committees as Record<string, string> | null;
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    committee_id: c?.slug ?? null,
    location: (row.location as string) ?? "",
    start_time: row.start_time as string,
    end_time: row.end_time as string,
    google_photos_url: (row.google_photos_url as string) ?? null,
  };
}

export async function getEvents(): Promise<EventItem[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, location, start_time, end_time, google_photos_url, committees(slug)")
    .order("start_time");
  if (error) return [];
  if (!data || data.length === 0) return [];
  return data.map(dbRowToEvent);
}

// ─────────────────────────────────────────────────────────────────────────────
// QR check-in
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckInResult {
  ok: boolean;
  bits_awarded?: number;
  event_title?: string;
  error?: "not_authenticated" | "invalid_token" | "qr_expired" | "already_checked_in";
}

export async function callCheckIn(token: string): Promise<CheckInResult> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase.rpc("check_in", { p_qr_token: token });
  if (error) throw new Error(error.message);
  return data as CheckInResult;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery / Albums
// ─────────────────────────────────────────────────────────────────────────────

export async function getAlbums(): Promise<PhotoAlbum[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('photo_albums').select('*').order('album_date', { ascending: false });
  // if (error) throw error;
  // return data as PhotoAlbum[];
  return resolve(albumsData);
}

// ─────────────────────────────────────────────────────────────────────────────
// Officers & Alumni
// ─────────────────────────────────────────────────────────────────────────────

export async function getOfficers(): Promise<Officer[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('committee_roles')
  //   .select('*, profiles(*), committees(name)')
  //   .in('role', ['officer', 'director'])
  //   .order('role');
  // if (error) throw error;
  // return data as Officer[];
  return resolve(officersData);
}

export async function getAlumni(): Promise<Alumni[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('profiles').select('*').eq('is_alumni', true).order('full_name');
  // if (error) throw error;
  // return data as Alumni[];
  return resolve(alumniData);
}

export async function getHallOfFame(): Promise<HallOfFameMember[]> {
  return resolve(hallOfFameData);
}

export async function getHackUTAConfig(): Promise<HackUTAConfig> {
  const { data, error } = await supabase
    .from("hackuta_settings")
    .select("enabled, year, date_display, location, apps_open, apps_url")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return hackutaConfig;
  return {
    enabled: data.enabled as boolean,
    year: data.year as number,
    dateDisplay: data.date_display as string,
    location: data.location as string,
    appsOpen: data.apps_open as boolean,
    appsUrl: (data.apps_url as string) ?? null,
  };
}

export async function updateHackUTAConfig(
  updates: Partial<HackUTAConfig>,
  updatedBy: string
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString(), updated_by: updatedBy };
  if (updates.enabled !== undefined)     payload.enabled      = updates.enabled;
  if (updates.year !== undefined)        payload.year         = updates.year;
  if (updates.dateDisplay !== undefined) payload.date_display = updates.dateDisplay;
  if (updates.location !== undefined)    payload.location     = updates.location;
  if (updates.appsOpen !== undefined)    payload.apps_open    = updates.appsOpen;
  if (updates.appsUrl !== undefined)     payload.apps_url     = updates.appsUrl;
  const { error } = await supabase.from("hackuta_settings").update(payload).eq("id", 1);
  if (error) throw new Error(error.message);
  await logAuditEvent("hackuta_settings.update", "hackuta_settings", "1", updates as Record<string, unknown>);
}

// ─────────────────────────────────────────────────────────────────────────────
// News / Announcements
// ─────────────────────────────────────────────────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news_items")
    .select("id, tag, title, blurb, link, item_date")
    .eq("is_published", true)
    .order("sort_order")
    .order("item_date", { ascending: false })
    .limit(6);
  if (error || !data || data.length === 0) return resolve(newsData);
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    tag: (r.tag as string) ?? "",
    title: r.title as string,
    blurb: (r.blurb as string) ?? "",
    link: (r.link as string) ?? "/",
    date: r.item_date as string,
  }));
}

export async function getAdminNews(): Promise<AdminNewsItem[]> {
  const { data, error } = await supabase
    .from("news_items")
    .select("id, tag, title, blurb, link, item_date, is_published, sort_order, created_at")
    .order("sort_order")
    .order("item_date", { ascending: false });
  if (error || !data) {
    return newsData.map((n, i) => ({
      ...n,
      is_published: true,
      sort_order: i + 1,
      created_at: n.date,
    }));
  }
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    tag: (r.tag as string) ?? "",
    title: r.title as string,
    blurb: (r.blurb as string) ?? "",
    link: (r.link as string) ?? "/",
    date: r.item_date as string,
    is_published: r.is_published as boolean,
    sort_order: (r.sort_order as number) ?? 0,
    created_at: r.created_at as string,
  }));
}

export async function createNewsItem(
  input: Omit<AdminNewsItem, "id" | "created_at"> & { created_by?: string }
): Promise<void> {
  const { error } = await supabase.from("news_items").insert({
    tag: input.tag,
    title: input.title,
    blurb: input.blurb,
    link: input.link,
    item_date: input.date,
    is_published: input.is_published,
    sort_order: input.sort_order,
    created_by: input.created_by ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function updateNewsItem(
  id: string,
  updates: Partial<Omit<AdminNewsItem, "id" | "created_at">>
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.tag !== undefined)          payload.tag          = updates.tag;
  if (updates.title !== undefined)        payload.title        = updates.title;
  if (updates.blurb !== undefined)        payload.blurb        = updates.blurb;
  if (updates.link !== undefined)         payload.link         = updates.link;
  if (updates.date !== undefined)         payload.item_date    = updates.date;
  if (updates.is_published !== undefined) payload.is_published = updates.is_published;
  if (updates.sort_order !== undefined)   payload.sort_order   = updates.sort_order;
  const { error } = await supabase.from("news_items").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteNewsItem(id: string): Promise<void> {
  const { error } = await supabase.from("news_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sponsors
// ─────────────────────────────────────────────────────────────────────────────

export async function getSponsors(): Promise<Sponsor[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('sponsors').select('*')
  //   .eq('is_active', true).order('sort_order');
  // if (error) throw error;
  // return data as Sponsor[];
  return resolve(sponsorsData);
}

// ─────────────────────────────────────────────────────────────────────────────
// Org stats
// ─────────────────────────────────────────────────────────────────────────────

export async function getStats(): Promise<Stat[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('org_stats').select('*').order('display_order');
  // if (error) throw error;
  // return data as Stat[];
  return resolve(statsData);
}

// ─────────────────────────────────────────────────────────────────────────────
// Application forms  (live against Supabase)
// ─────────────────────────────────────────────────────────────────────────────

export type ApplicationType = "member" | "officer" | "mentor" | "mentee";

export async function getUserApplications(userId: string): Promise<ApplicationSubmission[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SUBMISSION_SELECT)
    .eq("applicant_id", userId)
    .order("submitted_at", { ascending: false });
  if (error || !data) return [];
  return data.map(dbRowToApplicationSubmission);
}

// ─────────────────────────────────────────────────────────────────────────────
// Application builder (in-app application system)
// ─────────────────────────────────────────────────────────────────────────────

export type ApplicationFormStatus = "draft" | "open" | "closed";
export type ApplicationTerm = "spring" | "summer" | "fall";

export const APPLICATION_TYPE_LABEL: Record<ApplicationType, string> = {
  member: "Member",
  officer: "Officer",
  mentor: "Mentor",
  mentee: "Mentee",
};

export const TERM_LABEL: Record<ApplicationTerm, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
};

export const FORM_STATUS_LABEL: Record<ApplicationFormStatus, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
};

export type SubmissionStatus = "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "student_id"
  | "select"
  | "toggle"
  | "url"
  | "file"
  | "slider";

export type AutofillField = "name" | "pronouns" | "email" | "major" | "grade";
export type UrlKind = "github" | "linkedin" | "portfolio" | "generic";
export type SaveBackField = "phone" | "student_id" | "discord_username" | "linkedin" | "github";

export interface QuestionConditional {
  question_id: string;
  equals: unknown;
}

export interface SliderConfig {
  min: number;
  max: number;
  unit: string;
}

export interface ApplicationQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  autofill?: AutofillField | null;
  word_limit?: number | null;
  options?: string[] | null;
  slider?: SliderConfig | null;
  url_kind?: UrlKind | null;
  conditional?: QuestionConditional | null;
  save_back?: SaveBackField | null;
  placeholder?: string | null;
}

// Pure helper - a form is "effectively open" if it's marked open AND (if set)
// the current time is within [opens_at, closes_at).
export function isFormEffectivelyOpen(f: {
  status: ApplicationFormStatus;
  opens_at: string | null;
  closes_at: string | null;
}): boolean {
  if (f.status !== "open") return false;
  const now = Date.now();
  if (f.opens_at && new Date(f.opens_at).getTime() > now) return false;
  if (f.closes_at && new Date(f.closes_at).getTime() <= now) return false;
  return true;
}

export interface ApplicationTemplate {
  id: string;
  name: string;
  is_base: boolean;
  questions: ApplicationQuestion[];
}

export async function getApplicationTemplates(): Promise<ApplicationTemplate[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("application_templates")
    .select("id, name, is_base, questions")
    .order("is_base", { ascending: false })
    .order("name");
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    name: r.name as string,
    is_base: r.is_base as boolean,
    questions: (r.questions as ApplicationQuestion[]) ?? [],
  }));
}

export async function getBaseTemplate(): Promise<ApplicationTemplate | null> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("application_templates")
    .select("id, name, is_base, questions")
    .eq("is_base", true)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id as string,
    name: data.name as string,
    is_base: data.is_base as boolean,
    questions: (data.questions as ApplicationQuestion[]) ?? [],
  };
}

const APPLICATION_FORM_DETAIL_SELECT =
  "id, committee_id, application_type, title, description, term, year, questions, show_director_toggle, status, opens_at, closes_at, is_locked, created_at, committees(name, slug), applications(count)";

export interface ApplicationFormDetail {
  id: string;
  committee_id: string;
  committee_name: string;
  committee_slug: string;
  application_type: ApplicationType;
  title: string;
  description: string | null;
  term: ApplicationTerm;
  year: number;
  questions: ApplicationQuestion[];
  show_director_toggle: boolean;
  status: ApplicationFormStatus;
  opens_at: string | null;
  closes_at: string | null;
  is_locked: boolean;
  effective_open: boolean;
  submission_count: number;
  created_at: string;
}

function dbRowToApplicationFormDetail(row: Record<string, unknown>): ApplicationFormDetail {
  const c = row.committees as Record<string, string> | null;
  const status = row.status as ApplicationFormStatus;
  const opens_at = (row.opens_at as string) ?? null;
  const closes_at = (row.closes_at as string) ?? null;
  const apps = row.applications as { count: number }[] | undefined;
  return {
    id: row.id as string,
    committee_id: row.committee_id as string,
    committee_name: c?.name ?? "",
    committee_slug: c?.slug ?? "",
    application_type: row.application_type as ApplicationType,
    title: row.title as string,
    description: (row.description as string) ?? null,
    term: row.term as ApplicationTerm,
    year: row.year as number,
    questions: (row.questions as ApplicationQuestion[]) ?? [],
    show_director_toggle: row.show_director_toggle as boolean,
    status,
    opens_at,
    closes_at,
    is_locked: row.is_locked as boolean,
    effective_open: isFormEffectivelyOpen({ status, opens_at, closes_at }),
    submission_count: apps?.[0]?.count ?? 0,
    created_at: row.created_at as string,
  };
}

export async function getAdminApplicationForms(): Promise<ApplicationFormDetail[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("application_forms")
    .select(APPLICATION_FORM_DETAIL_SELECT)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(dbRowToApplicationFormDetail);
}

export async function getApplicationFormDetail(formId: string): Promise<ApplicationFormDetail | null> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("application_forms")
    .select(APPLICATION_FORM_DETAIL_SELECT)
    .eq("id", formId)
    .maybeSingle();
  if (error || !data) return null;
  return dbRowToApplicationFormDetail(data);
}

export interface ApplicationFormInput {
  committee_id: string;
  application_type: ApplicationType;
  title: string;
  description: string | null;
  term: ApplicationTerm;
  year: number;
  questions: ApplicationQuestion[];
  show_director_toggle: boolean;
}

export async function createApplicationForm(input: ApplicationFormInput, createdBy: string): Promise<string> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("application_forms")
    .insert({ ...input, created_by: createdBy })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const id = data.id as string;
  await logAuditEvent("application_form.create", "application_form", id, { title: input.title });
  return id;
}

export type ApplicationFormUpdate = Partial<ApplicationFormInput> & {
  opens_at?: string | null;
  closes_at?: string | null;
};

export async function updateApplicationForm(formId: string, updates: ApplicationFormUpdate): Promise<void> {
  // === SUPABASE SWAP POINT ===
  if (updates.questions) {
    const { data: existing, error: fetchError } = await supabase
      .from("application_forms")
      .select("is_locked")
      .eq("id", formId)
      .single();
    if (fetchError) throw new Error(fetchError.message);
    if (existing.is_locked) {
      throw new Error("This form is locked and its questions cannot be changed. Duplicate the form instead.");
    }
  }
  const { error } = await supabase.from("application_forms").update(updates).eq("id", formId);
  if (error) throw new Error(error.message);
  await logAuditEvent("application_form.update", "application_form", formId, { fields: Object.keys(updates) });
}

export async function setApplicationFormStatus(formId: string, status: ApplicationFormStatus): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("application_forms").update({ status }).eq("id", formId);
  if (error) throw new Error(error.message);
  await logAuditEvent("application_form.set_status", "application_form", formId, { status });
}

export async function duplicateApplicationForm(formId: string, createdBy: string): Promise<string> {
  // === SUPABASE SWAP POINT ===
  const original = await getApplicationFormDetail(formId);
  if (!original) throw new Error("Form not found.");

  const { data, error } = await supabase
    .from("application_forms")
    .insert({
      committee_id: original.committee_id,
      application_type: original.application_type,
      title: original.title,
      description: original.description,
      term: original.term,
      year: original.year,
      questions: original.questions,
      show_director_toggle: original.show_director_toggle,
      created_by: createdBy,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const id = data.id as string;
  await logAuditEvent("application_form.duplicate", "application_form", id, { source_form_id: formId });
  return id;
}

export async function deleteApplicationForm(formId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("application_forms").delete().eq("id", formId);
  if (error) throw new Error(error.message);
  await logAuditEvent("application_form.delete", "application_form", formId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Application forms - public listing + applicant flow
// ─────────────────────────────────────────────────────────────────────────────

// Fixed id (seeded in supabase/seed.sql) of the "Would you like to be
// considered for a Committee Director position?" toggle question. Forms
// clone this id from the base template, so it's used to hide that question
// (and its conditional follow-up) when show_director_toggle is false.
export const DIRECTOR_TOGGLE_QUESTION_ID = "00000000-0000-4000-8000-00000000000e";

export interface ApplicationFormSummary {
  id: string;
  committee_id: string;
  committee_name: string;
  committee_slug: string;
  application_type: ApplicationType;
  title: string;
  description: string | null;
  term: ApplicationTerm;
  year: number;
  status: ApplicationFormStatus;
  opens_at: string | null;
  closes_at: string | null;
  effective_open: boolean;
}

export async function getApplicationFormSummaries(): Promise<ApplicationFormSummary[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("application_forms")
    .select(
      "id, committee_id, application_type, title, description, term, year, status, opens_at, closes_at, committees(name, slug)"
    )
    .neq("status", "draft")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row: Record<string, unknown>) => {
    const c = row.committees as Record<string, string> | null;
    const status = row.status as ApplicationFormStatus;
    const opens_at = (row.opens_at as string) ?? null;
    const closes_at = (row.closes_at as string) ?? null;
    return {
      id: row.id as string,
      committee_id: row.committee_id as string,
      committee_name: c?.name ?? "",
      committee_slug: c?.slug ?? "",
      application_type: row.application_type as ApplicationType,
      title: row.title as string,
      description: (row.description as string) ?? null,
      term: row.term as ApplicationTerm,
      year: row.year as number,
      status,
      opens_at,
      closes_at,
      effective_open: isFormEffectivelyOpen({ status, opens_at, closes_at }),
    };
  });
}

export interface ApplicationSubmission {
  id: string;
  form_id: string;
  form_title: string;
  committee_name: string;
  committee_slug: string;
  application_type: ApplicationType;
  term: ApplicationTerm;
  year: number;
  show_director_toggle: boolean;
  questions: ApplicationQuestion[];
  answers: Record<string, unknown>;
  resume_path: string | null;
  wants_director: boolean | null;
  status: SubmissionStatus;
  submitted_at: string;
}

const APPLICATION_SUBMISSION_SELECT =
  "id, form_id, answers, resume_path, wants_director, status, submitted_at, application_forms(title, application_type, term, year, show_director_toggle, questions, committees(name, slug))";

function dbRowToApplicationSubmission(row: Record<string, unknown>): ApplicationSubmission {
  const form = row.application_forms as Record<string, unknown>;
  const c = form.committees as Record<string, string> | null;
  return {
    id: row.id as string,
    form_id: row.form_id as string,
    form_title: form.title as string,
    committee_name: c?.name ?? "",
    committee_slug: c?.slug ?? "",
    application_type: form.application_type as ApplicationType,
    term: form.term as ApplicationTerm,
    year: form.year as number,
    show_director_toggle: form.show_director_toggle as boolean,
    questions: (form.questions as ApplicationQuestion[]) ?? [],
    answers: (row.answers as Record<string, unknown>) ?? {},
    resume_path: (row.resume_path as string) ?? null,
    wants_director: (row.wants_director as boolean) ?? null,
    status: row.status as SubmissionStatus,
    submitted_at: row.submitted_at as string,
  };
}

export async function getMyApplication(applicantId: string, formId: string): Promise<ApplicationSubmission | null> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SUBMISSION_SELECT)
    .eq("applicant_id", applicantId)
    .eq("form_id", formId)
    .maybeSingle();
  if (error || !data) return null;
  return dbRowToApplicationSubmission(data);
}

export const APPLICANT_STATUS_LABEL: Record<SubmissionStatus, string> = {
  submitted: "Under review",
  under_review: "Under review",
  waitlisted: "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  waitlisted: "Waitlisted",
  accepted: "Accepted",
  rejected: "Rejected",
};

const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export async function uploadResume(formId: string, applicantId: string, file: File): Promise<string> {
  // === SUPABASE SWAP POINT ===
  if (file.type !== "application/pdf") throw new Error("Resume must be a PDF file.");
  if (file.size > RESUME_MAX_BYTES) throw new Error("Resume must be smaller than 5MB.");
  const path = `${formId}/${applicantId}/resume.pdf`;
  const { error } = await supabase.storage
    .from("resumes")
    .upload(path, file, { upsert: true, contentType: "application/pdf" });
  if (error) throw new Error(error.message);
  return path;
}

export async function getResumeSignedUrl(resumePath: string): Promise<string | null> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase.storage.from("resumes").createSignedUrl(resumePath, 300);
  if (error || !data) return null;
  return data.signedUrl;
}

export interface ApplicationSubmissionInput {
  form_id: string;
  answers: Record<string, unknown>;
  wants_director: boolean | null;
  resume_path: string | null;
}

export async function submitApplication(applicantId: string, input: ApplicationSubmissionInput): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("applications").insert({
    form_id: input.form_id,
    applicant_id: applicantId,
    answers: input.answers,
    wants_director: input.wants_director,
    resume_path: input.resume_path,
  });
  if (error) {
    if (error.code === "23505") throw new Error("You've already submitted an application for this form.");
    throw new Error(error.message);
  }
  await logAuditEvent("application.submit", "application", input.form_id);

  // Write answers marked save_back into the applicant's profile.
  const form = await getApplicationFormDetail(input.form_id);
  const profileUpdates: Record<string, string> = {};
  for (const q of form?.questions ?? []) {
    if (!q.save_back) continue;
    const value = input.answers[q.id];
    if (typeof value === "string" && value.trim()) {
      profileUpdates[q.save_back] = value.trim();
    }
  }
  if (Object.keys(profileUpdates).length > 0) {
    await supabase.from("profiles").update(profileUpdates).eq("id", applicantId);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Application forms - reviewer flow (admin / committee director)
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminApplicationSubmission {
  id: string;
  form_id: string;
  applicant_id: string;
  applicant_name: string;
  applicant_email: string;
  answers: Record<string, unknown>;
  resume_path: string | null;
  wants_director: boolean | null;
  status: SubmissionStatus;
  reviewer_notes: string | null;
  reviewed_by: string | null;
  submitted_at: string;
}

const ADMIN_APPLICATION_SUBMISSION_SELECT =
  "id, form_id, applicant_id, answers, resume_path, wants_director, status, reviewer_notes, reviewed_by, submitted_at, applicant:profiles!applications_applicant_id_fkey(full_name, email)";

export async function getApplicationsForForm(formId: string): Promise<AdminApplicationSubmission[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("applications")
    .select(ADMIN_APPLICATION_SUBMISSION_SELECT)
    .eq("form_id", formId)
    .order("submitted_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row: Record<string, unknown>) => {
    const p = row.applicant as Record<string, string> | null;
    return {
      id: row.id as string,
      form_id: row.form_id as string,
      applicant_id: row.applicant_id as string,
      applicant_name: p?.full_name ?? "-",
      applicant_email: p?.email ?? "-",
      answers: (row.answers as Record<string, unknown>) ?? {},
      resume_path: (row.resume_path as string) ?? null,
      wants_director: (row.wants_director as boolean) ?? null,
      status: row.status as SubmissionStatus,
      reviewer_notes: (row.reviewer_notes as string) ?? null,
      reviewed_by: (row.reviewed_by as string) ?? null,
      submitted_at: row.submitted_at as string,
    };
  });
}

export interface ApplicationReviewUpdate {
  status?: SubmissionStatus;
  reviewer_notes?: string | null;
}

export async function updateApplicationReview(
  applicationId: string,
  reviewerId: string,
  update: ApplicationReviewUpdate
): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const payload: Record<string, unknown> = { reviewed_by: reviewerId, updated_at: new Date().toISOString() };
  if (update.status !== undefined) payload.status = update.status;
  if (update.reviewer_notes !== undefined) payload.reviewer_notes = update.reviewer_notes;
  const { error } = await supabase.from("applications").update(payload).eq("id", applicationId);
  if (error) throw new Error(error.message);
  await logAuditEvent("application.review", "application", applicationId, update);
}

// One column per question label, plus applicant/status/submitted columns.
// Triggers a browser download of the generated CSV.
export function exportApplicationsCsv(form: ApplicationFormDetail, submissions: AdminApplicationSubmission[]): void {
  const headers = ["Name", "Email", "Status", "Submitted", ...form.questions.map((q) => q.label)];
  const rows = submissions.map((s) =>
    [
      s.applicant_name,
      s.applicant_email,
      SUBMISSION_STATUS_LABEL[s.status],
      new Date(s.submitted_at).toISOString(),
      ...form.questions.map((q) => {
        if (q.type === "file") return s.resume_path ? "Yes" : "No";
        const value = s.answers[q.id];
        if (value == null) return "";
        if (q.type === "toggle") return value ? "Yes" : "No";
        if (q.type === "slider" && typeof value === "number") {
          return q.slider?.unit ? `${value} ${q.slider.unit}` : String(value);
        }
        return String(value);
      }),
    ].map(csvEscape)
  );
  const csv = [headers.map(csvEscape), ...rows].map((r) => r.join(",")).join("\r\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${form.title.replace(/\s+/g, "_")}-submissions.csv`);
}

function csvEscape(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

// Bundles every submitted resume into a zip for offline review.
export async function exportFormResumesZip(submissions: AdminApplicationSubmission[]): Promise<Blob> {
  const zip = new JSZip();
  for (const s of submissions) {
    if (!s.resume_path) continue;
    const url = await getResumeSignedUrl(s.resume_path);
    if (!url) continue;
    const res = await fetch(url);
    const blob = await res.blob();
    const safeName = s.applicant_name.trim().replace(/[^a-z0-9]+/gi, "_") || s.applicant_id.slice(0, 8);
    zip.file(`${safeName}.pdf`, blob);
  }
  return zip.generateAsync({ type: "blob" });
}

// ─────────────────────────────────────────────────────────────────────────────
// Member portal  (live against Supabase - requires auth)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserCommittee {
  committee_id: string;
  committee_name: string;
  committee_slug: string;
  role: "member" | "officer" | "director";
}

export interface AttendanceRecord {
  event_title: string;
  bits_awarded: number;
  checked_in_at: string;
}

export interface UserActivity {
  total_points: number;
  events_attended: number;
  recent: AttendanceRecord[];
}

export async function getUserCommittees(userId: string): Promise<UserCommittee[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("committee_roles")
    .select("committee_id, role, committees(name, slug)")
    .eq("user_id", userId);
  if (error) return [];
  return (data ?? []).map((r: Record<string, unknown>) => {
    const c = r.committees as Record<string, string>;
    return {
      committee_id: r.committee_id as string,
      committee_name: c?.name ?? "",
      committee_slug: c?.slug ?? "",
      role: r.role as UserCommittee["role"],
    };
  });
}

// Date-driven "current semester" (Fall = Aug-Dec, Spring = Jan-May, no active
// semester in June/July). Auto-creates and activates term rows on first
// access each period - see current_semester_term_id() in
// 003_admin_polish.sql.
export async function getCurrentSemesterTermId(): Promise<string | null> {
  const { data, error } = await supabase.rpc("current_semester_term_id");
  if (error) return null;
  return (data as string | null) ?? null;
}

export async function getUserActivity(userId: string): Promise<UserActivity> {
  // === SUPABASE SWAP POINT ===
  const termId = await getCurrentSemesterTermId();

  const [ptsResult, attResult] = await Promise.all([
    termId
      ? supabase
          .from("point_transactions")
          .select("amount")
          .eq("user_id", userId)
          .eq("semester_term_id", termId)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("attendance")
      .select("bits_awarded, checked_in_at, events(title)")
      .eq("user_id", userId)
      .order("checked_in_at", { ascending: false })
      .limit(8),
  ]);

  const pts = ptsResult.data ?? [];
  const att = attResult.data ?? [];

  return {
    total_points: pts.reduce((s: number, p: Record<string, number>) => s + (p.amount ?? 0), 0),
    events_attended: att.length,
    recent: att.map((a: Record<string, unknown>) => {
      const ev = a.events as Record<string, string> | null;
      return {
        event_title: ev?.title ?? "-",
        bits_awarded: (a.bits_awarded as number) ?? 0,
        checked_in_at: a.checked_in_at as string,
      };
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Teams & mentorship  (live against Supabase - requires auth)
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
}

export interface UserTeam {
  team_id: string;
  team_name: string;
  committee_name: string;
  committee_slug: string;
  is_lead: boolean;
  members: TeamMember[];
}

export async function getUserTeams(userId: string): Promise<UserTeam[]> {
  // === SUPABASE SWAP POINT ===
  const { data: memberships } = await supabase
    .from("team_memberships")
    .select("team_id")
    .eq("user_id", userId);
  if (!memberships || memberships.length === 0) return [];

  const teamIds = memberships.map((m: Record<string, unknown>) => m.team_id);

  const { data: teams, error } = await supabase
    .from("teams")
    .select("id, name, lead_user_id, committees(name, slug), team_memberships(user_id, profiles(id, full_name))")
    .in("id", teamIds);
  if (error || !teams) return [];

  return teams.map((t: Record<string, unknown>) => {
    const c = t.committees as Record<string, string> | null;
    const memberships = (t.team_memberships as Record<string, unknown>[]) ?? [];
    const members: TeamMember[] = memberships.map((m) => {
      const p = m.profiles as Record<string, string> | null;
      return { id: p?.id ?? "", name: p?.full_name ?? "-" };
    });
    return {
      team_id: t.id as string,
      team_name: t.name as string,
      committee_name: c?.name ?? "",
      committee_slug: c?.slug ?? "",
      is_lead: t.lead_user_id === userId,
      members,
    };
  });
}

export interface MentorshipPairing {
  id: string;
  role: "mentor" | "mentee";
  partner_name: string;
}

export async function getUserMentorship(userId: string): Promise<MentorshipPairing[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("mentor_mentee_pairings")
    .select(`
      id, mentor_user_id, mentee_user_id,
      mentor:profiles!mentor_mentee_pairings_mentor_user_id_fkey(full_name),
      mentee:profiles!mentor_mentee_pairings_mentee_user_id_fkey(full_name)
    `)
    .or(`mentor_user_id.eq.${userId},mentee_user_id.eq.${userId}`);
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => {
    const isMentor = r.mentor_user_id === userId;
    const mentor = r.mentor as Record<string, string> | null;
    const mentee = r.mentee as Record<string, string> | null;
    return {
      id: r.id as string,
      role: isMentor ? "mentor" : "mentee",
      partner_name: (isMentor ? mentee?.full_name : mentor?.full_name) ?? "-",
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Profiles  (live against Supabase - no mock data)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProfileUpdate {
  full_name?: string;
  display_name?: string | null;
  major?: string | null;
  grad_year?: number | null;
  classification?: string | null;
  pronouns?: string | null;
  discord_joined?: boolean;
  instagram_joined?: boolean;
  onboarded?: boolean;
  phone?: string | null;
  student_id?: string | null;
  discord_username?: string | null;
  linkedin?: string | null;
  github?: string | null;
  instagram_handle?: string | null;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth-adjacent  (now live against Supabase)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  major?: string;
  gradYear?: string;
  committeeIds: string[];
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  // === SUPABASE SWAP POINT ===
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!data) return null;
  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    major: data.major ?? undefined,
    gradYear: data.grad_year?.toString(),
    committeeIds: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin - Events & QR  (Stage 7a)
// ─────────────────────────────────────────────────────────────────────────────

export interface DirectedCommittee {
  committee_id: string;
  name: string;
  slug: string;
}

export async function getDirectedCommittees(userId: string): Promise<DirectedCommittee[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("committee_roles")
    .select("committee_id, committees(name, slug)")
    .eq("user_id", userId)
    .eq("role", "director");
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => {
    const c = r.committees as Record<string, string> | null;
    return {
      committee_id: r.committee_id as string,
      name: c?.name ?? "",
      slug: c?.slug ?? "",
    };
  });
}

// True if the user holds an officer or director role on any committee (used
// to gate the officer-only leaderboard).
export async function hasOfficerRole(userId: string): Promise<boolean> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("committee_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["officer", "director"])
    .limit(1);
  if (error) return false;
  return (data?.length ?? 0) > 0;
}

export interface CommitteeOption {
  id: string;
  name: string;
  slug: string;
}

export async function getCommitteeOptions(): Promise<CommitteeOption[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("committees")
    .select("id, name, slug")
    .order("sort_order");
  if (error || !data) return [];
  return data as CommitteeOption[];
}

export interface EventCategory {
  id: string;
  name: string;
  bit_value: number;
  description: string | null;
}

export async function getEventCategories(): Promise<EventCategory[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("event_categories")
    .select("id, name, bit_value, description")
    .order("bit_value", { ascending: false });
  if (error || !data) return [];
  return data as EventCategory[];
}

export async function createEventCategory(input: {
  name: string;
  bit_value: number;
  description?: string | null;
}): Promise<EventCategory> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("event_categories")
    .insert({ name: input.name, bit_value: input.bit_value, description: input.description ?? null })
    .select("id, name, bit_value, description")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create category");
  await logAuditEvent("event_category.create", "event_category", data.id as string, { name: input.name, bit_value: input.bit_value });
  return data as EventCategory;
}

export async function updateEventCategory(
  id: string,
  updates: Partial<{ name: string; bit_value: number; description: string | null }>
): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("event_categories").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  await logAuditEvent("event_category.update", "event_category", id, updates);
}

export async function deleteEventCategory(id: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("event_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logAuditEvent("event_category.delete", "event_category", id);
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  committee_id: string | null;
  committee_name: string | null;
  qr_token: string;
  qr_expires_at: string;
  categories: string[];
  category_ids: string[];
}

function dbRowToAdminEvent(row: Record<string, unknown>): AdminEvent {
  const c = row.committees as Record<string, string> | null;
  const assignments = (row.event_category_assignments as Record<string, unknown>[]) ?? [];
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    location: (row.location as string) ?? "",
    start_time: row.start_time as string,
    end_time: row.end_time as string,
    committee_id: (row.committee_id as string) ?? null,
    committee_name: c?.name ?? null,
    qr_token: row.qr_token as string,
    qr_expires_at: row.qr_expires_at as string,
    categories: assignments
      .map((a) => (a.event_categories as Record<string, string> | null)?.name)
      .filter((n): n is string => !!n),
    category_ids: assignments.map((a) => a.category_id as string).filter((id): id is string => !!id),
  };
}

export async function getAdminEvents(): Promise<AdminEvent[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, description, location, start_time, end_time, committee_id, qr_token, qr_expires_at, committees(name), event_category_assignments(category_id, event_categories(name))"
    )
    .order("start_time", { ascending: false });
  if (error || !data) return [];
  return data.map(dbRowToAdminEvent);
}

export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  committee_id: string | null;
  category_ids: string[];
  recurringWeeks: number;
}

export type UpdateEventInput = Omit<CreateEventInput, "recurringWeeks">;

export async function updateEvent(eventId: string, input: UpdateEventInput): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase
    .from("events")
    .update({
      title: input.title,
      description: input.description || null,
      location: input.location || null,
      start_time: input.start_time,
      end_time: input.end_time,
      committee_id: input.committee_id,
      qr_expires_at: input.end_time,
    })
    .eq("id", eventId);
  if (error) throw new Error(error.message);

  const { error: delError } = await supabase
    .from("event_category_assignments")
    .delete()
    .eq("event_id", eventId);
  if (delError) throw new Error(delError.message);

  if (input.category_ids.length > 0) {
    const { error: insError } = await supabase
      .from("event_category_assignments")
      .insert(input.category_ids.map((categoryId) => ({ event_id: eventId, category_id: categoryId })));
    if (insError) throw new Error(insError.message);
  }

  await logAuditEvent("event.update", "event", eventId, { title: input.title });
}

export async function createEvent(input: CreateEventInput): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const weeks = Math.max(1, input.recurringWeeks);
  const recurrenceGroupId = weeks > 1 ? crypto.randomUUID() : null;
  const start = new Date(input.start_time);
  const end = new Date(input.end_time);

  const rows = Array.from({ length: weeks }, (_, i) => {
    const offsetMs = i * 7 * 24 * 60 * 60 * 1000;
    const rowStart = new Date(start.getTime() + offsetMs);
    const rowEnd = new Date(end.getTime() + offsetMs);
    return {
      title: input.title,
      description: input.description || null,
      location: input.location || null,
      start_time: rowStart.toISOString(),
      end_time: rowEnd.toISOString(),
      committee_id: input.committee_id,
      qr_expires_at: rowEnd.toISOString(),
      recurrence_group_id: recurrenceGroupId,
    };
  });

  const { data: created, error } = await supabase.from("events").insert(rows).select("id");
  if (error) throw new Error(error.message);

  if (input.category_ids.length > 0 && created) {
    const assignments = (created as { id: string }[]).flatMap((e) =>
      input.category_ids.map((categoryId) => ({ event_id: e.id, category_id: categoryId }))
    );
    const { error: ecaError } = await supabase.from("event_category_assignments").insert(assignments);
    if (ecaError) throw new Error(ecaError.message);
  }

  const firstId = (created as { id: string }[] | null)?.[0]?.id ?? null;
  await logAuditEvent("event.create", "event", firstId, { title: input.title, count: rows.length });
}

export async function deleteEvent(eventId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) throw new Error(error.message);
  await logAuditEvent("event.delete", "event", eventId);
}

export interface EventAttendee {
  user_id: string;
  name: string;
  email: string;
  bits_awarded: number;
  checked_in_at: string;
}

export async function getEventAttendees(eventId: string): Promise<EventAttendee[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("attendance")
    .select("user_id, bits_awarded, checked_in_at, profiles(full_name, email)")
    .eq("event_id", eventId)
    .order("checked_in_at");
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => {
    const p = r.profiles as Record<string, string> | null;
    return {
      user_id: r.user_id as string,
      name: p?.full_name ?? "-",
      email: p?.email ?? "-",
      bits_awarded: (r.bits_awarded as number) ?? 0,
      checked_in_at: r.checked_in_at as string,
    };
  });
}

export interface AdminCheckInResult {
  ok: boolean;
  bits_awarded?: number;
  event_title?: string;
  error?: "invalid_token" | "already_checked_in";
}

export async function adminCheckIn(eventId: string, userId: string): Promise<AdminCheckInResult> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase.rpc("admin_check_in", { p_event_id: eventId, p_user_id: userId });
  if (error) throw new Error(error.message);
  const result = data as AdminCheckInResult;
  if (result.ok) {
    await logAuditEvent("event.manual_checkin", "event", eventId, { user_id: userId });
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin - role assignment & application deletion
// ─────────────────────────────────────────────────────────────────────────────

export type CommitteeRoleType = "member" | "officer" | "director";

export async function deleteApplication(applicationId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("applications").delete().eq("id", applicationId);
  if (error) throw new Error(error.message);
  await logAuditEvent("application.delete", "application", applicationId);
}

export async function assignCommitteeRole(
  userId: string,
  committeeId: string,
  role: CommitteeRoleType,
  assignedBy: string
): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase
    .from("committee_roles")
    .upsert(
      { user_id: userId, committee_id: committeeId, role, assigned_by: assignedBy, assigned_at: new Date().toISOString() },
      { onConflict: "user_id,committee_id" }
    );
  if (error) throw new Error(error.message);
  await logAuditEvent("committee_role.assign", "profile", userId, { committee_id: committeeId, role });
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin - Member manager + team / mentorship matching  (Stage 7c)
// ─────────────────────────────────────────────────────────────────────────────

export interface CommitteeMember {
  user_id: string;
  name: string;
  email: string;
  role: CommitteeRoleType;
  assigned_at: string;
}

const ROLE_SORT_ORDER: Record<CommitteeRoleType, number> = { director: 0, officer: 1, member: 2 };

export async function getCommitteeMembers(committeeId: string): Promise<CommitteeMember[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("committee_roles")
    .select("user_id, role, assigned_at, member:profiles!committee_roles_user_id_fkey(full_name, email)")
    .eq("committee_id", committeeId);
  if (error || !data) return [];
  return data
    .map((r: Record<string, unknown>) => {
      const p = r.member as Record<string, string> | null;
      return {
        user_id: r.user_id as string,
        name: p?.full_name ?? "-",
        email: p?.email ?? "-",
        role: r.role as CommitteeRoleType,
        assigned_at: r.assigned_at as string,
      };
    })
    .sort((a, b) => ROLE_SORT_ORDER[a.role] - ROLE_SORT_ORDER[b.role] || a.name.localeCompare(b.name));
}

export async function removeCommitteeRole(userId: string, committeeId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase
    .from("committee_roles")
    .delete()
    .eq("user_id", userId)
    .eq("committee_id", committeeId);
  if (error) throw new Error(error.message);
  await logAuditEvent("committee_role.remove", "profile", userId, { committee_id: committeeId });
}

export interface ProfileLookup {
  id: string;
  name: string;
  email: string;
}

export async function findProfileByEmail(email: string): Promise<ProfileLookup | null> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .ilike("email", email.trim())
    .maybeSingle();
  if (error || !data) return null;
  return { id: data.id as string, name: data.full_name as string, email: data.email as string };
}

export interface AdminTeamMember {
  user_id: string;
  name: string;
}

export interface AdminTeam {
  id: string;
  name: string;
  committee_id: string;
  lead_user_id: string | null;
  lead_name: string | null;
  members: AdminTeamMember[];
}

function dbRowToAdminTeam(row: Record<string, unknown>): AdminTeam {
  const lead = row.lead as Record<string, string> | null;
  const memberships = (row.team_memberships as Record<string, unknown>[]) ?? [];
  return {
    id: row.id as string,
    name: row.name as string,
    committee_id: row.committee_id as string,
    lead_user_id: (row.lead_user_id as string) ?? null,
    lead_name: lead?.full_name ?? null,
    members: memberships.map((m) => {
      const p = m.profiles as Record<string, string> | null;
      return { user_id: m.user_id as string, name: p?.full_name ?? "-" };
    }),
  };
}

export async function getAdminTeams(committeeId: string): Promise<AdminTeam[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("teams")
    .select(
      "id, name, committee_id, lead_user_id, lead:profiles!teams_lead_user_id_fkey(full_name), team_memberships(user_id, profiles(full_name))"
    )
    .eq("committee_id", committeeId)
    .order("created_at");
  if (error || !data) return [];
  return data.map(dbRowToAdminTeam);
}

export async function createTeam(committeeId: string, name: string, leadUserId: string | null): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("teams")
    .insert({ committee_id: committeeId, name, lead_user_id: leadUserId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await logAuditEvent("team.create", "team", data?.id ?? null, { committee_id: committeeId, name });
}

export async function deleteTeam(teamId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("teams").delete().eq("id", teamId);
  if (error) throw new Error(error.message);
  await logAuditEvent("team.delete", "team", teamId);
}

export async function setTeamLead(teamId: string, leadUserId: string | null): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("teams").update({ lead_user_id: leadUserId }).eq("id", teamId);
  if (error) throw new Error(error.message);
  await logAuditEvent("team.set_lead", "team", teamId, { lead_user_id: leadUserId });
}

export async function addTeamMember(teamId: string, userId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("team_memberships").insert({ team_id: teamId, user_id: userId });
  if (error) throw new Error(error.message);
  await logAuditEvent("team_membership.add", "team", teamId, { user_id: userId });
}

export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase
    .from("team_memberships")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  await logAuditEvent("team_membership.remove", "team", teamId, { user_id: userId });
}

export interface MentorshipCandidate {
  user_id: string;
  name: string;
  email: string;
}

export async function getMentorshipCandidates(role: "mentor" | "mentee"): Promise<MentorshipCandidate[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("applications")
    .select(
      "applicant_id, applicant:profiles!applications_applicant_id_fkey(full_name, email), application_forms!inner(application_type, committees!inner(slug))"
    )
    .eq("status", "accepted")
    .eq("application_forms.application_type", role)
    .eq("application_forms.committees.slug", "educate");
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => {
    const p = r.applicant as Record<string, string> | null;
    return { user_id: r.applicant_id as string, name: p?.full_name ?? "-", email: p?.email ?? "-" };
  });
}

export interface AdminPairing {
  id: string;
  mentor_user_id: string;
  mentor_name: string;
  mentor_email: string;
  mentee_user_id: string;
  mentee_name: string;
  mentee_email: string;
}

export async function getAdminPairings(): Promise<AdminPairing[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("mentor_mentee_pairings")
    .select(
      "id, mentor_user_id, mentee_user_id, mentor:profiles!mentor_mentee_pairings_mentor_user_id_fkey(full_name, email), mentee:profiles!mentor_mentee_pairings_mentee_user_id_fkey(full_name, email)"
    );
  if (error || !data) return [];
  return data
    .map((r: Record<string, unknown>) => {
      const mentor = r.mentor as Record<string, string> | null;
      const mentee = r.mentee as Record<string, string> | null;
      return {
        id: r.id as string,
        mentor_user_id: r.mentor_user_id as string,
        mentor_name: mentor?.full_name ?? "-",
        mentor_email: mentor?.email ?? "-",
        mentee_user_id: r.mentee_user_id as string,
        mentee_name: mentee?.full_name ?? "-",
        mentee_email: mentee?.email ?? "-",
      };
    })
    .sort((a, b) => a.mentor_name.localeCompare(b.mentor_name) || a.mentee_name.localeCompare(b.mentee_name));
}

export async function createPairing(mentorUserId: string, menteeUserId: string, pairedBy: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("mentor_mentee_pairings")
    .insert({ mentor_user_id: mentorUserId, mentee_user_id: menteeUserId, paired_by: pairedBy })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await logAuditEvent("mentorship.pair", "mentor_mentee_pairing", data?.id ?? null, {
    mentor_user_id: mentorUserId,
    mentee_user_id: menteeUserId,
  });
}

export async function deletePairing(id: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const { error } = await supabase.from("mentor_mentee_pairings").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logAuditEvent("mentorship.unpair", "mentor_mentee_pairing", id);
}

export interface RosterMember {
  id: string;
  name: string;
  email: string;
  major: string | null;
  grad_year: number | null;
  is_admin: boolean;
  is_alumni: boolean;
  onboarded: boolean;
  discord_joined: boolean;
  instagram_joined: boolean;
  created_at: string;
  total_points: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin - Org dashboard & audit log  (Stage 7d)
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  actor_name: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AuditLogPage {
  entries: AuditLogEntry[];
  total: number;
}

export async function getAuditLog(
  { limit = 25, offset = 0, action = null }: { limit?: number; offset?: number; action?: string | null } = {}
): Promise<AuditLogPage> {
  // === SUPABASE SWAP POINT ===
  let query = supabase
    .from("audit_log")
    .select("id, action, entity_type, entity_id, metadata, created_at, profiles(full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (action) query = query.eq("action", action);

  const { data, error, count } = await query;
  if (error || !data) return { entries: [], total: 0 };
  return {
    entries: data.map((r: Record<string, unknown>) => {
      const p = r.profiles as Record<string, string> | null;
      return {
        id: r.id as string,
        actor_name: p?.full_name ?? null,
        action: r.action as string,
        entity_type: (r.entity_type as string) ?? null,
        entity_id: (r.entity_id as string) ?? null,
        metadata: (r.metadata as Record<string, unknown>) ?? {},
        created_at: r.created_at as string,
      };
    }),
    total: count ?? 0,
  };
}

// Best-effort: failures here never block the admin action that triggered them.
async function logAuditEvent(
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  // === SUPABASE SWAP POINT ===
  await supabase.rpc("log_admin_action", {
    p_action: action,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_metadata: metadata,
  });
}

export interface CommitteeBreakdown {
  committee_id: string;
  name: string;
  member_count: number;
}

export interface OrgStats {
  total_members: number;
  pending_applications: number;
  upcoming_events: number;
  points_this_term: number;
  committee_breakdown: CommitteeBreakdown[];
}

// Pass null for org-wide (admin); pass a list of directed committee ids to
// scope the stats to a director's committees.
export async function getOrgStats(committeeIds: string[] | null): Promise<OrgStats> {
  // === SUPABASE SWAP POINT ===
  let rolesQuery = supabase.from("committee_roles").select("user_id, committee_id, committees(name)");
  if (committeeIds) rolesQuery = rolesQuery.in("committee_id", committeeIds);
  const { data: roles } = await rolesQuery;

  const termId = await getCurrentSemesterTermId();

  let pointsThisTerm = 0;
  if (termId) {
    let pointsQuery = supabase.from("point_transactions").select("amount").eq("semester_term_id", termId);
    if (committeeIds) pointsQuery = pointsQuery.in("committee_id", committeeIds);
    const { data: points } = await pointsQuery;
    pointsThisTerm = (points ?? []).reduce((s: number, p: Record<string, number>) => s + (p.amount ?? 0), 0);
  }

  let pendingQuery = supabase
    .from("applications")
    .select("id, application_forms!inner(committee_id)", { count: "exact", head: true })
    .eq("status", "submitted");
  if (committeeIds) pendingQuery = pendingQuery.in("application_forms.committee_id", committeeIds);

  const [{ count: pendingCount }, events] = await Promise.all([pendingQuery, getAdminEvents()]);

  const now = Date.now();
  const upcomingEvents = events.filter((e) => {
    if (new Date(e.end_time).getTime() < now) return false;
    if (!committeeIds) return true;
    return e.committee_id === null || committeeIds.includes(e.committee_id);
  });

  const breakdown = new Map<string, CommitteeBreakdown>();
  const memberIds = new Set<string>();
  (roles ?? []).forEach((r: Record<string, unknown>) => {
    const cid = r.committee_id as string;
    const c = r.committees as Record<string, string> | null;
    memberIds.add(r.user_id as string);
    const existing = breakdown.get(cid);
    if (existing) existing.member_count += 1;
    else breakdown.set(cid, { committee_id: cid, name: c?.name ?? "-", member_count: 1 });
  });

  return {
    total_members: memberIds.size,
    pending_applications: pendingCount ?? 0,
    upcoming_events: upcomingEvents.length,
    points_this_term: pointsThisTerm,
    committee_breakdown: Array.from(breakdown.values()).sort((a, b) => b.member_count - a.member_count),
  };
}

export async function getRoster(): Promise<RosterMember[]> {
  // === SUPABASE SWAP POINT ===
  const [{ data, error }, { data: pts }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, email, major, grad_year, is_admin, is_alumni, onboarded, discord_joined, instagram_joined, created_at"
      )
      .order("full_name"),
    supabase.from("point_transactions").select("user_id, amount"),
  ]);
  if (error || !data) return [];

  const totals = new Map<string, number>();
  (pts ?? []).forEach((p: Record<string, unknown>) => {
    const uid = p.user_id as string;
    totals.set(uid, (totals.get(uid) ?? 0) + ((p.amount as number) ?? 0));
  });

  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    name: r.full_name as string,
    email: r.email as string,
    major: (r.major as string) ?? null,
    grad_year: (r.grad_year as number) ?? null,
    is_admin: r.is_admin as boolean,
    is_alumni: r.is_alumni as boolean,
    onboarded: r.onboarded as boolean,
    discord_joined: r.discord_joined as boolean,
    instagram_joined: r.instagram_joined as boolean,
    created_at: r.created_at as string,
    total_points: totals.get(r.id as string) ?? 0,
  }));
}

export interface MemberCommitteeMembership {
  committee_id: string;
  committee_name: string;
  committee_slug: string;
  role: CommitteeRoleType;
  assigned_at: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  major: string | null;
  classification: string | null;
  pronouns: string | null;
  grad_year: number | null;
  is_admin: boolean;
  is_alumni: boolean;
  created_at: string;
  total_points: number;
  committees: MemberCommitteeMembership[];
}

export async function getMemberProfile(userId: string): Promise<MemberProfile | null> {
  // === SUPABASE SWAP POINT ===
  const [{ data: profile, error }, { data: roles }, { data: pts }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, major, classification, pronouns, grad_year, is_admin, is_alumni, created_at")
      .eq("id", userId)
      .single(),
    supabase
      .from("committee_roles")
      .select("committee_id, role, assigned_at, committees(name, slug)")
      .eq("user_id", userId),
    supabase.from("point_transactions").select("amount").eq("user_id", userId),
  ]);
  if (error || !profile) return null;

  const committees: MemberCommitteeMembership[] = (roles ?? []).map((r: Record<string, unknown>) => {
    const c = r.committees as Record<string, string> | null;
    return {
      committee_id: r.committee_id as string,
      committee_name: c?.name ?? "-",
      committee_slug: c?.slug ?? "",
      role: r.role as CommitteeRoleType,
      assigned_at: r.assigned_at as string,
    };
  });

  return {
    id: profile.id as string,
    name: profile.full_name as string,
    email: profile.email as string,
    major: (profile.major as string) ?? null,
    classification: (profile.classification as string) ?? null,
    pronouns: (profile.pronouns as string) ?? null,
    grad_year: (profile.grad_year as number) ?? null,
    is_admin: profile.is_admin as boolean,
    is_alumni: profile.is_alumni as boolean,
    created_at: profile.created_at as string,
    total_points: (pts ?? []).reduce((s: number, p: Record<string, number>) => s + (p.amount ?? 0), 0),
    committees,
  };
}

export async function awardPoints(
  userId: string,
  amount: number,
  reason: string,
  awardedBy: string,
  committeeId: string | null = null
): Promise<void> {
  // === SUPABASE SWAP POINT ===
  const termId = await getCurrentSemesterTermId();

  const { error } = await supabase.from("point_transactions").insert({
    user_id: userId,
    amount,
    reason,
    source_type: "manual",
    committee_id: committeeId,
    semester_term_id: termId,
    created_by: awardedBy,
  });
  if (error) throw new Error(error.message);
  await logAuditEvent("points.award", "profile", userId, { amount, reason });
}

// ─────────────────────────────────────────────────────────────────────────────
// Member portal - Leaderboard & notifications  (Stage 8)
// ─────────────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  total_points: number;
  rank: number;
}

export type LeaderboardScope = "term" | "all_time";

export async function getLeaderboard(scope: LeaderboardScope = "term"): Promise<LeaderboardEntry[]> {
  // === SUPABASE SWAP POINT ===
  let termId: string | null = null;
  if (scope === "term") {
    termId = await getCurrentSemesterTermId();
    if (!termId) return [];
  }

  const { data, error } = await supabase.rpc("get_leaderboard", { p_term_id: termId });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((r) => ({
    user_id: r.user_id as string,
    name: r.full_name as string,
    total_points: Number(r.total_points),
    rank: Number(r.rank),
  }));
}

// Leaderboard scoped to officers/directors/admins. Server-side RPC also
// self-gates: a member calling this directly gets an empty result.
export async function getOfficerLeaderboard(scope: LeaderboardScope = "term"): Promise<LeaderboardEntry[]> {
  // === SUPABASE SWAP POINT ===
  let termId: string | null = null;
  if (scope === "term") {
    termId = await getCurrentSemesterTermId();
    if (!termId) return [];
  }

  const { data, error } = await supabase.rpc("get_officer_leaderboard", { p_term_id: termId });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((r) => ({
    user_id: r.user_id as string,
    name: r.full_name as string,
    total_points: Number(r.total_points),
    rank: Number(r.rank),
  }));
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications(userId: string, limit = 30): Promise<AppNotification[]> {
  // === SUPABASE SWAP POINT ===
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, link, is_read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as AppNotification[];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  // === SUPABASE SWAP POINT ===
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) return 0;
  return count ?? 0;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  // === SUPABASE SWAP POINT ===
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}
