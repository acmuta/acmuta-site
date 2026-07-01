import { useCallback, useMemo, useState } from "react";
import { QuestionRenderer, isQuestionVisible, type QuestionMode } from "./QuestionRenderer";
import { validateMavsEmail, validateStudentId, validateUrl } from "@/lib/validation";
import { DIRECTOR_TOGGLE_QUESTION_ID, type ApplicationQuestion } from "@/lib/api";

// Questions visible to the applicant: respects per-question `conditional`
// rules, and additionally hides the director-interest toggle (and its
// conditional follow-up) when the form has show_director_toggle disabled.
export function getVisibleQuestions(
  questions: ApplicationQuestion[],
  answers: Record<string, unknown>,
  showDirectorToggle = true
): ApplicationQuestion[] {
  return questions.filter((q) => {
    if (!showDirectorToggle) {
      if (q.id === DIRECTOR_TOGGLE_QUESTION_ID) return false;
      if (q.conditional?.question_id === DIRECTOR_TOGGLE_QUESTION_ID) return false;
    }
    return isQuestionVisible(q, answers);
  });
}

export function validateAnswers(
  questions: ApplicationQuestion[],
  values: Record<string, unknown>,
  showDirectorToggle = true
): Record<string, string> {
  const errors: Record<string, string> = {};
  const visible = getVisibleQuestions(questions, values, showDirectorToggle);

  for (const q of visible) {
    const value = values[q.id];
    const isEmpty =
      value == null ||
      (typeof value === "string" && value.trim() === "") ||
      (q.type === "file" && !(value instanceof File) && typeof value !== "string");

    if (isEmpty) {
      if (q.required) errors[q.id] = "This field is required.";
      continue;
    }

    switch (q.type) {
      case "email": {
        const err = validateMavsEmail(value as string);
        if (err) errors[q.id] = err;
        break;
      }
      case "student_id": {
        const err = validateStudentId(value as string);
        if (err) errors[q.id] = err;
        break;
      }
      case "url": {
        const err = validateUrl(value as string, q.url_kind);
        if (err) errors[q.id] = err;
        break;
      }
      case "long_text": {
        if (q.word_limit != null) {
          const words = (value as string).trim().split(/\s+/).filter(Boolean).length;
          if (words > q.word_limit) {
            errors[q.id] = `Limit is ${q.word_limit} words (currently ${words}).`;
          }
        }
        break;
      }
      default:
        break;
    }
  }

  return errors;
}

export function useQuestionForm(
  questions: ApplicationQuestion[],
  initialValues?: Record<string, unknown>,
  showDirectorToggle = true
) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues ?? {});

  const setValue = useCallback((questionId: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const errors = useMemo(
    () => validateAnswers(questions, values, showDirectorToggle),
    [questions, values, showDirectorToggle]
  );
  const isValid = Object.keys(errors).length === 0;

  return { values, setValues, setValue, errors, isValid };
}

interface QuestionFormProps {
  questions: ApplicationQuestion[];
  mode: QuestionMode;
  values: Record<string, unknown>;
  onChange?: (questionId: string, value: unknown) => void;
  errors?: Record<string, string>;
  onViewResume?: (questionId: string) => void;
  showDirectorToggle?: boolean;
}

export function QuestionForm({ questions, mode, values, onChange, errors, onViewResume, showDirectorToggle = true }: QuestionFormProps) {
  const visible = getVisibleQuestions(questions, values, showDirectorToggle);

  return (
    <div className="qf-form">
      {visible.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          mode={mode}
          value={values[q.id]}
          onChange={onChange ? (v) => onChange(q.id, v) : undefined}
          error={errors?.[q.id]}
          onViewResume={onViewResume ? () => onViewResume(q.id) : undefined}
        />
      ))}
    </div>
  );
}
