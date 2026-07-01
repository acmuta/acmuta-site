export const MAJORS = [
  "Computer Science",
  "Information Systems",
  "Software Engineering",
  "Data Science",
  "Computer Engineering",
  "Electrical Engineering",
] as const;

export const MAJOR_OTHER = "Other";

export const CLASSIFICATIONS = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Master's",
  "PhD",
] as const;

export const PRONOUNS = [
  "He/him",
  "She/her",
  "They/them",
] as const;

export const PRONOUNS_CUSTOM = "Custom";

// Splits a stored major value into a dropdown choice + custom text, so the
// "Other" option and its text field can be pre-filled from a saved profile.
export function splitMajor(major: string | null): { choice: string; other: string } {
  if (!major) return { choice: "", other: "" };
  if ((MAJORS as readonly string[]).includes(major)) return { choice: major, other: "" };
  return { choice: MAJOR_OTHER, other: major };
}

// Same idea for pronouns.
export function splitPronouns(pronouns: string | null): { choice: string; other: string } {
  if (!pronouns) return { choice: "", other: "" };
  if ((PRONOUNS as readonly string[]).includes(pronouns)) return { choice: pronouns, other: "" };
  return { choice: PRONOUNS_CUSTOM, other: pronouns };
}
