import { useMemo } from "react";
import { QuestionForm } from "./QuestionForm";
import {
  getResumeSignedUrl,
  APPLICANT_STATUS_LABEL,
  SUBMISSION_STATUS_LABEL,
  type ApplicationQuestion,
  type SubmissionStatus,
} from "@/lib/api";

interface SubmissionViewProps {
  questions: ApplicationQuestion[];
  answers: Record<string, unknown>;
  resumePath: string | null;
  showDirectorToggle: boolean;
  status: SubmissionStatus;
  context?: "applicant" | "reviewer";
}

export function SubmissionView({
  questions,
  answers,
  resumePath,
  showDirectorToggle,
  status,
  context = "applicant",
}: SubmissionViewProps) {
  const fileQuestion = questions.find((q) => q.type === "file");

  const values = useMemo(() => {
    const v = { ...answers };
    if (fileQuestion && resumePath) v[fileQuestion.id] = resumePath;
    return v;
  }, [answers, resumePath, fileQuestion]);

  const handleViewResume = async () => {
    if (!resumePath) return;
    const url = await getResumeSignedUrl(resumePath);
    if (url) window.open(url, "_blank", "noreferrer");
  };

  const statusLabel =
    context === "applicant" ? APPLICANT_STATUS_LABEL[status] : SUBMISSION_STATUS_LABEL[status];

  return (
    <div className="sub-view">
      <span className={`sub-status sub-status--${status}`}>{statusLabel}</span>
      <QuestionForm
        questions={questions}
        mode="readonly"
        values={values}
        showDirectorToggle={showDirectorToggle}
        onViewResume={fileQuestion ? handleViewResume : undefined}
      />
    </div>
  );
}
