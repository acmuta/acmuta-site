import type { Committee } from "@/lib/api";

const LOGO_MAP: Record<string, string> = {
  create: "/assets/logo/create.png",
  research: "/assets/logo/research.png",
  educate: "/assets/logo/educate.png",
  marketing: "/assets/logo/marketing.png",
  outreach: "/assets/logo/outreach.png",
  community: "/assets/logo/community.png",
};

export function CommitteeMark({ id, size = 24 }: { id: string; size?: number }) {
  const logo = LOGO_MAP[id];
  if (logo) {
    return (
      <img
        src={logo}
        alt={`${id} committee logo`}
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
        loading="lazy"
      />
    );
  }

  const A = "var(--accent)";
  const D = "var(--text-dim)";
  const E = "var(--text-faint)";

  const shapes: Record<string, React.ReactNode> = {
    create: (
      <g>
        <path d="M12 5L6 18M12 5L18 18M6 18L18 18" stroke={E} strokeWidth="1" />
        <circle cx="6" cy="18" r="2" fill={D} />
        <circle cx="18" cy="18" r="2" fill={D} />
        <circle cx="12" cy="5" r="2.6" fill={A} />
      </g>
    ),
    research: (
      <g>
        <circle cx="12" cy="12" r="8" stroke={E} strokeWidth="1" />
        <circle cx="12" cy="12" r="1.7" fill={D} />
        <circle cx="12" cy="4" r="2.4" fill={A} />
      </g>
    ),
    educate: (
      <g>
        <path d="M8 13L16 13M8 13L12 5M16 13L12 5" stroke={E} strokeWidth="1" />
        <circle cx="8" cy="13" r="2.6" fill={A} />
        <circle cx="16" cy="13" r="2.6" fill={D} />
        <circle cx="12" cy="5" r="1.7" fill={D} />
      </g>
    ),
    marketing: (
      <g>
        <path d="M7 12L16 6M7 12L18 12M7 12L16 18" stroke={E} strokeWidth="1" />
        <circle cx="16" cy="6" r="1.7" fill={D} />
        <circle cx="18" cy="12" r="1.7" fill={D} />
        <circle cx="16" cy="18" r="1.7" fill={D} />
        <circle cx="7" cy="12" r="2.8" fill={A} />
      </g>
    ),
    outreach: (
      <g>
        <path d="M6 8L18 16M6 16L18 8" stroke={E} strokeWidth="1" />
        <circle cx="6" cy="8" r="1.8" fill={D} />
        <circle cx="6" cy="16" r="1.8" fill={D} />
        <circle cx="18" cy="8" r="1.8" fill={D} />
        <circle cx="18" cy="16" r="1.8" fill={D} />
        <circle cx="12" cy="12" r="2.6" fill={A} />
      </g>
    ),
    community: (
      <g>
        <path d="M12 5L19 10L16 18L8 18L5 10Z" stroke={E} strokeWidth="1" />
        <circle cx="19" cy="10" r="1.7" fill={D} />
        <circle cx="16" cy="18" r="1.7" fill={D} />
        <circle cx="8" cy="18" r="1.7" fill={D} />
        <circle cx="5" cy="10" r="1.7" fill={D} />
        <circle cx="12" cy="5" r="2.6" fill={A} />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label={`${id} committee logo`}
    >
      {shapes[id] ?? shapes.create}
    </svg>
  );
}

interface CommitteeLogoProps {
  committee: Committee | null | undefined;
  size?: number;
}

export function CommitteeLogo({ committee, size = 26 }: CommitteeLogoProps) {
  if (committee?.logo) {
    return (
      <img
        src={committee.logo}
        alt={`${committee.name} committee logo`}
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
        loading="lazy"
      />
    );
  }
  return <CommitteeMark id={committee?.id ?? ""} size={size} />;
}
