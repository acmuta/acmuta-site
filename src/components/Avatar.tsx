interface AvatarProps {
  name: string | null | undefined;
  size?: number;
  accent?: boolean;
}

export function Avatar({ name, size = 40, accent = false }: AvatarProps) {
  const initials = (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={`pf-avatar${accent ? " pf-avatar--accent" : ""}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}
