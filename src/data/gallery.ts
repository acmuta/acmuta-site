export interface PhotoAlbum {
  id: string;
  title: string;
  /** ID of the related EventItem, or null */
  event_id: string | null;
  // ── legacy compat shape (used by old pages until Stage D/E rewrites them) ──
  link?: string;
  date?: string;
  description?: string;
  /** ISO date string (YYYY-MM-DD) */
  album_date: string;
  /** Google Photos album URL */
  google_photos_url: string;
  /** Cover image URL; empty string = use placeholder */
  cover_image_url: string;
  /** Photo count shown on the card badge */
  count: number;
}

export const albumsData: PhotoAlbum[] = [
  {
    id: "a11",
    title: "ACM Create Summit 2025",
    event_id: null,
    album_date: "2025-12-01",
    google_photos_url: "https://photos.app.goo.gl/Q5TUdASnEREfX9GKA",
    cover_image_url: "",
    count: 80,
  },
  {
    id: "a10",
    title: "Halloween Bash 2025",
    event_id: null,
    album_date: "2025-10-25",
    google_photos_url: "https://photos.app.goo.gl/vFJkJPUowWmzQQE9A",
    cover_image_url: "",
    count: 64,
  },
  {
    id: "a9",
    title: "Adobe Workshop",
    event_id: null,
    album_date: "2025-10-23",
    google_photos_url: "https://photos.app.goo.gl/HyVrsAG48LAVkwfW6",
    cover_image_url: "",
    count: 38,
  },
  {
    id: "a8",
    title: "Second General Body Meeting",
    event_id: null,
    album_date: "2025-10-15",
    google_photos_url: "https://photos.app.goo.gl/5hyeBUCCCX8G6qy7A",
    cover_image_url: "",
    count: 54,
  },
  {
    id: "a7",
    title: "RPi4b GPIO Workshop",
    event_id: null,
    album_date: "2025-10-07",
    google_photos_url: "https://photos.app.goo.gl/sbvREk6qpKyju3fr7",
    cover_image_url: "",
    count: 42,
  },
  {
    id: "a6",
    title: "HackUTA 2025 — Day 2",
    event_id: "p1",
    album_date: "2025-10-05",
    google_photos_url: "https://photos.app.goo.gl/mooiHHy8ozhLsCr77",
    cover_image_url: "",
    count: 132,
  },
  {
    id: "a5",
    title: "HackUTA 2025 — Day 1",
    event_id: "p1",
    album_date: "2025-10-04",
    google_photos_url: "https://photos.app.goo.gl/k8Fo5ALmx1FZxU7F7",
    cover_image_url: "",
    count: 116,
  },
  {
    id: "a4",
    title: "React Full-Stack Workshop",
    event_id: null,
    album_date: "2025-10-02",
    google_photos_url: "https://photos.app.goo.gl/wKsy5ziAGmqdw1iH8",
    cover_image_url: "",
    count: 28,
  },
  {
    id: "a3",
    title: "Performative Male Contest",
    event_id: null,
    album_date: "2025-09-24",
    google_photos_url: "https://photos.app.goo.gl/xymD1agSSqyfsrCi8",
    cover_image_url: "",
    count: 47,
  },
  {
    id: "a2",
    title: "Lockheed Martin Resume Review",
    event_id: null,
    album_date: "2025-09-15",
    google_photos_url: "https://photos.app.goo.gl/63VLfk4VDKqmBEXr9",
    cover_image_url: "",
    count: 33,
  },
  {
    id: "a1",
    title: "ACM Fall Kickoff 2025",
    event_id: null,
    album_date: "2025-09-08",
    google_photos_url: "https://photos.app.goo.gl/zdCVuPWRt4Gn8udx5",
    cover_image_url: "",
    count: 86,
  },
];

// Legacy compat exports — removed when Gallery/Album pages are rewritten in Stage D/E.
export type Album = PhotoAlbum;
export const gallery = albumsData;
