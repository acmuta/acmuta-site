import type { UrlKind } from "@/lib/api";

export const MAVS_EMAIL_RE = /^[A-Za-z0-9._%+-]+@mavs\.uta\.edu$/i;
export const STUDENT_ID_RE = /^\d{10}$/;

export function validateMavsEmail(value: string): string | null {
  return MAVS_EMAIL_RE.test(value.trim()) ? null : "Enter a valid @mavs.uta.edu email address.";
}

export function validateStudentId(value: string): string | null {
  return STUDENT_ID_RE.test(value.trim()) ? null : "Student ID must be exactly 10 digits.";
}

const URL_KIND_HOST: Partial<Record<UrlKind, string>> = {
  github: "github.com",
  linkedin: "linkedin.com",
};

const URL_KIND_NAME: Record<UrlKind, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  portfolio: "portfolio",
  generic: "URL",
};

export function validateUrl(value: string, kind?: UrlKind | null): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return "Enter a valid URL (including https://).";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Enter a valid URL (including https://).";
  }
  const host = kind ? URL_KIND_HOST[kind] : undefined;
  if (host && !url.hostname.toLowerCase().endsWith(host)) {
    return `Enter a valid ${URL_KIND_NAME[kind!]} URL.`;
  }
  return null;
}
