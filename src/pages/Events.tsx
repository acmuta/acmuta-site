import { useState, useEffect, useRef } from "react";
import { Reveal } from "@/components/Reveal";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import {
  getEvents,
  getCommittees,
  type EventItem,
  type Committee,
} from "@/lib/api";

// ─── Toast ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function committeeName(id: string | null, committees: Committee[]) {
  if (!id) return "All of ACM";
  return committees.find((c) => c.id === id)?.name ?? "ACM";
}

// ─── Event row (expandable) ───────────────────────────────────────────────────

function EventRow({
  e,
  committees,
  onAdd,
}: {
  e: EventItem;
  committees: Committee[];
  onAdd: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const d = new Date(e.start_time);

  return (
    <div
      className={`ev-row${open ? " open" : ""}`}
      onClick={() => setOpen(!open)}
      role="button"
      tabIndex={0}
      onKeyDown={(k) => {
        if (k.key === "Enter" || k.key === " ") {
          k.preventDefault();
          setOpen(!open);
        }
      }}
      aria-expanded={open}
    >
      <div className="ev-date">
        <div className="mo">
          {d.toLocaleDateString("en-US", { month: "short" })}
        </div>
        <div className="dy tnum">{d.getDate()}</div>
      </div>
      <div className="ev-main">
        <div className="ev-titlewrap">
          <div className="ev-title">{e.title}</div>
          <div className="ev-when mono">
            {fmtTime(e.start_time)} – {fmtTime(e.end_time)}
          </div>
        </div>
        <div className="ev-metarow">
          <span className="ev-loc">{e.location}</span>
          <span className="ev-badge mono">
            {committeeName(e.committee_id, committees)}
          </span>
        </div>
      </div>
      <div className="ev-detail">
        <div className="ev-detail-in">
          <p>{e.description}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={(ev) => {
                ev.stopPropagation();
                onAdd(e.title);
              }}
            >
              Add to my calendar <Arrow s={13} />
            </button>
            {e.google_photos_url && (
              <a
                className="btn btn-ghost"
                href={e.google_photos_url}
                target="_blank"
                rel="noreferrer"
                onClick={(ev) => ev.stopPropagation()}
              >
                Photos <Arrow s={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mini calendar ────────────────────────────────────────────────────────────

function MiniCalendar({
  events,
  committees,
  onAdd,
}: {
  events: EventItem[];
  committees: Committee[];
  onAdd: (title: string) => void;
}) {
  const months = [...new Set(events.map((e) => e.start_time.slice(0, 7)))].sort();
  const [mi, setMi] = useState(() => {
    const now = new Date().toISOString().slice(0, 7);
    const idx = months.findIndex((m) => m >= now);
    return idx >= 0 ? idx : 0;
  });

  const idx = Math.max(0, Math.min(mi, months.length - 1));
  const ym = months[idx] ?? new Date().toISOString().slice(0, 7);
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const startPad = first.getDay();
  const days = new Date(y, m, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const evFor = (d: number) =>
    events.filter((e) => {
      const dt = new Date(e.start_time);
      return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
    });

  const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="ev-toolbar" style={{ justifyContent: "space-between" }}>
        <div className="seg">
          <button onClick={() => setMi(Math.max(0, idx - 1))} disabled={idx === 0}>
            ← Prev
          </button>
          <button
            onClick={() => setMi(Math.min(months.length - 1, idx + 1))}
            disabled={idx === months.length - 1}
          >
            Next →
          </button>
        </div>
        <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
          {label}
        </span>
      </div>
      <div className="cal">
        <div className="cal-head">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="cal-grid">
          {cells.map((d, i) => (
            <div className={`cal-cell${d ? "" : " muted"}`} key={i}>
              {d && <span className="tnum">{d}</span>}
              {d &&
                evFor(d).map((e) => (
                  <span
                    className="cal-ev"
                    key={e.id}
                    title={e.title}
                    onClick={() => onAdd(e.title)}
                  >
                    {e.title}
                  </span>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Events = () => {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [when, setWhen] = useState<"upcoming" | "past">("upcoming");
  const [fire, toast] = useToast();

  useEffect(() => {
    getEvents().then(setEvents);
    getCommittees().then(setCommittees);
  }, []);

  if (!events) return <PageLoading />;

  const now = new Date();
  const sorted = [...events].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
  const upcoming = sorted.filter((e) => new Date(e.start_time) >= now);
  const past = sorted.filter((e) => new Date(e.start_time) < now).reverse();
  const shown = when === "upcoming" ? upcoming : past;

  const add = (title: string) => fire(`Added "${title}" to your calendar (demo)`);

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              WHAT'S ON
            </span>
            <h1 className="page-h1">
              Show <span className="amp">up.</span>
            </h1>
            <p className="page-intro">
              Workshops, demos, socials, and the occasional all-nighter. Something
              on the calendar most weeks, open to every member.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <div className="ev-toolbar" style={{ justifyContent: "space-between" }}>
            <div className="seg">
              <button
                className={when === "upcoming" ? "on" : ""}
                onClick={() => setWhen("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={when === "past" ? "on" : ""}
                onClick={() => setWhen("past")}
              >
                Past
              </button>
            </div>
            <div className="seg">
              <button
                className={view === "list" ? "on" : ""}
                onClick={() => setView("list")}
              >
                List
              </button>
              <button
                className={view === "calendar" ? "on" : ""}
                onClick={() => setView("calendar")}
              >
                Calendar
              </button>
            </div>
          </div>

          {view === "list" ? (
            <div className="ev-list">
              {shown.map((e) => (
                <EventRow key={e.id} e={e} committees={committees} onAdd={add} />
              ))}
              {shown.length === 0 && (
                <p style={{ color: "var(--text-dim)", padding: "30px 0" }}>
                  Nothing here yet. Check back soon.
                </p>
              )}
            </div>
          ) : (
            <MiniCalendar events={events} committees={committees} onAdd={add} />
          )}
        </div>
      </section>

      {toast}
    </div>
  );
};

export default Events;
