import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import type { ApplicationQuestion, UrlKind } from "@/lib/api";

export type QuestionMode = "fill" | "preview" | "readonly";

const URL_KIND_PLACEHOLDER: Record<UrlKind, string> = {
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  portfolio: "https://your-site.com",
  generic: "https://",
};

export function isQuestionVisible(question: ApplicationQuestion, answers: Record<string, unknown>): boolean {
  if (!question.conditional) return true;
  return answers[question.conditional.question_id] === question.conditional.equals;
}

interface QuestionRendererProps {
  question: ApplicationQuestion;
  mode: QuestionMode;
  value: unknown;
  onChange?: (value: unknown) => void;
  error?: string | null;
  onViewResume?: () => void;
}

export function QuestionRenderer({ question, mode, value, onChange, error, onViewResume }: QuestionRendererProps) {
  const readonly = mode === "readonly";
  const id = `q-${question.id}`;

  return (
    <div className="qf-field">
      <label className="ob-label qf-label" htmlFor={id}>
        {question.label}
        {question.required && !readonly && <span className="qf-required">*</span>}
      </label>
      <QuestionInput
        id={id}
        question={question}
        readonly={readonly}
        value={value}
        onChange={onChange}
        onViewResume={onViewResume}
      />
      {error && <p className="qf-error">{error}</p>}
    </div>
  );
}

function QuestionInput({
  id,
  question,
  readonly,
  value,
  onChange,
  onViewResume,
}: {
  id: string;
  question: ApplicationQuestion;
  readonly: boolean;
  value: unknown;
  onChange?: (value: unknown) => void;
  onViewResume?: () => void;
}) {
  switch (question.type) {
    case "short_text":
    case "email":
    case "phone":
    case "student_id": {
      if (readonly) return <p className="qf-readonly-value">{(value as string) || "-"}</p>;
      const inputType = question.type === "email" ? "email" : question.type === "phone" ? "tel" : "text";
      return (
        <input
          id={id}
          type={inputType}
          className="ob-input"
          value={(value as string) ?? ""}
          placeholder={question.placeholder ?? undefined}
          inputMode={question.type === "student_id" ? "numeric" : undefined}
          maxLength={question.type === "student_id" ? 10 : undefined}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
    }
    case "long_text": {
      const text = (value as string) ?? "";
      if (readonly) return <p className="qf-readonly-value qf-readonly-multiline">{text || "-"}</p>;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      return (
        <>
          <textarea
            id={id}
            className="ob-input adm-textarea"
            rows={4}
            value={text}
            placeholder={question.placeholder ?? undefined}
            onChange={(e) => onChange?.(e.target.value)}
          />
          {question.word_limit != null && (
            <span className={`qf-word-count${words > question.word_limit ? " over" : ""}`}>
              {words} / {question.word_limit} words
            </span>
          )}
        </>
      );
    }
    case "select": {
      if (readonly) return <p className="qf-readonly-value">{(value as string) || "-"}</p>;
      return (
        <select
          id={id}
          className="ob-input ob-select"
          value={(value as string) ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="" disabled>Select…</option>
          {(question.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    case "toggle":
      return (
        <div className="qf-toggle-row">
          <Switch checked={!!value} disabled={readonly} onCheckedChange={(checked) => onChange?.(checked)} />
          <span className="qf-toggle-state">{value ? "Yes" : "No"}</span>
        </div>
      );
    case "url": {
      const str = (value as string) ?? "";
      if (readonly) {
        return str ? (
          <a className="qf-readonly-link" href={str} target="_blank" rel="noreferrer">{str}</a>
        ) : (
          <p className="qf-readonly-value">-</p>
        );
      }
      return (
        <input
          id={id}
          type="url"
          className="ob-input"
          value={str}
          placeholder={question.placeholder ?? URL_KIND_PLACEHOLDER[question.url_kind ?? "generic"]}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
    }
    case "file": {
      if (readonly) {
        return value ? (
          <button type="button" className="btn btn-ghost qf-resume-btn" onClick={onViewResume}>View resume</button>
        ) : (
          <p className="qf-readonly-value">No file uploaded</p>
        );
      }
      const fileName = value instanceof File ? value.name : typeof value === "string" ? value : null;
      return (
        <div className="qf-file-row">
          <input
            id={id}
            type="file"
            accept="application/pdf"
            className="qf-file-input"
            onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
          />
          {fileName && <span className="qf-file-name">{fileName}</span>}
        </div>
      );
    }
    case "slider": {
      const cfg = question.slider ?? { min: 0, max: 100, unit: "" };
      const num = typeof value === "number" ? value : cfg.min;
      if (readonly) return <p className="qf-readonly-value">{num} {cfg.unit}</p>;
      return (
        <div className="qf-slider-row">
          <Slider min={cfg.min} max={cfg.max} step={1} value={[num]} onValueChange={([v]) => onChange?.(v)} />
          <span className="qf-slider-value mono">{num} {cfg.unit}</span>
        </div>
      );
    }
    default:
      return null;
  }
}
