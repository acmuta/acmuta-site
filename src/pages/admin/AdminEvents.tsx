import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Reveal } from "@/components/Reveal";
import { Modal } from "@/components/Modal";
import { Avatar } from "@/components/Avatar";
import { Plus, EditIcon, XIcon, CheckIcon, QrIcon } from "@/components/icons";
import {
  getAdminEvents,
  getEventCategories,
  getCommitteeOptions,
  createEvent,
  updateEvent,
  deleteEvent,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
  getEventAttendees,
  adminCheckIn,
  getCommitteeMembers,
  getRoster,
  type AdminEvent,
  type EventCategory,
  type CommitteeOption,
  type EventAttendee,
  type DirectedCommittee,
} from "@/lib/api";
import type { AdminContext } from "./AdminLayout";

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const RECUR_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12, 14, 16];

const EMPTY_FORM = {
  title: "",
  description: "",
  location: "",
  start_time: "",
  end_time: "",
  committee_id: "",
  category_ids: [] as string[],
  recurringWeeks: 1,
};

const EMPTY_CATEGORY_FORM = {
  name: "",
  bit_value: 0,
  description: "",
};

export default function AdminEvents() {
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [committees, setCommittees] = useState<CommitteeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [qrEvent, setQrEvent] = useState<AdminEvent | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [attendeesEvent, setAttendeesEvent] = useState<AdminEvent | null>(null);
  const [search, setSearch] = useState("");

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catErr, setCatErr] = useState<string | null>(null);

  const lockedCommittee =
    !isAdmin && directedCommittees.length === 1 ? directedCommittees[0].committee_id : null;

  const committeeOptions: CommitteeOption[] = isAdmin
    ? committees
    : directedCommittees.map((c) => ({ id: c.committee_id, name: c.name, slug: c.slug }));

  const loadEvents = () => getAdminEvents().then(setEvents);
  const loadCategories = () => getEventCategories().then(setCategories);

  useEffect(() => {
    Promise.all([
      getAdminEvents(),
      getEventCategories(),
      isAdmin ? getCommitteeOptions() : Promise.resolve([]),
    ])
      .then(([ev, cat, com]) => {
        setEvents(ev);
        setCategories(cat);
        setCommittees(com);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (lockedCommittee && !form.committee_id) {
      setForm((f) => ({ ...f, committee_id: lockedCommittee }));
    }
  }, [lockedCommittee, form.committee_id]);

  const toggleCategory = (id: string) => {
    setForm((f) => ({
      ...f,
      category_ids: f.category_ids.includes(id)
        ? f.category_ids.filter((c) => c !== id)
        : [...f.category_ids, id],
    }));
  };

  const startEdit = (ev: AdminEvent) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description,
      location: ev.location,
      start_time: toLocalInput(ev.start_time),
      end_time: toLocalInput(ev.end_time),
      committee_id: ev.committee_id ?? "",
      category_ids: ev.category_ids,
      recurringWeeks: 1,
    });
    setErr(null);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM, committee_id: lockedCommittee ?? "" });
    setErr(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.start_time || !form.end_time) {
      setErr("Title, start time, and end time are required.");
      return;
    }
    if (new Date(form.end_time) <= new Date(form.start_time)) {
      setErr("End time must be after start time.");
      return;
    }
    setErr(null);
    setSubmitting(true);
    try {
      const eventInput = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
        committee_id: form.committee_id || null,
        category_ids: form.category_ids,
      };
      if (editingId) {
        await updateEvent(editingId, eventInput);
      } else {
        await createEvent({ ...eventInput, recurringWeeks: form.recurringWeeks });
      }
      setForm({ ...EMPTY_FORM, committee_id: lockedCommittee ?? "" });
      setEditingId(null);
      setShowForm(false);
      await loadEvents();
    } catch {
      setErr(`Something went wrong ${editingId ? "saving" : "creating"} the event. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await deleteEvent(id);
    await loadEvents();
  };

  const startEditCategory = (c: EventCategory) => {
    setEditingCategoryId(c.id);
    setCategoryForm({ name: c.name, bit_value: c.bit_value, description: c.description ?? "" });
    setCatErr(null);
    setShowCategoryForm(true);
  };

  const cancelCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategoryId(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setCatErr(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCatErr("Category name is required.");
      return;
    }
    setCatErr(null);
    setCatSubmitting(true);
    try {
      const input = {
        name: categoryForm.name.trim(),
        bit_value: categoryForm.bit_value,
        description: categoryForm.description.trim() || null,
      };
      if (editingCategoryId) {
        await updateEventCategory(editingCategoryId, input);
      } else {
        await createEventCategory(input);
      }
      cancelCategoryForm();
      await loadCategories();
    } catch {
      setCatErr(`Something went wrong ${editingCategoryId ? "saving" : "creating"} the category. Please try again.`);
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? It will be removed from any events using it. This cannot be undone.")) return;
    try {
      await deleteEventCategory(id);
      await loadCategories();
    } catch {
      setCatErr("Couldn't delete this category. Please try again.");
    }
  };

  const checkInUrl = (token: string) => `${window.location.origin}/checkin?token=${token}`;

  const q = search.trim().toLowerCase();
  const matchesSearch = (ev: AdminEvent) =>
    !q ||
    ev.title.toLowerCase().includes(q) ||
    ev.location.toLowerCase().includes(q) ||
    (ev.committee_name ?? "").toLowerCase().includes(q);

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.end_time).getTime() >= now && matchesSearch(e));
  const past = events.filter((e) => new Date(e.end_time).getTime() < now && matchesSearch(e));

  if (loading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">Events</h1>
        <div className="adm-head-controls">
          <input
            type="text"
            className="ob-input adm-filter"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => (showForm ? cancelForm() : setShowForm(true))}>
            {showForm ? "Cancel" : <><Plus s={15} /> New event</>}
          </button>
        </div>
      </div>

      {showForm && (
        <Reveal>
          <form className="adm-form" onSubmit={handleSubmit}>
            <h2 className="adm-section-h">{editingId ? "Edit event" : "New event"}</h2>
            {err && <div className="auth-err">{err}</div>}

            <div className="ob-field">
              <label className="ob-label" htmlFor="ev-title">Title</label>
              <input
                id="ev-title"
                type="text"
                className="ob-input"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>

            <div className="ob-field">
              <label className="ob-label" htmlFor="ev-desc">Description</label>
              <textarea
                id="ev-desc"
                className="ob-input adm-textarea"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="ob-row">
              <div className="ob-field">
                <label className="ob-label" htmlFor="ev-loc">Location</label>
                <input
                  id="ev-loc"
                  type="text"
                  className="ob-input"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
              <div className="ob-field">
                <label className="ob-label" htmlFor="ev-committee">Committee</label>
                <select
                  id="ev-committee"
                  className="ob-input ob-select"
                  value={form.committee_id}
                  disabled={!!lockedCommittee}
                  onChange={(e) => setForm((f) => ({ ...f, committee_id: e.target.value }))}
                >
                  {isAdmin && <option value="">Org-wide</option>}
                  {committeeOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ob-row">
              <div className="ob-field">
                <label className="ob-label" htmlFor="ev-start">Start</label>
                <input
                  id="ev-start"
                  type="datetime-local"
                  className="ob-input"
                  value={form.start_time}
                  onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                  required
                />
              </div>
              <div className="ob-field">
                <label className="ob-label" htmlFor="ev-end">End</label>
                <input
                  id="ev-end"
                  type="datetime-local"
                  className="ob-input"
                  value={form.end_time}
                  onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                  required
                />
              </div>
            </div>

            {categories.length > 0 && (
              <div className="ob-field">
                <span className="ob-label">Categories (highest bit value wins per attendee)</span>
                <div className="adm-cat-grid">
                  {categories.map((c) => (
                    <label
                      key={c.id}
                      className={`adm-cat-chip${form.category_ids.includes(c.id) ? " active" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.category_ids.includes(c.id)}
                        onChange={() => toggleCategory(c.id)}
                      />
                      <span className="adm-cat-check">
                        {form.category_ids.includes(c.id) && <CheckIcon s={13} />}
                      </span>
                      <span className="adm-cat-name">{c.name}</span>
                      <span className="adm-cat-bits mono">+{c.bit_value}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!editingId && (
              <div className="ob-field">
                <label className="ob-label" htmlFor="ev-recur">Repeat weekly</label>
                <select
                  id="ev-recur"
                  className="ob-input ob-select"
                  value={form.recurringWeeks}
                  onChange={(e) => setForm((f) => ({ ...f, recurringWeeks: Number(e.target.value) }))}
                >
                  <option value={1}>Just this one</option>
                  {RECUR_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} weeks</option>
                  ))}
                </select>
              </div>
            )}

            <div className="adm-form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (editingId ? "Saving…" : "Creating…") : editingId ? "Save changes" : "Create event"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </Reveal>
      )}

      {isAdmin && (
        <section className="adm-section">
          <div className="adm-head">
            <h2 className="adm-section-h">Categories</h2>
            <button
              className="btn btn-ghost"
              onClick={() => (showCategoryForm ? cancelCategoryForm() : setShowCategoryForm(true))}
            >
              {showCategoryForm ? "Cancel" : <><Plus s={15} /> New category</>}
            </button>
          </div>

          {catErr && <div className="auth-err">{catErr}</div>}

          {showCategoryForm && (
            <Reveal>
              <form className="adm-form adm-form--inline" onSubmit={handleCategorySubmit}>
                <div className="ob-row">
                  <div className="ob-field">
                    <label className="ob-label" htmlFor="cat-name">Name</label>
                    <input
                      id="cat-name"
                      type="text"
                      className="ob-input"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="ob-field">
                    <label className="ob-label" htmlFor="cat-bits">Bits</label>
                    <input
                      id="cat-bits"
                      type="number"
                      className="ob-input"
                      value={categoryForm.bit_value}
                      onChange={(e) => setCategoryForm((f) => ({ ...f, bit_value: Number(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
                <div className="ob-field">
                  <label className="ob-label" htmlFor="cat-desc">Description</label>
                  <input
                    id="cat-desc"
                    type="text"
                    className="ob-input"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn btn-primary ob-submit" disabled={catSubmitting}>
                  {catSubmitting
                    ? editingCategoryId ? "Saving…" : "Adding…"
                    : editingCategoryId ? "Save changes" : "Add category"}
                </button>
              </form>
            </Reveal>
          )}

          {categories.length === 0 ? (
            <p className="pf-empty">No event categories yet.</p>
          ) : (
            <div className="adm-cat-list">
              {categories.map((c) => (
                <div key={c.id} className="adm-cat-row">
                  <span className="adm-cat-row-name">{c.name}</span>
                  <span className="adm-cat-row-bits mono">+{c.bit_value}</span>
                  <div className="adm-cat-row-actions">
                    <button type="button" className="adm-icon-btn adm-icon-btn-sm" onClick={() => startEditCategory(c)} aria-label={`Edit ${c.name}`}>
                      <EditIcon s={13} />
                    </button>
                    <button className="adm-icon-btn adm-icon-btn-sm" onClick={() => handleDeleteCategory(c.id)} aria-label={`Delete ${c.name}`}>
                      <XIcon s={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="adm-section">
        <div className="adm-section-h"><h2>Upcoming <span className="adm-count mono">{upcoming.length}</span></h2></div>
        {upcoming.length === 0 ? (
          <p className="pf-empty">{q ? "No upcoming events match your search." : "No upcoming events."}</p>
        ) : (
          <div className="adm-event-list">
            {upcoming.map((ev) => (
              <AdminEventRow
                key={ev.id}
                event={ev}
                isAdmin={isAdmin}
                directedCommittees={directedCommittees}
                onShowQr={() => setQrEvent(ev)}
                onEdit={() => startEdit(ev)}
                onAttendees={() => setAttendeesEvent(ev)}
                onDelete={() => handleDelete(ev.id)}
              />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="adm-section">
          <div className="adm-section-h"><h2>Past <span className="adm-count mono">{past.length}</span></h2></div>
          <div className="adm-event-list">
            {past.map((ev) => (
              <AdminEventRow
                key={ev.id}
                event={ev}
                isAdmin={isAdmin}
                directedCommittees={directedCommittees}
                onShowQr={() => setQrEvent(ev)}
                onEdit={() => startEdit(ev)}
                onAttendees={() => setAttendeesEvent(ev)}
                onDelete={() => handleDelete(ev.id)}
                past
              />
            ))}
          </div>
        </section>
      )}

      {qrEvent && (
        <Modal title={`${qrEvent.title} · check-in`} onClose={() => setQrEvent(null)}>
          <div className="adm-qr-card">
            <div className="adm-qr-code">
              <QRCodeSVG value={checkInUrl(qrEvent.qr_token)} size={192} />
            </div>
            <p className="adm-qr-note">
              Expires {new Date(qrEvent.qr_expires_at).toLocaleString()}
            </p>
            <div className="mono adm-qr-url">{checkInUrl(qrEvent.qr_token)}</div>
          </div>
        </Modal>
      )}

      {attendeesEvent && (
        <AttendeesOverlay
          event={attendeesEvent}
          isAdmin={isAdmin}
          onClose={() => setAttendeesEvent(null)}
        />
      )}
    </div>
  );
}

function AdminEventRow({
  event,
  isAdmin,
  directedCommittees,
  onShowQr,
  onEdit,
  onAttendees,
  onDelete,
  past,
}: {
  event: AdminEvent;
  isAdmin: boolean;
  directedCommittees: DirectedCommittee[];
  onShowQr: () => void;
  onEdit: () => void;
  onAttendees: () => void;
  onDelete: () => void;
  past?: boolean;
}) {
  const start = new Date(event.start_time);
  const expired = new Date(event.qr_expires_at).getTime() < Date.now();
  const canManageAttendance =
    isAdmin || (event.committee_id != null && directedCommittees.some((c) => c.committee_id === event.committee_id));

  return (
    <div className={`adm-event-row${past ? " past" : ""}`}>
      <div className="adm-event-main">
        <span className="adm-event-title">{event.title}</span>
        <span className="adm-event-meta mono">
          {start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          {" · "}
          {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          {event.location && ` · ${event.location}`}
          {" · "}
          {event.committee_name ?? "Org-wide"}
        </span>
        {event.categories.length > 0 && (
          <span className="adm-event-cats">
            {event.categories.map((c) => (
              <span key={c} className="adm-event-cat">{c}</span>
            ))}
          </span>
        )}
      </div>
      <div className="adm-event-actions">
        <button className="btn btn-ghost" onClick={onShowQr} disabled={expired}>
          <QrIcon s={14} /> {expired ? "QR expired" : "Show QR"}
        </button>
        {canManageAttendance && (
          <button className="btn btn-ghost" onClick={onAttendees}>Attendees</button>
        )}
        <button className="btn btn-ghost" onClick={onEdit}>
          <EditIcon s={14} /> Edit
        </button>
        <button className="adm-icon-btn" onClick={onDelete} aria-label="Delete event">
          <XIcon s={16} />
        </button>
      </div>
    </div>
  );
}

interface AttendeeCandidate {
  user_id: string;
  name: string;
  email: string;
}

function AttendeesOverlay({
  event,
  isAdmin,
  onClose,
}: {
  event: AdminEvent;
  isAdmin: boolean;
  onClose: () => void;
}) {
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [candidates, setCandidates] = useState<AttendeeCandidate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    const candidatesPromise: Promise<AttendeeCandidate[]> = event.committee_id
      ? getCommitteeMembers(event.committee_id).then((members) =>
          members.map((m) => ({ user_id: m.user_id, name: m.name, email: m.email }))
        )
      : isAdmin
      ? getRoster().then((roster) => roster.map((m) => ({ user_id: m.id, name: m.name, email: m.email })))
      : Promise.resolve([]);

    return Promise.all([getEventAttendees(event.id), candidatesPromise]).then(([att, cand]) => {
      setAttendees(att);
      setCandidates(cand);
    });
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckIn = async (userId: string) => {
    setErr(null);
    setCheckingInId(userId);
    try {
      const result = await adminCheckIn(event.id, userId);
      if (!result.ok) {
        setErr(result.error === "already_checked_in" ? "Already checked in." : "Couldn't check in this member.");
      }
      await load();
    } catch {
      setErr("Couldn't check in this member.");
    } finally {
      setCheckingInId(null);
    }
  };

  const checkedInIds = new Set(attendees.map((a) => a.user_id));
  const q = search.trim().toLowerCase();
  const filtered = candidates
    .filter((c) => !checkedInIds.has(c.user_id))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));

  return (
    <Modal title={`${event.title} · attendees`} onClose={onClose} wide>
      {err && <div className="auth-err">{err}</div>}
      {loading ? (
        <div className="ob-loading"><div className="auth-cb-spinner" /></div>
      ) : (
        <>
          <h3 className="adm-section-h adm-section-h--inline" style={{ marginTop: 0 }}>
            Checked in <span className="adm-count mono">{attendees.length}</span>
          </h3>
          <div className="adm-attendees-list">
            {attendees.length === 0 ? (
              <p className="pf-empty">No check-ins yet.</p>
            ) : (
              attendees.map((a) => (
                <div key={a.user_id} className="adm-attendees-row">
                  <Avatar name={a.name} size={32} />
                  <span className="adm-att-info">
                    <b>{a.name}</b>
                    <span className="mono">{a.email}</span>
                  </span>
                  <span className="adm-att-bits mono">+{a.bits_awarded}</span>
                </div>
              ))
            )}
          </div>

          {candidates.length > 0 && (
            <>
              <h3 className="adm-section-h adm-section-h--inline">Manually check in</h3>
              <input
                type="text"
                className="ob-input"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="adm-attendees-list" style={{ marginTop: 12 }}>
                {filtered.length === 0 ? (
                  <p className="pf-empty">No matches.</p>
                ) : (
                  filtered.map((c) => (
                    <div key={c.user_id} className="adm-attendees-row">
                      <Avatar name={c.name} size={32} />
                      <span className="adm-att-info">
                        <b>{c.name}</b>
                        <span className="mono">{c.email}</span>
                      </span>
                      <button
                        className="btn btn-ghost"
                        disabled={checkingInId === c.user_id}
                        onClick={() => handleCheckIn(c.user_id)}
                      >
                        {checkingInId === c.user_id ? "Checking in…" : "Check in"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
