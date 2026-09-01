import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import type { Profile } from "@/lib/auth";
import {
  getApplicationFormDetail,
  getMyApplication,
  submitApplication,
  uploadResume,
  TERM_LABEL,
  DIRECTOR_TOGGLE_QUESTION_ID,
  type ApplicationFormDetail,
  type ApplicationSubmission,
  type AutofillField,
} from "@/lib/api";
import { useQuestionForm, QuestionForm } from "@/components/applications/QuestionForm";
import { SubmissionView } from "@/components/applications/SubmissionView";

// Maps a question's `autofill` field to the profile column it's pulled from.
const AUTOFILL_MAP: Record<AutofillField, keyof Profile> = {
  name: "full_name",
  pronouns: "pronouns",
  email: "email",
  major: "major",
  grade: "classification",
};

function buildInitialValues(form: ApplicationFormDetail, profile: Profile | null): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  if (!profile) return values;
  for (const q of form.questions) {
    if (!q.autofill) continue;
    const v = profile[AUTOFILL_MAP[q.autofill]];
    if (typeof v === "string" && v) values[q.id] = v;
  }
  return values;
}

function FormHeader({
  form,
  committeeSlug,
  track,
}: {
  form: ApplicationFormDetail;
  committeeSlug?: string;
  track?: string;
}) {
  return (
    <section className="page-top">
      <div className="wrap">
        <Reveal>
          <Link
            to={`/apply/${committeeSlug}/${track}`}
            className="mono"
            style={{ color: "var(--text-faint)", display: "inline-flex", gap: 8, marginBottom: 26 }}
          >
            ← {form.committee_name.toUpperCase()}
          </Link>
          <span className="tag mono page-eyebrow">
            <span className="node" />
            {TERM_LABEL[form.term].toUpperCase()} {form.year}
          </span>
          <h1 className="page-h1" style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)" }}>
            {form.title}
          </h1>
          {form.description && <p className="page-intro">{form.description}</p>}
        </Reveal>
      </div>
    </section>
  );
}

interface ApplyFormFillProps {
  form: ApplicationFormDetail;
  profile: Profile | null;
  userId: string;
  onSubmitted: (submission: ApplicationSubmission | null) => void;
}

// Mounted only once the form + profile are loaded, so the question form's
// initial values (autofill) are seeded correctly on first render.
function ApplyFormFill({ form, profile, userId, onSubmitted }: ApplyFormFillProps) {
  const { refreshProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { values, setValue, errors, isValid } = useQuestionForm(
    form.questions,
    buildInitialValues(form, profile),
    form.show_director_toggle
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fileQuestion = form.questions.find((q) => q.type === "file");
      let resumePath: string | null = null;
      if (fileQuestion) {
        const fileVal = values[fileQuestion.id];
        if (fileVal instanceof File) {
          resumePath = await uploadResume(form.id, userId, fileVal);
        }
      }

      const answers: Record<string, unknown> = {};
      for (const q of form.questions) {
        if (q.type === "file") continue;
        if (q.id in values) answers[q.id] = values[q.id];
      }

      const wantsDirector = form.show_director_toggle ? Boolean(values[DIRECTOR_TOGGLE_QUESTION_ID]) : null;

      await submitApplication(userId, {
        form_id: form.id,
        answers,
        wants_director: wantsDirector,
        resume_path: resumePath,
      });
      await refreshProfile();
      onSubmitted(await getMyApplication(userId, form.id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      if (message.includes("already submitted")) {
        onSubmitted(await getMyApplication(userId, form.id));
      } else {
        setSubmitError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="qf-page" onSubmit={handleSubmit}>
      <QuestionForm
        questions={form.questions}
        mode="fill"
        values={values}
        onChange={setValue}
        errors={errors}
        showDirectorToggle={form.show_director_toggle}
      />
      {submitError && <p className="qf-error">{submitError}</p>}
      <div className="qf-submit-row">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit application"} <Arrow s={13} />
        </button>
      </div>
    </form>
  );
}

export default function ApplyForm() {
  const { committeeSlug, track, formId } = useParams<{ committeeSlug: string; track: string; formId: string }>();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ApplicationFormDetail | null | undefined>(undefined);
  const [submission, setSubmission] = useState<ApplicationSubmission | null | undefined>(undefined);

  useEffect(() => {
    if (!authLoading && !user) navigate("/signin", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!formId) return;
    getApplicationFormDetail(formId).then(setForm);
  }, [formId]);

  useEffect(() => {
    if (!formId || !user) return;
    getMyApplication(user.id, formId).then(setSubmission);
  }, [formId, user]);

  if (authLoading || form === undefined || submission === undefined || !user) return <PageLoading />;
  if (!form) return <Navigate to="/apply" replace />;

  if (submission) {
    return (
      <div>
        <FormHeader form={form} committeeSlug={committeeSlug} track={track} />
        <section className="section">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <Reveal>
              <p className="qf-submitted-note">
                You submitted this application on {new Date(submission.submitted_at).toLocaleDateString()}.
              </p>
              <SubmissionView
                questions={submission.questions}
                answers={submission.answers}
                resumePath={submission.resume_path}
                showDirectorToggle={submission.show_director_toggle}
                status={submission.status}
              />
            </Reveal>
          </div>
        </section>
      </div>
    );
  }

  if (!form.effective_open) {
    return (
      <div>
        <FormHeader form={form} committeeSlug={committeeSlug} track={track} />
        <section className="section">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <Reveal>
              <p className="qf-closed-note">This application is currently closed.</p>
            </Reveal>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <FormHeader form={form} committeeSlug={committeeSlug} track={track} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Reveal>
            <ApplyFormFill form={form} profile={profile} userId={user.id} onSubmitted={setSubmission} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
