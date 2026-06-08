import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { Ph } from "@/components/Placeholder";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import { getAlbum, type PhotoAlbum } from "@/lib/api";

const Album = () => {
  const { albumId } = useParams<{ albumId: string }>();
  // undefined = loading, null = not found
  const [album, setAlbum] = useState<PhotoAlbum | null | undefined>(undefined);

  useEffect(() => {
    if (!albumId) { setAlbum(null); return; }
    getAlbum(albumId).then(setAlbum);
  }, [albumId]);

  if (album === undefined) return <PageLoading />;

  if (!album) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <p style={{ color: "var(--text-dim)" }}>Album not found.</p>
      </div>
    );
  }

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <Link
              to="/gallery"
              className="mono"
              style={{
                color: "var(--text-faint)",
                display: "inline-flex",
                gap: 8,
                marginBottom: 24,
              }}
            >
              ← ALL ALBUMS
            </Link>
            <div className="sec-head row">
              <div>
                <span
                  className="tag mono"
                  style={{ marginBottom: 16, display: "inline-flex" }}
                >
                  <span className="node" />
                  {new Date(album.album_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · {album.count} PHOTOS
                </span>
                <h1
                  className="page-h1"
                  style={{ fontSize: "clamp(2.6rem,9vw,6.5rem)" }}
                >
                  {album.title}
                </h1>
              </div>
              <a
                href={album.google_photos_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                View on Google Photos <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <Reveal className="album-grid" stagger gap={28}>
            {Array.from({ length: 14 }, (_, i) => (
              <Ph key={i} label="photo" />
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Album;
