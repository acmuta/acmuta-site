import { useState, useRef } from "react";
import { Reveal } from "@/components/Reveal";
import { Arrow } from "@/components/icons";

function useToast() {
  const [msg, setMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fire = (m: string) => {
    setMsg(m);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMsg(""), 2600);
  };
  const node = <div className={`toast${msg ? " show" : ""}`}>{msg || " "}</div>;
  return [fire, node] as const;
}

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
  const [fire, toast] = useToast();
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    fire("Message sent (demo). We'll be in touch");
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
              <a className="cl-v" href="https://discord.gg/acmuta" target="_blank" rel="noreferrer">
                discord.gg/acmuta
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
              <p style={{ color: "var(--text-faint)", fontSize: "0.85rem", marginTop: 18 }}>
                Applications open in a Google Form each semester. You sign in with
                your Mavs email to apply.
              </p>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal>
            <div className="involve-card">
              <h4 style={{ marginBottom: 18 }}>Send a message</h4>
              <form onSubmit={submit}>
                <div className="field">
                  <label>Name</label>
                  <input required placeholder="Your name" />
                </div>
                <div className="field">
                  <label>Mavs email</label>
                  <input required type="email" placeholder="you@mavs.uta.edu" />
                </div>
                <div className="field">
                  <label>What's up?</label>
                  <textarea required placeholder="Tell us what you're thinking…" />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {sent ? "Sent ✓" : "Send message"} <Arrow s={13} />
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
                Not wired to a backend yet — Supabase coming soon.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {toast}
    </div>
  );
};

export default Contact;
