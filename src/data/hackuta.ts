// ─────────────────────────────────────────────────────────────────────────────
// HackUTA configuration
//
// This file is the single source of truth for HackUTA display state.
// It is managed through the Admin panel → HackUTA Settings page.
// Direct edits here are also fine - toggle `enabled` and fill in the fields.
//
// When enabled = true  → shows full event details on /hackuta
// When enabled = false → shows a generic "coming soon" placeholder
// ─────────────────────────────────────────────────────────────────────────────

export interface HackUTAConfig {
  enabled: boolean;
  year: number;
  dateDisplay: string;
  location: string;
  appsOpen: boolean;
  appsUrl: string | null;
}

export const hackutaConfig: HackUTAConfig = {
  enabled: true,
  year: 2026,
  dateDisplay: "OCT 18–19, 2026",
  location: "UTA COLLEGE PARK CENTER",
  appsOpen: false,
  appsUrl: null,
};
