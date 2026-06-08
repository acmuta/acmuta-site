import { CSSProperties } from "react";

interface PhProps {
  label?: string;
  className?: string;
  style?: CSSProperties;
  ratio?: string;
}

export function Ph({ label, className = "", style, ratio }: PhProps) {
  const s: CSSProperties = { ...style };
  if (ratio) s.aspectRatio = ratio;
  return <div className={`ph ${className}`} data-ph={label} style={s} />;
}
