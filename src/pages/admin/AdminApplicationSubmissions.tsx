import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Navigate, useOutletContext } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Reveal } from "@/components/Reveal";
import { Avatar } from "@/components/Avatar";
import { BackIcon, ChevronIcon, XIcon } from "@/components/icons";
import { SubmissionView } from "@/components/applications/SubmissionView";
import {
  getApplicationFormDetail,
  getApplicationsForForm,
  updateApplicationReview,
  deleteApplication,
  assignCommitteeRole,
  getResumeSignedUrl,
  exportApplicationsCsv,
  exportFormResumesZip,
  TERM_LABEL,
  SUBMISSION_STATUS_LABEL,
  type ApplicationFormDetail,
  type AdminApplicationSubmission,
  type SubmissionStatus,
  type CommitteeRoleType,
} from "@/lib/api";
import { downloadBlob } from "@/lib/download";
import type { AdminContext } from "./AdminLayout";

const STATUS_OPTIONS: SubmissionStatus[] = ["submitted", "under_review", "accepted", "rejected", "waitlisted"];

const ROLE_OPTIONS: CommitteeRoleType[] = ["member", "officer", "director"];

const ROLE_LABEL: Record<CommitteeRoleType, string> = {
  member: "Member",
  officer: "Officer",
  director: "Director",
};

type SortOrder = "newest" | "oldest";

