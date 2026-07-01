import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Switch } from "@/components/ui/switch";
import { BackIcon, Plus, XIcon } from "@/components/icons";
import { QuestionForm, useQuestionForm } from "@/components/applications/QuestionForm";
import {
  getApplicationFormDetail,
  getApplicationTemplates,
  getBaseTemplate,
  getCommitteeOptions,
  createApplicationForm,
  updateApplicationForm,
  setApplicationFormStatus,
  duplicateApplicationForm,
  deleteApplicationForm,
  APPLICATION_TYPE_LABEL,
  TERM_LABEL,
  FORM_STATUS_LABEL,
  type ApplicationQuestion,
  type ApplicationTemplate,
  type ApplicationFormDetail,
  type ApplicationFormUpdate,
  type ApplicationFormStatus,
  type ApplicationTerm,
  type ApplicationType,
  type CommitteeOption,
  type QuestionType,
  type AutofillField,
  type UrlKind,
  type SaveBackField,
  type SliderConfig,
} from "@/lib/api";
import type { AdminContext } from "./AdminLayout";

const APPLICATION_TYPES: ApplicationType[] = ["member", "officer", "mentor", "mentee"];
const TERMS: ApplicationTerm[] = ["spring", "summer", "fall"];
const FORM_STATUSES: ApplicationFormStatus[] = ["draft", "open", "closed"];
const QUESTION_TYPES: QuestionType[] = [
  "short_text", "long_text", "email", "phone", "student_id", "select", "toggle", "url", "file", "slider",
];
const AUTOFILL_OPTIONS: AutofillField[] = ["name", "pronouns", "email", "major", "grade"];
const URL_KINDS: UrlKind[] = ["github", "linkedin", "portfolio", "generic"];
const SAVE_BACK_OPTIONS: SaveBackField[] = ["phone", "student_id", "discord_username", "linkedin", "github"];

const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  short_text: "Short text",
  long_text: "Long text",
  email: "Email",
  phone: "Phone",
  student_id: "Student ID",
  select: "Dropdown",
  toggle: "Yes / No toggle",
  url: "Link",
  file: "File upload",
  slider: "Slider",
};

const URL_KIND_LABEL: Record<UrlKind, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
  generic: "Generic",
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2];

function emptyQuestion(): ApplicationQuestion {
  return { id: crypto.randomUUID(), type: "short_text", label: "", required: true };
}

function sliderOrDefault(q: ApplicationQuestion): SliderConfig {
  return q.slider ?? { min: 0, max: 100, unit: "" };
}

