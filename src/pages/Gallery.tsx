import { useState, useEffect } from "react";
import { Reveal } from "@/components/Reveal";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import { getAlbums, type PhotoAlbum } from "@/lib/api";

const Gallery = () => {
  const [albums, setAlbums] = useState<PhotoAlbum[] | null>(null);

  useEffect(() => {
    getAlbums().then(setAlbums);
  }, []);

  if (!albums) return <PageLoading />;

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              THE GALLERY
            </span>
            <h1 className="page-h1">
              Look <span className="amp">back.</span>
            </h1>
            <p className="page-intro">
              Every event, photographed. Click an album to open the full set on
              Google Photos.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <Reveal className="gal-grid" stagger gap={35}>
            {albums.map((a) => (
              <a
                href={a.google_photos_url}
                target="_blank"
                rel="noreferrer"
                className="gal-card"
                key={a.id}
              >
                <span className="gal-date mono">
                  {new Date(a.album_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  }).toUpperCase()}
                </span>
                <span className="gal-name">{a.title}</span>
                <span className="gal-cta">
                  View on Google Photos <Arrow s={12} />
                </span>
              </a>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
