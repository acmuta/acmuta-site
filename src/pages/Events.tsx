import { useState, useEffect } from "react";
import { Reveal } from "@/components/Reveal";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import {
  getEvents,
  getCommittees,
  type EventItem,
  type Committee,
} from "@/lib/api";

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function toIcalDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function googleCalendarUrl(e: EventItem): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${toIcalDate(e.start_time)}/${toIcalDate(e.end_time)}`,
  });
  if (e.description) params.set("details", e.description);
  if (e.location) params.set("location", e.location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

function downloadIcs(e: EventItem): void {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ACM at UTA//Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toIcalDate(e.start_time)}`,
    `DTEND:${toIcalDate(e.end_time)}`,
    `SUMMARY:${e.title}`,
    ...(e.description ? [`DESCRIPTION:${e.description.replace(/\n/g, "\\n")}`] : []),
    ...(e.location ? [`LOCATION:${e.location}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.title.replace(/[^a-z0-9]+/gi, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Calendar picker modal ────────────────────────────────────────────────────

function CalPicker({ e, onClose }: { e: EventItem; onClose: () => void }) {
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => { if (ev.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="calpick-backdrop" onClick={onClose}>
      <div className="calpick" onClick={(ev) => ev.stopPropagation()}>
        <button className="calpick-x" onClick={onClose} aria-label="Close">✕</button>
        <p className="calpick-eye mono">ADD TO CALENDAR</p>
        <h3 className="calpick-title">{e.title}</h3>
        <p className="calpick-when mono">
          {new Date(e.start_time).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          })}
          {" · "}
          {fmtTime(e.start_time)} – {fmtTime(e.end_time)}
        </p>
        {e.location && <p className="calpick-loc">{e.location}</p>}
        <div className="calpick-btns">
          <a
            href={googleCalendarUrl(e)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ justifyContent: "center" }}
            onClick={onClose}
          >
            Google Calendar <Arrow s={13} />
          </a>
          <button
            className="btn btn-ghost"
            style={{ justifyContent: "center" }}
            onClick={() => { downloadIcs(e); onClose(); }}
          >
            Apple / iCal <Arrow s={13} />
          </button>
        </div>
      </div>
    </div>
  );
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
  onAdd: (event: EventItem) => void;
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
              onClick={(ev) => { ev.stopPropagation(); onAdd(e); }}
            >
              Add to calendar <Arrow s={13} />
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
  onAdd: (event: EventItem) => void;
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

  // suppress unused warning — kept for future committee badge display
  void committees;

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
                    onClick={() => onAdd(e)}
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
  const [calTarget, setCalTarget] = useState<EventItem | null>(null);

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
                <EventRow key={e.id} e={e} committees={committees} onAdd={setCalTarget} />
              ))}
              {shown.length === 0 && (
                <p style={{ color: "var(--text-dim)", padding: "30px 0" }}>
                  No events happening right now - check back soon!
                </p>
              )}
            </div>
          ) : (
            <MiniCalendar events={events} committees={committees} onAdd={setCalTarget} />
          )}
        </div>
      </section>

      {calTarget && (
        <CalPicker e={calTarget} onClose={() => setCalTarget(null)} />
      )}
    </div>
  );
};

export default Events;
