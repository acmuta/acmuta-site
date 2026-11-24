// `new Date("YYYY-MM-DD")` parses as UTC midnight, which renders as the
// previous day in US timezones. These helpers keep date-only strings local.

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function parseLocalDate(iso: string): Date {
  if (DATE_ONLY.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(iso);
}

export function toLocalISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
