import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { Plus, EditIcon } from "@/components/icons";
import {
  getAdminApplicationForms,
  APPLICATION_TYPE_LABEL,
  TERM_LABEL,
  FORM_STATUS_LABEL,
  type ApplicationFormDetail,
} from "@/lib/api";

export default function AdminApplicationForms() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<ApplicationFormDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminApplicationForms()
      .then(setForms)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">Applications</h1>
        <div className="adm-head-controls">
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/admin/applications/builder")}>
            <Plus s={15} /> New form
          </button>
        </div>
      </div>

      {forms.length === 0 ? (
        <p className="pf-empty">No application forms yet.</p>
      ) : (
        <Reveal className="adm-form-grid" stagger>
          {forms.map((f) => (
            <div key={f.id} className="adm-form-card">
              <div className="adm-form-card-head">
                <div className="adm-form-card-id">
                  <span className="adm-app-name">{f.title}</span>
                  <span className="adm-app-meta mono">
                    {f.committee_name} · {APPLICATION_TYPE_LABEL[f.application_type]} · {TERM_LABEL[f.term]} {f.year}
                  </span>
                </div>
                <span className={`adm-form-status adm-form-status--${f.status}`}>
                  {FORM_STATUS_LABEL[f.status]}
                </span>
              </div>

              <div className="adm-form-subs">
                <span className="adm-form-subs-n tnum">{f.submission_count}</span>
                <span className="adm-form-subs-l">submission{f.submission_count === 1 ? "" : "s"}</span>
              </div>

              <div className="adm-role-row">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(`/admin/applications/builder/${f.id}`)}>
                  <EditIcon s={14} /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm adm-form-card-view"
                  onClick={() => navigate(`/admin/applications/${f.id}/submissions`)}
                >
                  View submissions{f.submission_count > 0 ? ` (${f.submission_count})` : ""}
                </button>
              </div>
            </div>
          ))}
        </Reveal>
      )}
    </div>
  );
}
