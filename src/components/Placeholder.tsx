import { CSSProperties } from "react";

interface PhProps {
  label?: string;
  className?: string;
  style?: CSSProperties;
  ratio?: string;
  /** Real image URL; when set, renders an image instead of the striped placeholder */
  src?: string;
  alt?: string;
}

export function Ph({ label, className = "", style, ratio, src, alt }: PhProps) {
  const s: CSSProperties = { ...style };
  if (ratio) s.aspectRatio = ratio;
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? label ?? ""}
        loading="lazy"
        className={`ph ${className}`}
        style={{ objectFit: "cover", ...s }}
      />
    );
  }
  return <div className={`ph ${className}`} data-ph={label} style={s} />;
}
