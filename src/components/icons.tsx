/** Shared SVG icon components. All are aria-hidden by default. */

export function Arrow({ s = 16 }: { s?: number }) {
  return (
    <svg
      className="arrow"
      width={s}
      height={s}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 13L13 3M13 3H5M13 3V11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Plus({ s = 14 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Bell({ s = 18 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 9a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IgIcon({ s = 16 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LiIcon({ s = 16 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M7 10.5V17M7 7.6V7.61"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M11 17v-3.4a2.1 2.1 0 0 1 4.2 0V17M11 10.8V17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shared 1.6px-stroke icon style used for admin nav + action icons. */
function NavIcon({ s = 18, children }: { s?: number; children: React.ReactNode }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function DashIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </NavIcon>
  );
}

export function CalIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </NavIcon>
  );
}

export function DocIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="M6 2.5h8l4 4v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
      <path d="M13 2.5V7h4M8.5 12h7M8.5 16h7" />
    </NavIcon>
  );
}

export function UsersIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6M17.5 20a5.5 5.5 0 0 0-3-4.9" />
    </NavIcon>
  );
}

export function TeamIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <circle cx="7" cy="7" r="2.6" />
      <circle cx="17" cy="7" r="2.6" />
      <circle cx="12" cy="16.5" r="2.8" />
      <path d="M9.3 8.8 11 13.8M14.7 8.8 13 13.8" />
    </NavIcon>
  );
}

export function LinkIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="M9.5 14.5 14.5 9.5M8 11l-2.5 2.5a3.2 3.2 0 0 0 4.5 4.5L12 16M16 13l2.5-2.5a3.2 3.2 0 0 0-4.5-4.5L12 8" />
    </NavIcon>
  );
}

export function TableIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M3 15h18M9 4v16" />
    </NavIcon>
  );
}

export function AuditIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="M3.5 12a8.5 8.5 0 1 1 2.6 6.1" />
      <path d="M3.5 18.5V13H9M12 8v4.5l3 1.8" />
    </NavIcon>
  );
}

export function BackIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="m15 6-6 6 6 6" />
    </NavIcon>
  );
}

export function SearchIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.6-4.6" />
    </NavIcon>
  );
}

export function XIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="M6 6l12 12M18 6 6 18" />
    </NavIcon>
  );
}

export function CheckIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="m4 12 5 5L20 6" />
    </NavIcon>
  );
}

export function ChevronIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="m9 6 6 6-6 6" />
    </NavIcon>
  );
}

export function QrIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M20 14v.01M14 20v.01M20 20v.01M17 17v3" />
    </NavIcon>
  );
}

export function EditIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
      <path d="m14 6 4 4" />
    </NavIcon>
  );
}

export function HackIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </NavIcon>
  );
}

export function NewsIcon({ s = 18 }: { s?: number }) {
  return (
    <NavIcon s={s}>
      <path d="M4 4h16v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4Z" />
      <path d="M8 8h8M8 12h8M8 16h4" />
    </NavIcon>
  );
}

export function GoogleIcon({ s = 18 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
