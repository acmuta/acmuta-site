import { SUBMISSION_STATUS_LABEL, type AuditLogEntry, type SubmissionStatus } from "@/lib/api";

export const ACTION_LABEL: Record<string, string> = {
  "application_form.create": "created an application form",
  "application_form.update": "updated an application form",
  "application_form.set_status": "changed an application form's status",
  "application_form.duplicate": "duplicated an application form",
  "application_form.delete": "deleted an application form",
  "application.submit": "submitted an application",
  "application.review": "reviewed an application",
  "application.delete": "deleted an application",
  "event.create": "created an event",
  "event.update": "updated an event",
  "event.delete": "deleted an event",
  "event.manual_checkin": "manually checked someone in",
  "event_category.create": "created an event category",
  "event_category.update": "updated an event category",
  "event_category.delete": "deleted an event category",
  "committee_role.assign": "assigned a committee role",
  "committee_role.remove": "removed a committee role",
  "team.create": "created a team",
  "team.delete": "deleted a team",
  "team.set_lead": "set a team lead",
  "team_membership.add": "added a team member",
  "team_membership.remove": "removed a team member",
  "mentorship.pair": "created a mentor pairing",
  "mentorship.unpair": "removed a mentor pairing",
  "points.award": "awarded points",
};

export const ACTION_GROUPS: { label: string; actions: string[] }[] = [
  {
    label: "Applications",
    actions: [
      "application_form.create",
      "application_form.update",
      "application_form.set_status",
      "application_form.duplicate",
      "application_form.delete",
      "application.submit",
      "application.review",
      "application.delete",
    ],
  },
  {
    label: "Events",
    actions: ["event.create", "event.update", "event.delete", "event.manual_checkin"],
  },
  {
    label: "Event categories",
    actions: ["event_category.create", "event_category.update", "event_category.delete"],
  },
  {
    label: "Members & roles",
    actions: ["committee_role.assign", "committee_role.remove"],
  },
  {
    label: "Teams",
    actions: ["team.create", "team.delete", "team.set_lead", "team_membership.add", "team_membership.remove"],
  },
  {
    label: "Mentorship",
    actions: ["mentorship.pair", "mentorship.unpair"],
  },
  {
    label: "Points",
    actions: ["points.award"],
  },
];

export function describeAuditEntry(entry: AuditLogEntry): string {
  const label = ACTION_LABEL[entry.action] ?? entry.action;
  const actor = entry.actor_name ?? "Someone";
  return `${actor} ${label}`;
}

const KEY_LABEL: Record<string, string> = {
  committee_id: "Committee",
  user_id: "User",
  lead_user_id: "Lead",
  mentor_user_id: "Mentor",
  mentee_user_id: "Mentee",
  source_form_id: "Duplicated from",
  reviewer_notes: "Notes",
  fields: "Fields changed",
  bit_value: "Bits",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function titleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isSubmissionStatus(value: string): value is SubmissionStatus {
  return Object.prototype.hasOwnProperty.call(SUBMISSION_STATUS_LABEL, value);
}

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (key === "fields" && Array.isArray(value)) {
    return value.map((f) => titleCase(String(f))).join(", ");
  }
  if (typeof value === "string") {
    if (key === "status" && isSubmissionStatus(value)) return SUBMISSION_STATUS_LABEL[value];
    if (key === "role" || key === "status") return titleCase(value);
    if (UUID_RE.test(value)) return `${value.slice(0, 8)}…`;
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => String(v)).join(", ");
  return String(value);
}

export function formatAuditMetadata(metadata: Record<string, unknown>): { label: string; value: string }[] {
  return Object.entries(metadata).map(([key, value]) => ({
    label: KEY_LABEL[key] ?? titleCase(key),
    value: formatValue(key, value),
  }));
}
