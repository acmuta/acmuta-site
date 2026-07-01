import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Arrow } from "@/components/icons";

const REASONS = [
  { value: "question",    label: "General question" },
  { value: "sponsorship", label: "Sponsorship inquiry" },
  { value: "partnership", label: "Partnership / collaboration" },
  { value: "complaint",   label: "Complaint or concern" },
  { value: "other",       label: "Something else" },
];

const SUBJECT_MAP: Record<string, string> = {
  question:    "General Question - ACM at UTA",
  sponsorship: "Sponsorship Inquiry - ACM at UTA",
  partnership: "Partnership Inquiry - ACM at UTA",
  complaint:   "Concern - ACM at UTA",
  other:       "Message - ACM at UTA",
};

const APPLIES = [
  {
    t: "Committee member",
    d: "Join a Create or Research dev/research team. Applications open each semester.",
    k: "CREATE · RESEARCH",
  },
  {
    t: "Mentor or mentee",
    d: "Get paired through Educate's mentor/mentee program, or sign up to mentor.",
    k: "EDUCATE",
  },
  {
    t: "Officer & director roles",
    d: "Help run Marketing, Outreach, or Community. Roles open between semesters.",
    k: "STAFF COMMITTEES",
  },
];

const Contact = () => {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [reason, setReason] = useState("question");
  const [msg, setMsg]       = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(SUBJECT_MAP[reason] ?? "Message - ACM at UTA");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${msg}`
    );
    window.location.href = `mailto:acm.uta@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              GET IN TOUCH
            </span>
            <h1 className="page-h1">
              Come say <span className="amp">hi.</span>
            </h1>
            <p className="page-intro">
              Questions, sponsorship, or you just want in? Reach out, or find us
              where we already are.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap ct-grid">
          {/* Left: links + involvement */}
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 8, display: "inline-flex" }}>
              <span className="node" />
              WHERE TO FIND US
            </span>
            <div className="contact-line">
              <span className="cl-k">Discord</span>
              <a className="cl-v" href="https://discord.gg/yXggXURBVQ" target="_blank" rel="noreferrer">
                discord.gg/yXggXURBVQ
              </a>
            </div>
            <div className="contact-line">
              <span className="cl-k">Email</span>
              <a className="cl-v" href="mailto:acm.uta@gmail.com">
                acm.uta@gmail.com
              </a>
            </div>
            <div className="contact-line">
              <span className="cl-k">Instagram</span>
              <a className="cl-v" href="https://instagram.com/acmuta" target="_blank" rel="noreferrer">
                @acmuta
              </a>
            </div>
            <div className="contact-line">
              <span className="cl-k">We meet</span>
              <span className="cl-v">ERB, UT Arlington · most weeks</span>
            </div>

            <div style={{ marginTop: 44 }}>
              <span className="tag mono" style={{ marginBottom: 18, display: "inline-flex" }}>
                <span className="node" />
                WAYS TO GET INVOLVED
              </span>
              {APPLIES.map((a, i) => (
                <div className="apply-row" key={i}>
                  <span className="anum">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{a.t}</h4>
                    <p>{a.d}</p>
                    <span
                      className="mono"
                      style={{
                        color: "var(--text-faint)",
                        fontSize: "0.62rem",
                        marginTop: 6,
                        display: "inline-block",
                      }}
                    >
                      {a.k}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal>
            <div className="involve-card">
              <h4 style={{ marginBottom: 6 }}>Send a message</h4>
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginBottom: 20 }}>
                Fills in your email app - just hit send from there.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label>Name</label>
                  <input
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Your email</label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Reason for reaching out</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{
                      background: "var(--bg-1)",
                      color: "var(--text)",
                      border: "1px solid var(--line-2)",
                      borderRadius: "var(--r)",
                      padding: "10px 12px",
                      fontSize: "0.95rem",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  >
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea
                    required
                    placeholder="Tell us what you're thinking…"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Open in email app <Arrow s={13} />
                </button>
              </form>
              <p
                style={{
                  color: "var(--text-faint)",
                  fontSize: "0.78rem",
                  marginTop: 14,
                  textAlign: "center",
                }}
              >
                Or email us directly at{" "}
                <a href="mailto:acm.uta@gmail.com" style={{ color: "var(--accent)" }}>
                  acm.uta@gmail.com
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Contact;
