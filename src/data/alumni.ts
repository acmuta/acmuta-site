export interface Alumni {
  id: string;
  name: string;
  /** Historical role + year, e.g. "Create Director '24–25" */
  role: string;
  /** Where they are now */
  now: string;
  /** Photo URL; empty string = use placeholder */
  photo: string;
}

export const alumniData: Alumni[] = [
  {
    id: "alumni-yash",
    name: "Yash Rao",
    role: "Student Advisor '24–25",
    now: "Mentorship & Advising",
    photo: "/assets/officerpics/yash.jpeg",
  },
  {
    id: "alumni-tobi",
    name: "Tobi Akere",
    role: "Create Director '24–25",
    now: "Software Engineering",
    photo: "/assets/officerpics/tobi.png",
  },
];

// Legacy compat export - removed when Officers page is rewritten in Stage D/E.
export const alumni = alumniData;
