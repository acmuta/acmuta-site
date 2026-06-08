export interface Stat {
  /** Formatted value, e.g. "1,700" or "140" */
  value: string;
  /** Optional prefix displayed smaller before the number, e.g. "$" */
  prefix?: string;
  /** Suffix coloured in accent, e.g. "+" or "k+" */
  suffix: string;
  /** Short label below the number */
  label: string;
  /** Tertiary note in faint text */
  note: string;
}

export const statsData: Stat[] = [
  { value: "1,700", suffix: "+",  label: "members",         note: "across every major" },
  { value: "50",    suffix: "+",  label: "officers",        note: "running the org" },
  { value: "140",   suffix: "+",  label: "events a year",   note: "workshops to socials" },
  { value: "10",    prefix: "$",  suffix: "k+", label: "in sponsorship", note: "keeps it free" },
];