export default function AdminApplicationSubmissions() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();

  const [form, setForm] = useState<ApplicationFormDetail | null | undefined>(undefined);
  const [submissions, setSubmissions] = useState<AdminApplicationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [exportingZip, setExportingZip] = useState(false);

  useEffect(() => {
    if (!formId) return;
    Promise.all([getApplicationFormDetail(formId), getApplicationsForForm(formId)])
      .then(([f, subs]) => {
        setForm(f);
        setSubmissions(subs);
      })
      .finally(() => setLoading(false));
  }, [formId]);

  const filtered = useMemo(() => {
    const list = submissions.filter((s) => statusFilter === "all" || s.status === statusFilter);
    return list.sort((a, b) => {
      const diff = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
  }, [submissions, statusFilter, sortOrder]);

  const handleUpdate = (updated: AdminApplicationSubmission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    await deleteApplication(id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setExpanded((prev) => (prev === id ? null : prev));
  };

  const handleExportZip = async () => {
    if (!form) return;
    setExportingZip(true);
    try {
      const blob = await exportFormResumesZip(filtered);
      downloadBlob(blob, `${form.title.replace(/\s+/g, "_")}-resumes.zip`);
    } finally {
      setExportingZip(false);
    }
  };

  if (loading || form === undefined) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }
  if (!form) return <Navigate to="/admin/applications" replace />;

  const canDelete = isAdmin || directedCommittees.some((c) => c.committee_id === form.committee_id);

  return (
    <div>
      <div className="adm-subnav">
        <button type="button" className="adm-sublink" onClick={() => navigate("/admin/applications")}>
          <BackIcon s={15} /> Back to forms
        </button>
        <span className="adm-subnav-meta mono">{form.committee_name} · {TERM_LABEL[form.term]} {form.year}</span>
      </div>

      <div className="adm-head">
        <h1 className="adm-h1">{form.title}</h1>
        <div className="adm-filters">
          <select
            className="ob-input ob-select adm-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | "all")}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{SUBMISSION_STATUS_LABEL[s]}</option>
            ))}
          </select>
          <select
            className="ob-input ob-select adm-filter"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportApplicationsCsv(form, filtered)}>
            Export CSV
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleExportZip} disabled={exportingZip}>
            {exportingZip ? "Exporting…" : "Export resumes (zip)"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="pf-empty">No submissions match this filter.</p>
      ) : (
        <div className="adm-app-list">
          {filtered.map((s) => (
            <SubmissionRow
              key={s.id}
              submission={s}
              form={form}
              isAdmin={isAdmin}
              reviewerId={user!.id}
              expanded={expanded === s.id}
              onToggle={() => setExpanded(expanded === s.id ? null : s.id)}
              onUpdate={handleUpdate}
              canDelete={canDelete}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionRow({
  submission,
  form,
  isAdmin,
  reviewerId,
  expanded,
  onToggle,
  onUpdate,
  canDelete,
  onDelete,
}: {
  submission: AdminApplicationSubmission;
  form: ApplicationFormDetail;
  isAdmin: boolean;
  reviewerId: string;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (s: AdminApplicationSubmission) => void;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const submitted = new Date(submission.submitted_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`adm-app-row${expanded ? " open" : ""}`}>
      <div className="adm-app-summary">
        <button className="adm-app-summary-main" onClick={onToggle}>
          <span className="adm-app-chev"><ChevronIcon s={16} /></span>
          <Avatar name={submission.applicant_name} size={38} />
          <span className="adm-app-who">
            <span className="adm-app-name">{submission.applicant_name}</span>
            <span className="adm-app-meta mono">{submission.applicant_email} · {submitted}</span>
          </span>
          <span className={`sub-status sub-status--${submission.status}`}>
            {SUBMISSION_STATUS_LABEL[submission.status]}
          </span>
        </button>
        {canDelete && (
          <button className="adm-icon-btn" onClick={onDelete} aria-label="Delete submission"><XIcon s={15} /></button>
        )}
      </div>

      {expanded && (
        <Reveal>
          <SubmissionReviewPanel submission={submission} form={form} isAdmin={isAdmin} reviewerId={reviewerId} onUpdate={onUpdate} />
        </Reveal>
      )}
    </div>
  );
}

function SubmissionReviewPanel({
  submission,
  form,
  isAdmin,
  reviewerId,
  onUpdate,
}: {
  submission: AdminApplicationSubmission;
  form: ApplicationFormDetail;
  isAdmin: boolean;
  reviewerId: string;
  onUpdate: (s: AdminApplicationSubmission) => void;
}) {
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [notes, setNotes] = useState(submission.reviewer_notes ?? "");
  const [role, setRole] = useState<CommitteeRoleType>(form.application_type === "officer" ? "officer" : "member");
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [roleMsg, setRoleMsg] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!submission.resume_path) return;
    let cancelled = false;
    getResumeSignedUrl(submission.resume_path).then((url) => {
      if (!cancelled) setResumeUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [submission.resume_path]);

  const handleSave = async () => {
    setErr(null);
    setSaving(true);
    try {
      await updateApplicationReview(submission.id, reviewerId, { status, reviewer_notes: notes.trim() || null });
      onUpdate({ ...submission, status, reviewer_notes: notes.trim() || null, reviewed_by: reviewerId });
    } catch {
      setErr("Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignRole = async () => {
    setRoleMsg(null);
    setAssigning(true);
    try {
      await assignCommitteeRole(submission.applicant_id, form.committee_id, role, reviewerId);
      setRoleMsg(`Assigned ${ROLE_LABEL[role]} role.`);
    } catch {
      setRoleMsg("Couldn't assign role - an existing role may need an admin to update it.");
    } finally {
      setAssigning(false);
    }
  };

  const canAssignRole =
    status === "accepted" && (form.application_type === "member" || form.application_type === "officer");

  return (
    <div className="adm-app-detail">
      <SubmissionView
        questions={form.questions}
        answers={submission.answers}
        resumePath={submission.resume_path}
        showDirectorToggle={form.show_director_toggle}
        status={submission.status}
        context="reviewer"
      />

      {resumeUrl && <embed src={resumeUrl} type="application/pdf" className="sub-resume-embed" />}

      {form.show_director_toggle && submission.wants_director !== null && (
        <p className="adm-app-meta mono">
          Director interest: {submission.wants_director ? "Yes" : "No"}
        </p>
      )}

      {err && <div className="auth-err">{err}</div>}

      <div className="adm-review">
        <div className="adm-review-h mono">Review</div>

        <div className="ob-row">
          <div className="ob-field">
            <label className="ob-label" htmlFor={`status-${submission.id}`}>Decision</label>
            <select
              id={`status-${submission.id}`}
              className="ob-input ob-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{SUBMISSION_STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label" htmlFor={`notes-${submission.id}`}>Reviewer notes</label>
          <textarea
            id={`notes-${submission.id}`}
            className="ob-input adm-textarea"
            rows={2}
            placeholder="Notes for the committee…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save review"}
        </button>

        {canAssignRole && (
          <div className="adm-role-section">
            <div className="adm-role-section-h mono">Assign committee role</div>
            {isAdmin ? (
              <div className="adm-role-assign">
                <select
                  className="ob-input ob-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as CommitteeRoleType)}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                  ))}
                </select>
                <button className="btn btn-ghost btn-sm" onClick={handleAssignRole} disabled={assigning}>
                  {assigning ? "Assigning…" : "Assign role"}
                </button>
              </div>
            ) : form.application_type === "officer" ? (
              <div className="adm-role-assign">
                <button className="btn btn-ghost btn-sm" onClick={handleAssignRole} disabled={assigning}>
                  {assigning ? "Assigning…" : "Grant officer role"}
                </button>
              </div>
            ) : (
              <p className="pf-empty">Adding members to the committee requires an admin.</p>
            )}
            {roleMsg && <p className="adm-role-msg">{roleMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
