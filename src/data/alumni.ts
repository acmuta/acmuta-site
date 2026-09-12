export interface Alumni {
  id: string;
  name: string;
  /** Historical role + year, e.g. "Create Director '24–25" */
  role: string;
  /** Where they are now */
  now: string;
  /** Photo base path without extension, e.g. "/assets/officerpics/jane" (see scripts/officer-photos.mjs); empty string = use placeholder */
  photo: string;
}

export const alumniData: Alumni[] = [
  {
    id: "alumni-yash",
    name: "Yash Rao",
    role: "Student Advisor '24–25",
    now: "Mentorship & Advising",
    photo: "/assets/officerpics/yash",
  },
  {
    id: "alumni-tobi",
    name: "Tobi Akere",
    role: "Create Director '24–25",
    now: "Software Engineering",
    photo: "/assets/officerpics/tobi",
  },
  {
    id: "alumni-bobby",
    name: "Bobby Flennoy",
    role: "President '23–24",
    now: "UI/UX Design",
    photo: "/assets/officerpics/bobby",
  },
  {
    id: "alumni-kevin",
    name: "Kevin Farokhrouz",
    role: "Vice President '25–26",
    now: "Software Engineering",
    photo: "/assets/officerpics/kevin",
  },
  {
    id: "alumni-muhammad",
    name: "Muhammad Khurram",
    role: "President '25–26",
    now: "Software Engineering",
    photo: "/assets/officerpics/muhammad",
  },
];

// Legacy compat export - removed when Officers page is rewritten in Stage D/E.
export const alumni = alumniData;