function typeChangePatch(type: QuestionType): Partial<ApplicationQuestion> {
  const patch: Partial<ApplicationQuestion> = { type };
  if (type === "select") patch.options = [];
  if (type === "slider") patch.slider = { min: 0, max: 100, unit: "" };
  if (type === "url") patch.url_kind = "generic";
  return patch;
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminApplicationBuilder() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();
  const isNew = !formId;

  const lockedCommittee = !isAdmin && directedCommittees.length === 1 ? directedCommittees[0].committee_id : null;

  const [loading, setLoading] = useState(true);
  const [committees, setCommittees] = useState<CommitteeOption[]>([]);
  const [templates, setTemplates] = useState<ApplicationTemplate[]>([]);
  const [form, setForm] = useState<ApplicationFormDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [committeeId, setCommitteeId] = useState("");
  const [applicationType, setApplicationType] = useState<ApplicationType>("officer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [term, setTerm] = useState<ApplicationTerm>("fall");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [showDirectorToggle, setShowDirectorToggle] = useState(false);
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([]);
  const [templateId, setTemplateId] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const committeeOptions: CommitteeOption[] = isAdmin
    ? committees
    : directedCommittees.map((c) => ({ id: c.committee_id, name: c.name, slug: c.slug }));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [committeeData, templateData] = await Promise.all([
        isAdmin ? getCommitteeOptions() : Promise.resolve([]),
        getApplicationTemplates(),
      ]);
      if (cancelled) return;
      setCommittees(committeeData);
      setTemplates(templateData);

      if (formId) {
        const detail = await getApplicationFormDetail(formId);
        if (cancelled) return;
        if (!detail) {
          setNotFound(true);
        } else {
          setForm(detail);
          setCommitteeId(detail.committee_id);
          setApplicationType(detail.application_type);
          setTitle(detail.title);
          setDescription(detail.description ?? "");
          setTerm(detail.term);
          setYear(detail.year);
          setShowDirectorToggle(detail.show_director_toggle);
          setOpensAt(detail.opens_at ? toLocalInput(detail.opens_at) : "");
          setClosesAt(detail.closes_at ? toLocalInput(detail.closes_at) : "");
          setQuestions(detail.questions);
        }
      } else {
        const base = await getBaseTemplate();
        if (cancelled) return;
        if (base) {
          setQuestions(base.questions.map((q) => ({ ...q })));
          setTemplateId(base.id);
        }
        if (lockedCommittee) setCommitteeId(lockedCommittee);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const { values: previewValues, setValue: setPreviewValue } = useQuestionForm(questions, undefined, showDirectorToggle);

  const isLocked = form?.is_locked ?? false;

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) setQuestions(tpl.questions.map((q) => ({ ...q })));
  };

  const addQuestion = () => setQuestions((qs) => [...qs, emptyQuestion()]);
  const removeQuestion = (index: number) => setQuestions((qs) => qs.filter((_, i) => i !== index));
  const moveQuestion = (index: number, dir: -1 | 1) => {
    setQuestions((qs) => {
      const target = index + dir;
      if (target < 0 || target >= qs.length) return qs;
      const next = [...qs];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };
  const updateQuestion = (index: number, patch: Partial<ApplicationQuestion>) => {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const handleSave = async () => {
    setErr(null);
    setSaved(false);
    if (!committeeId || !title.trim()) {
      setErr("Committee and title are required.");
      return;
    }
    setSaving(true);
    try {
      const input = {
        committee_id: committeeId,
        application_type: applicationType,
        title: title.trim(),
        description: description.trim() || null,
        term,
        year,
        questions,
        show_director_toggle: showDirectorToggle,
      };
      if (isNew) {
        const id = await createApplicationForm(input, user!.id);
        navigate(`/admin/applications/builder/${id}`, { replace: true });
        return;
      }
      const updates: ApplicationFormUpdate = {
        ...input,
        opens_at: opensAt ? new Date(opensAt).toISOString() : null,
        closes_at: closesAt ? new Date(closesAt).toISOString() : null,
      };
      if (isLocked) delete updates.questions;
      await updateApplicationForm(formId!, updates);
      const refreshed = await getApplicationFormDetail(formId!);
      if (refreshed) setForm(refreshed);
      setSaved(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't save this form. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: ApplicationFormStatus) => {
    if (!formId) return;
    setErr(null);
    setStatusSaving(true);
    try {
      await setApplicationFormStatus(formId, status);
      setForm((f) => (f ? { ...f, status } : f));
    } catch {
      setErr("Couldn't update status. Please try again.");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!formId || !user) return;
    setErr(null);
    setDuplicating(true);
    try {
      const id = await duplicateApplicationForm(formId, user.id);
      navigate(`/admin/applications/builder/${id}`);
    } catch {
      setErr("Couldn't duplicate this form. Please try again.");
    } finally {
      setDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!formId) return;
    if (!confirm("Delete this form? This cannot be undone.")) return;
    setErr(null);
    setDeleting(true);
    try {
      await deleteApplicationForm(formId);
      navigate("/admin/applications");
    } catch {
      setErr("Couldn't delete this form. If it has submissions, try closing it instead.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  if (notFound) {
    return (
      <div>
        <div className="adm-head">
          <h1 className="adm-h1">Form not found</h1>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => navigate("/admin/applications")}>
          ← Back to forms
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="adm-subnav">
        <button type="button" className="adm-sublink" onClick={() => navigate("/admin/applications")}>
          <BackIcon s={15} /> Back to forms
        </button>
      </div>

      <div className="adm-head">
        <h1 className="adm-h1">{isNew ? "New application form" : title || "Edit form"}</h1>
      </div>

      {err && <div className="auth-err">{err}</div>}

      {isLocked && (
        <div className="bld-lock-banner">
          <span>Questions are locked because this form has submissions. Duplicate it to make changes.</span>
          <button type="button" className="btn btn-ghost btn-sm" disabled={duplicating} onClick={handleDuplicate}>
            {duplicating ? "Duplicating…" : "Duplicate form"}
          </button>
        </div>
      )}

      <div className="bld-layout">
        <div className="adm-form bld-meta">
          <h2 className="adm-section-h">Form details</h2>

          <div className="ob-row">
            <div className="ob-field">
              <label className="ob-label" htmlFor="bld-committee">Committee</label>
              <select
                id="bld-committee"
                className="ob-input ob-select"
                value={committeeId}
                disabled={!!lockedCommittee}
                onChange={(e) => setCommitteeId(e.target.value)}
              >
                <option value="">Select committee…</option>
                {committeeOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="ob-field">
              <label className="ob-label" htmlFor="bld-type">Application type</label>
              <select
                id="bld-type"
                className="ob-input ob-select"
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
              >
                {APPLICATION_TYPES.map((t) => (
                  <option key={t} value={t}>{APPLICATION_TYPE_LABEL[t]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ob-field">
            <label className="ob-label" htmlFor="bld-title">Title</label>
            <input
              id="bld-title"
              type="text"
              className="ob-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="ob-field">
            <label className="ob-label" htmlFor="bld-desc">Description</label>
            <textarea
              id="bld-desc"
              className="ob-input adm-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="ob-row">
            <div className="ob-field">
              <label className="ob-label" htmlFor="bld-term">Term</label>
              <select
                id="bld-term"
                className="ob-input ob-select"
                value={term}
                onChange={(e) => setTerm(e.target.value as ApplicationTerm)}
              >
                {TERMS.map((t) => (
                  <option key={t} value={t}>{TERM_LABEL[t]}</option>
                ))}
              </select>
            </div>
            <div className="ob-field">
              <label className="ob-label" htmlFor="bld-year">Year</label>
              <select
                id="bld-year"
                className="ob-input ob-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {isNew && templates.length > 0 && (
            <div className="ob-field">
              <label className="ob-label" htmlFor="bld-template">Start from template</label>
              <select
                id="bld-template"
                className="ob-input ob-select"
                value={templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="ob-check-row">
            <Switch checked={showDirectorToggle} onCheckedChange={setShowDirectorToggle} />
            <div className="ob-check-body">
              <span className="ob-check-label">Show director interest toggle</span>
              <span className="ob-check-sub">
                Adds the "Would you like to be considered for a Committee Director position?" question and its follow-up.
              </span>
            </div>
          </div>

          {!isNew && form && (
            <>
              <div className="ob-field">
                <label className="ob-label" htmlFor="bld-status">Status</label>
                <select
                  id="bld-status"
                  className="ob-input ob-select"
                  value={form.status}
                  disabled={statusSaving}
                  onChange={(e) => handleStatusChange(e.target.value as ApplicationFormStatus)}
                >
                  {FORM_STATUSES.map((s) => (
                    <option key={s} value={s}>{FORM_STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>

              <div className="ob-row">
                <div className="ob-field">
                  <label className="ob-label" htmlFor="bld-opens">Opens at (optional)</label>
                  <input
                    id="bld-opens"
                    type="datetime-local"
                    className="ob-input"
                    value={opensAt}
                    onChange={(e) => setOpensAt(e.target.value)}
                  />
                </div>
                <div className="ob-field">
                  <label className="ob-label" htmlFor="bld-closes">Closes at (optional)</label>
                  <input
                    id="bld-closes"
                    type="datetime-local"
                    className="ob-input"
                    value={closesAt}
                    onChange={(e) => setClosesAt(e.target.value)}
                  />
                </div>
              </div>

              <p className="bld-effective-note mono">
                {form.effective_open ? "Currently accepting submissions." : "Not currently accepting submissions."}
              </p>
            </>
          )}

          <div className="adm-role-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : isNew ? "Create form" : "Save changes"}
            </button>
            {saved && <span className="adm-role-msg">Saved.</span>}
            {!isNew && (
              <button type="button" className="btn btn-ghost btn-sm adm-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>
        </div>

        <div className="bld-questions">
          <div className="bld-questions-head">
            <h3>Questions <span className="adm-count mono">{questions.length}</span></h3>
            <button type="button" className="btn btn-ghost btn-sm" disabled={isLocked} onClick={addQuestion}>
              <Plus s={14} /> Add question
            </button>
          </div>

          <div className="bld-question-list">
            {questions.map((q, i) => (
              <QuestionEditor
                key={q.id}
                question={q}
                index={i}
                total={questions.length}
                questions={questions}
                disabled={isLocked}
                onChange={(patch) => updateQuestion(i, patch)}
                onRemove={() => removeQuestion(i)}
                onMove={(dir) => moveQuestion(i, dir)}
              />
            ))}
          </div>

          <div className="bld-preview">
            <div className="bld-preview-h">
              <span className="mono">Live preview</span>
              <span className="bld-preview-sub">How applicants see this form</span>
            </div>
            <QuestionForm questions={questions} mode="preview" values={previewValues} onChange={setPreviewValue} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionEditor({
  question,
  index,
  total,
  questions,
  disabled,
  onChange,
  onRemove,
  onMove,
}: {
  question: ApplicationQuestion;
  index: number;
  total: number;
  questions: ApplicationQuestion[];
  disabled: boolean;
  onChange: (patch: Partial<ApplicationQuestion>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const toggleQuestions = questions.filter((q, i) => i !== index && q.type === "toggle");

  return (
    <div className="bld-question">
      <div className="bld-question-head">
        <span className="bld-question-num mono">Q{index + 1}</span>
        <div className="bld-question-actions">
          <button type="button" className="adm-icon-btn" disabled={disabled || index === 0} onClick={() => onMove(-1)} aria-label="Move up">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 14 6-6 6 6" />
            </svg>
          </button>
          <button type="button" className="adm-icon-btn" disabled={disabled || index === total - 1} onClick={() => onMove(1)} aria-label="Move down">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 10 6 6 6-6" />
            </svg>
          </button>
          <button type="button" className="adm-icon-btn" disabled={disabled} onClick={onRemove} aria-label="Remove question">
            <XIcon s={15} />
          </button>
        </div>
      </div>

      <div className="ob-row">
        <div className="ob-field">
          <label className="ob-label">Label</label>
          <input
            className="ob-input"
            value={question.label}
            disabled={disabled}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        </div>
        <div className="ob-field">
          <label className="ob-label">Type</label>
          <select
            className="ob-input ob-select"
            value={question.type}
            disabled={disabled}
            onChange={(e) => onChange(typeChangePatch(e.target.value as QuestionType))}
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>{QUESTION_TYPE_LABEL[t]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bld-question-opts">
        <label className="ob-check-row">
          <input
            type="checkbox"
            checked={question.required}
            disabled={disabled}
            onChange={(e) => onChange({ required: e.target.checked })}
          />
          <span className="ob-check-label">Required</span>
        </label>
        {question.type !== "toggle" && question.type !== "file" && question.type !== "slider" && (
          <div className="ob-field">
            <label className="ob-label">Placeholder (optional)</label>
            <input
              className="ob-input"
              value={question.placeholder ?? ""}
              disabled={disabled}
              onChange={(e) => onChange({ placeholder: e.target.value || null })}
            />
          </div>
        )}
      </div>

      {question.type === "select" && (
        <div className="ob-field">
          <label className="ob-label">Options (one per line)</label>
          <textarea
            className="ob-input adm-textarea"
            rows={3}
            disabled={disabled}
            value={(question.options ?? []).join("\n")}
            onChange={(e) => onChange({ options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />
        </div>
      )}

      {question.type === "long_text" && (
        <div className="ob-field">
          <label className="ob-label">Word limit (optional)</label>
          <input
            type="number"
            min={1}
            className="ob-input"
            disabled={disabled}
            value={question.word_limit ?? ""}
            onChange={(e) => onChange({ word_limit: e.target.value ? Number(e.target.value) : null })}
          />
        </div>
      )}

      {question.type === "slider" && (
        <div className="ob-row">
          <div className="ob-field">
            <label className="ob-label">Min</label>
            <input
              type="number"
              className="ob-input"
              disabled={disabled}
              value={sliderOrDefault(question).min}
              onChange={(e) => onChange({ slider: { ...sliderOrDefault(question), min: Number(e.target.value) } })}
            />
          </div>
          <div className="ob-field">
            <label className="ob-label">Max</label>
            <input
              type="number"
              className="ob-input"
              disabled={disabled}
              value={sliderOrDefault(question).max}
              onChange={(e) => onChange({ slider: { ...sliderOrDefault(question), max: Number(e.target.value) } })}
            />
          </div>
          <div className="ob-field">
            <label className="ob-label">Unit</label>
            <input
              className="ob-input"
              disabled={disabled}
              value={sliderOrDefault(question).unit}
              onChange={(e) => onChange({ slider: { ...sliderOrDefault(question), unit: e.target.value } })}
            />
          </div>
        </div>
      )}

      {question.type === "url" && (
        <div className="ob-field">
          <label className="ob-label">Link type</label>
          <select
            className="ob-input ob-select"
            disabled={disabled}
            value={question.url_kind ?? "generic"}
            onChange={(e) => onChange({ url_kind: e.target.value as UrlKind })}
          >
            {URL_KINDS.map((k) => (
              <option key={k} value={k}>{URL_KIND_LABEL[k]}</option>
            ))}
          </select>
        </div>
      )}

      <details className="bld-advanced">
        <summary className="mono">Advanced</summary>
        <div className="ob-row">
          <div className="ob-field">
            <label className="ob-label">Autofill from profile</label>
            <select
              className="ob-input ob-select"
              disabled={disabled}
              value={question.autofill ?? ""}
              onChange={(e) => onChange({ autofill: (e.target.value || null) as AutofillField | null })}
            >
              <option value="">None</option>
              {AUTOFILL_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="ob-field">
            <label className="ob-label">Save to profile</label>
            <select
              className="ob-input ob-select"
              disabled={disabled}
              value={question.save_back ?? ""}
              onChange={(e) => onChange({ save_back: (e.target.value || null) as SaveBackField | null })}
            >
              <option value="">None</option>
              {SAVE_BACK_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {toggleQuestions.length > 0 && (
          <div className="ob-field">
            <label className="ob-label">Show only if</label>
            <select
              className="ob-input ob-select"
              disabled={disabled}
              value={question.conditional?.question_id ?? ""}
              onChange={(e) =>
                onChange({ conditional: e.target.value ? { question_id: e.target.value, equals: true } : null })
              }
            >
              <option value="">Always show</option>
              {toggleQuestions.map((q) => (
                <option key={q.id} value={q.id}>{q.label || "(untitled toggle)"}</option>
              ))}
            </select>
          </div>
        )}
      </details>
    </div>
  );
}
