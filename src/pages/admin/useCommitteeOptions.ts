import { useState, useEffect } from "react";
import { getCommitteeOptions, type CommitteeOption, type DirectedCommittee } from "@/lib/api";

// Admins can manage every committee; directors are scoped to the
// committees they direct. Shared by the Members, Teams, and
// Mentorship admin pages.
export function useCommitteeOptions(isAdmin: boolean, directedCommittees: DirectedCommittee[]) {
  const [allCommittees, setAllCommittees] = useState<CommitteeOption[]>([]);
  const [loading, setLoading] = useState(isAdmin);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    getCommitteeOptions().then((c) => {
      setAllCommittees(c);
      setLoading(false);
    });
  }, [isAdmin]);

  const options: CommitteeOption[] = isAdmin
    ? allCommittees
    : directedCommittees.map((c) => ({ id: c.committee_id, name: c.name, slug: c.slug }));

  return { options, loading };
}
