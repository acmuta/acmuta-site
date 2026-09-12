import { CSSProperties } from "react";

interface PhProps {
  label?: string;
  className?: string;
  style?: CSSProperties;
  ratio?: string;
  /** Real image URL; when set, renders an image instead of the striped placeholder */
  src?: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  /** Above-the-fold image: load eagerly with high fetch priority */
  priority?: boolean;
}

export function Ph({ label, className = "", style, ratio, src, srcSet, sizes, alt, priority }: PhProps) {
  const s: CSSProperties = { ...style };
  if (ratio) s.aspectRatio = ratio;
  if (src) {
    return (
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt ?? label ?? ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`ph ${className}`}
        style={{ objectFit: "cover", ...s }}
      />
    );
  }
  return <div className={`ph ${className}`} data-ph={label} style={s} />;
}
