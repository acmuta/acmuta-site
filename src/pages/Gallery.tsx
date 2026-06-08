import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { Ph } from "@/components/Placeholder";
import { PageLoading } from "@/components/Loading";
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
              Proof of <span className="amp">life.</span>
            </h1>
            <p className="page-intro">
              Every event, photographed. Click an album to look through the night.
              Full sets live on Google Photos.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <Reveal className="gal-grid" stagger gap={45}>
            {albums.map((a) => (
              <Link to={`/gallery/${a.id}`} className="gal-card" key={a.id}>
                <div className="gal-cover">
                  <Ph label={a.title} />
                  <span className="cnt">{a.count} PHOTOS</span>
                </div>
                <div className="gal-meta">
                  <span className="gal-name">{a.title}</span>
                  <span className="gal-date mono">
                    {new Date(a.album_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
