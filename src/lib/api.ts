/**
 * src/lib/api.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * THE single data-access seam for the entire app.
 * Components call these async functions and never import from src/data/ directly.
 *
 * Today every function returns mock data.
 * To go live with Supabase, replace ONLY the function bodies marked
 * "=== SUPABASE SWAP POINT ===" — zero changes to any component.
 *
 * Shape notes:
 *  • committee_id fields mirror Supabase FK conventions (snake_case).
 *  • All functions are async so call-sites already handle promises / loading
 *    and won't need to change when real network calls land.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { committeesData, type Committee }   from "@/data/committees";
import { projectsData,   type Project }     from "@/data/projects";
import { eventsData,     type EventItem }   from "@/data/events";
import { albumsData,     type PhotoAlbum }  from "@/data/gallery";
import { officersData,   type Officer }     from "@/data/officers";
import { alumniData,     type Alumni }      from "@/data/alumni";
import { newsData,       type NewsItem }    from "@/data/news";
import { sponsorsData,   type Sponsor }     from "@/data/sponsors";
import { statsData,      type Stat }        from "@/data/stats";

// Re-export types so consumers import from one place.
export type { Committee, Project, EventItem, PhotoAlbum, Officer, Alumni, NewsItem, Sponsor, Stat };

// Simulated async delay of 0 ms (mirrors real network call shape without
// introducing artificial latency).  Replace with `await supabase...` calls.
const resolve = <T>(value: T): Promise<T> => Promise.resolve(value);

// ─────────────────────────────────────────────────────────────────────────────
// Committees
// ─────────────────────────────────────────────────────────────────────────────

export async function getCommittees(): Promise<Committee[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('committees').select('*').order('name');
  // if (error) throw error;
  // return data as Committee[];
  return resolve(committeesData);
}

export async function getCommittee(slug: string): Promise<Committee | null> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('committees').select('*').eq('slug', slug).single();
  // if (error) return null;
  // return data as Committee;
  return resolve(committeesData.find((c) => c.slug === slug) ?? null);
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

export async function getEvents(): Promise<EventItem[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('events').select('*').order('start_time');
  // if (error) throw error;
  // return data as EventItem[];
  return resolve(eventsData);
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

export async function getAlbum(id: string): Promise<PhotoAlbum | null> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('photo_albums').select('*').eq('id', id).single();
  // if (error) return null;
  // return data as PhotoAlbum;
  return resolve(albumsData.find((a) => a.id === id) ?? null);
}

// ─────────────────────────────────────────────────────────────────────────────
// Officers & Alumni
// ─────────────────────────────────────────────────────────────────────────────

export async function getOfficers(): Promise<Officer[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('officers').select('*').order('tier').order('name');
  // if (error) throw error;
  // return data as Officer[];
  return resolve(officersData);
}

export async function getAlumni(): Promise<Alumni[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('alumni').select('*').order('name');
  // if (error) throw error;
  // return data as Alumni[];
  return resolve(alumniData);
}

// ─────────────────────────────────────────────────────────────────────────────
// News / Announcements
// ─────────────────────────────────────────────────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false }).limit(6);
  // if (error) throw error;
  // return data as NewsItem[];
  return resolve(newsData);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sponsors
// ─────────────────────────────────────────────────────────────────────────────

export async function getSponsors(): Promise<Sponsor[]> {
  // === SUPABASE SWAP POINT ===
  // const { data, error } = await supabase.from('sponsors').select('*').order('tier').order('name');
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
// Auth-adjacent data  (future: user profiles, applications, points)
// These are intentional placeholders so the architecture is ready for Supabase
// Auth. Components should call these functions — never access auth state
// directly — so the swap from mock → real is a single-file change here.
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
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) return null;
  // const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  // return data as UserProfile;
  return resolve(null); // always unauthenticated in mock mode
}
