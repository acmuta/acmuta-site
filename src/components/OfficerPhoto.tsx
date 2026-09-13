import { Ph } from "@/components/Placeholder";

/** Matches .off-grid: 2 / 3 / 4 columns inside the 1320px wrap */
const GRID_SIZES = "(min-width: 1320px) 295px, (min-width: 980px) 25vw, (min-width: 640px) 33vw, 50vw";

interface OfficerPhotoProps {
  /** Base path without extension, e.g. "/assets/officerpics/jane" (see scripts/officer-photos.mjs) */
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

export function OfficerPhoto({ src, alt, sizes = GRID_SIZES, priority }: OfficerPhotoProps) {
  if (!src) return <Ph label={alt} />;
  return (
    <Ph
      label={alt}
      alt={alt}
      src={`${src}-600.webp`}
      srcSet={`${src}-300.webp 300w, ${src}-600.webp 600w`}
      sizes={sizes}
      priority={priority}
    />
  );
}
