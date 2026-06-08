/* ============================================================================
   src/lib/api.ts  (prototype: api.js)
   ----------------------------------------------------------------------------
   THE single data-access seam. Components call these async functions and never
   touch src/data directly. Today they return mock data; to go live, rewrite ONLY
   the bodies below to query Supabase — zero changes to any component.

       // === SUPABASE SWAP POINT ===
       // export async function getEvents() {
       //   const { data, error } = await supabase
       //     .from('events').select('*').order('start_time');
       //   if (error) throw error;
       //   return data as EventItem[];
       // }

   The mock getters are async on purpose so component call-sites already handle
   promises/loading and don't change when the real network calls land.
   ============================================================================ */
(function () {
  const d = window.acmData;
  const wait = (v, ms = 0) => new Promise((res) => setTimeout(() => res(v), ms));

  window.acmApi = {
    // === SUPABASE SWAP POINT: replace each body with a supabase query ===
    getCommittees: () => wait(d.committees),
    getCommittee: (slug) => wait(d.committees.find((c) => c.slug === slug) || null),
    getProjects: () => wait(d.projects),
    getEvents: () => wait(d.events),
    getAlbums: () => wait(d.albums),
    getAlbum: (id) => wait(d.albums.find((a) => a.id === id) || null),
    getOfficers: () => wait(d.officers),
    getAlumni: () => wait(d.alumni),
    getNews: () => wait(d.news),
    getSponsors: () => wait(d.sponsors),
    getStats: () => wait(d.stats),
  };
})();
