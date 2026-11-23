import { Ph } from "@/components/Placeholder";
import type { CreateMedia } from "@/lib/api";

interface CreateGalleryMediaProps {
  media?: CreateMedia;
}

export function CreateGalleryMedia({ media }: CreateGalleryMediaProps) {
  if (!media) {
    return (
      <div className="cg-media" aria-hidden="true">
        <div className="cg-frame">
          <Ph label="Screenshot pending approval" />
        </div>
      </div>
    );
  }

  if (media.kind === "image") {
    return (
      <figure className="cg-media">
        <div className="cg-frame">
          <img
            src={media.src}
            width={media.width}
            height={media.height}
            alt={media.alt}
            loading="lazy"
            decoding="async"
          />
        </div>
        {media.caption && <figcaption>{media.caption}</figcaption>}
      </figure>
    );
  }

  const fallback = media.sources.find((s) => s.type === "video/mp4") ?? media.sources[0];
  return (
    <figure className="cg-media">
      <div className="cg-frame is-video">
        {/* No autoplay or loop: the visitor starts every clip. preload="none" keeps
            the page from downloading video nobody asked for. */}
        <video
          controls
          preload="none"
          playsInline
          poster={media.poster}
          width={media.width}
          height={media.height}
          aria-label={media.label}
        >
          {media.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
          <track kind="captions" src={media.captions} srcLang="en" label="English" />
          <p>
            This browser can't play the clip. <a href={fallback.src}>Download it</a> instead.
          </p>
        </video>
      </div>
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}
