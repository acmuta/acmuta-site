import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  getAdminNews,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem,
  type AdminNewsItem,
} from "@/lib/api";
import type { AdminContext } from "./AdminLayout";

type NewsForm = {
  tag: string;
  title: string;
  blurb: string;
  link: string;
  date: string;
  is_published: boolean;
  sort_order: number;
};

const TODAY = new Date().toISOString().slice(0, 10);

const BLANK: NewsForm = {
  tag: "",
  title: "",
  blurb: "",
  link: "/",
  date: TODAY,
  is_published: true,
  sort_order: 0,
};

function NewsForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: NewsForm;
  onSave: (form: NewsForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<NewsForm>(initial);
  const patch = (p: Partial<NewsForm>) => setForm((f) => ({ ...f, ...p }));

  return (
    <div className="adm-card" style={{ marginBottom: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
        <div className="field">
          <label>Tag</label>
          <input
            type="text"
            value={form.tag}
            placeholder="e.g. Apply, HackUTA, Educate"
            onChange={(e) => patch({ tag: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => patch({ date: e.target.value })}
          />
        </div>
      </div>
      <div className="field">
        <label>Title</label>
        <input
          type="text"
          value={form.title}
          placeholder="Headline shown on the homepage"
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Blurb</label>
        <textarea
          className="ob-input adm-textarea"
          rows={2}
          value={form.blurb}
          placeholder="One or two sentences"
          onChange={(e) => patch({ blurb: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Link (internal path or full URL)</label>
        <input
          type="text"
          value={form.link}
          placeholder="/committees or https://..."
          onChange={(e) => patch({ link: e.target.value })}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 4, marginBottom: 20 }}>
        <div className="field" style={{ marginBottom: 0, flex: "0 0 auto" }}>
          <label>Sort order</label>
          <input
            type="number"
            value={form.sort_order}
            min={0}
            style={{ width: 88 }}
            onChange={(e) => patch({ sort_order: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="adm-field-row" style={{ marginBottom: 0, gap: 10 }}>
          <div>
            <div className="adm-field-label">Published</div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginTop: 2 }}>
              Visible on homepage when on
            </p>
          </div>
          <label className="adm-toggle">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => patch({ is_published: e.target.checked })}
            />
            <span className="adm-toggle-slider" />
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="btn btn-primary"
          onClick={() => onSave(form)}
          disabled={saving || !form.title.trim()}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button className="btn btn-ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminNews() {
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();
  const { user } = useAuth();
  const canEdit = isAdmin || directedCommittees.length > 0;

  const [items, setItems] = useState<AdminNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminNews().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (!canEdit) {
    return <p className="pf-empty">This page is for admins and directors only.</p>;
  }

  if (loading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  const reload = () => getAdminNews().then(setItems);

  const handleCreate = async (form: NewsForm) => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await createNewsItem({ ...form, created_by: user.id });
      await reload();
      setAdding(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create item");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, form: NewsForm) => {
    setSaving(true);
    setError(null);
    try {
      await updateNewsItem(id, form);
      await reload();
      setEditingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (item: AdminNewsItem) => {
    setError(null);
    try {
      await updateNewsItem(item.id, { is_published: !item.is_published });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_published: !i.is_published } : i))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this news item? This cannot be undone.")) return;
    setError(null);
    try {
      await deleteNewsItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete item");
    }
  };

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1 className="adm-h1">News Items</h1>
          <p className="adm-sub">
            Controls the "What's happening." section on the homepage.
          </p>
        </div>
        {!adding && (
          <button
            className="btn btn-primary"
            onClick={() => { setAdding(true); setEditingId(null); }}
          >
            + Add item
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: "var(--ok-reject)", marginBottom: 16, fontSize: "0.88rem" }}>
          {error}
        </p>
      )}

      {adding && (
        <NewsForm
          initial={{ ...BLANK, sort_order: items.length + 1 }}
          onSave={handleCreate}
          onCancel={() => setAdding(false)}
          saving={saving}
        />
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th style={{ width: 90 }}>Tag</th>
              <th>Title</th>
              <th style={{ width: 110 }}>Date</th>
              <th style={{ width: 120 }}>Published</th>
              <th style={{ width: 140 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && !adding && (
              <tr>
                <td colSpan={6}>
                  <p className="pf-empty" style={{ padding: "24px 0" }}>
                    No news items yet. Add one above.
                  </p>
                </td>
              </tr>
            )}
            {items.map((item) =>
              editingId === item.id ? (
                <tr key={item.id}>
                  <td colSpan={6} style={{ padding: "12px 0" }}>
                    <NewsForm
                      initial={{
                        tag: item.tag,
                        title: item.title,
                        blurb: item.blurb,
                        link: item.link,
                        date: item.date,
                        is_published: item.is_published,
                        sort_order: item.sort_order,
                      }}
                      onSave={(form) => handleUpdate(item.id, form)}
                      onCancel={() => setEditingId(null)}
                      saving={saving}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td className="mono adm-table-dim">{item.sort_order}</td>
                  <td>
                    {item.tag ? (
                      <span className="adm-flag">{item.tag}</span>
                    ) : (
                      <span className="adm-table-dim">-</span>
                    )}
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 300,
                      }}
                    >
                      {item.title}
                    </div>
                    {item.blurb && (
                      <div
                        className="adm-table-dim"
                        style={{ fontSize: "0.78rem", fontWeight: 400, marginTop: 2 }}
                      >
                        {item.blurb.length > 72 ? item.blurb.slice(0, 72) + "..." : item.blurb}
                      </div>
                    )}
                  </td>
                  <td className="mono" style={{ fontSize: "0.82rem" }}>{item.date}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <label className="adm-toggle">
                        <input
                          type="checkbox"
                          checked={item.is_published}
                          onChange={() => handleTogglePublished(item)}
                        />
                        <span className="adm-toggle-slider" />
                      </label>
                      <span
                        className="adm-table-dim"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {item.is_published ? "Live" : "Hidden"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "4px 12px", fontSize: "0.82rem" }}
                        onClick={() => { setEditingId(item.id); setAdding(false); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{
                          padding: "4px 12px",
                          fontSize: "0.82rem",
                          color: "var(--ok-reject)",
                        }}
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
