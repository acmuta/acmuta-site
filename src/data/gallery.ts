export interface PhotoAlbum {
  id: string;
  title: string;
  event_id: string | null;
  /** ISO date string (YYYY-MM-DD) */
  album_date: string;
  /** Google Photos album URL */
  google_photos_url: string;
}

export const albumsData: PhotoAlbum[] = [
  {
    id: "a11",
    title: "ACM Create Summit 2025",
    event_id: null,
    album_date: "2025-12-01",
    google_photos_url: "https://photos.app.goo.gl/Q5TUdASnEREfX9GKA",
  },
  {
    id: "a10",
    title: "Halloween Bash 2025",
    event_id: null,
    album_date: "2025-10-25",
    google_photos_url: "https://photos.app.goo.gl/vFJkJPUowWmzQQE9A",
  },
  {
    id: "a9",
    title: "Adobe Workshop",
    event_id: null,
    album_date: "2025-10-23",
    google_photos_url: "https://photos.app.goo.gl/HyVrsAG48LAVkwfW6",
  },
  {
    id: "a8",
    title: "Second General Body Meeting",
    event_id: null,
    album_date: "2025-10-15",
    google_photos_url: "https://photos.app.goo.gl/5hyeBUCCCX8G6qy7A",
  },
  {
    id: "a7",
    title: "RPi4b GPIO Workshop",
    event_id: null,
    album_date: "2025-10-07",
    google_photos_url: "https://photos.app.goo.gl/sbvREk6qpKyju3fr7",
  },
  {
    id: "a6",
    title: "HackUTA 2025 - Day 2",
    event_id: "p1",
    album_date: "2025-10-05",
    google_photos_url: "https://photos.app.goo.gl/mooiHHy8ozhLsCr77",
  },
  {
    id: "a5",
    title: "HackUTA 2025 - Day 1",
    event_id: "p1",
    album_date: "2025-10-04",
    google_photos_url: "https://photos.app.goo.gl/k8Fo5ALmx1FZxU7F7",
  },
  {
    id: "a4",
    title: "React Full-Stack Workshop",
    event_id: null,
    album_date: "2025-10-02",
    google_photos_url: "https://photos.app.goo.gl/wKsy5ziAGmqdw1iH8",
  },
  {
    id: "a3",
    title: "Performative Male Contest",
    event_id: null,
    album_date: "2025-09-24",
    google_photos_url: "https://photos.app.goo.gl/xymD1agSSqyfsrCi8",
  },
  {
    id: "a2",
    title: "Lockheed Martin Resume Review",
    event_id: null,
    album_date: "2025-09-15",
    google_photos_url: "https://photos.app.goo.gl/63VLfk4VDKqmBEXr9",
  },
  {
    id: "a1",
    title: "ACM Fall Kickoff 2025",
    event_id: null,
    album_date: "2025-09-08",
    google_photos_url: "https://photos.app.goo.gl/zdCVuPWRt4Gn8udx5",
  },
];
