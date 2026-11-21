"use client";
import { useState } from "react";
import { ConfirmModal } from "../Modal";
import { saveEbook, deleteEbook } from "../../app/admin/actions";

const blank = () => ({
  id: "",
  title: "",
  author: "",
  description: "",
  cover_url: "",
  file_url: "",
  category: "General",
  active: true,
  featured: false,
});

const fromRow = (r) => ({
  id: String(r.id),
  title: r.title || "",
  author: r.author || "",
  description: r.description || "",
  cover_url: r.cover_url || "",
  file_url: r.file_url || "",
  category: r.category || "General",
  active: r.active !== false,
  featured: !!r.featured,
});

export default function EbookAdmin({ ebooks = [], missing = false }) {
  const [form, setForm] = useState(null);
  const [note, setNote] = useState({ ok: null, text: "" });
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [q, setQ] = useState("");

  const run = async (fn) => {
    setBusy(true);
    try {
      const r = await fn();
      setNote({ ok: r.ok, text: r.msg });
      return r;
    } catch {
      setNote({ ok: false, text: "Something went wrong. Check your connection and try again." });
      return { ok: false };
    } finally {
      setBusy(false);
    }
  };

  async function save() {
    const fd = new FormData();
    Object.entries({
      ...form,
      active: form.active ? "1" : "0",
      featured: form.featured ? "1" : "0",
    }).forEach(([k, v]) => fd.set(k, v ?? ""));
    const r = await run(() => saveEbook(null, fd));
    if (r.ok) setForm(null);
  }

  async function remove(p) {
    const fd = new FormData();
    fd.set("id", String(p.id));
    await run(() => deleteEbook(null, fd));
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const shown = ebooks.filter(
    (p) =>
      !q.trim() ||
      (p.title + " " + (p.author || "") + " " + (p.category || "")).toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div className="card" id="ebooks-admin">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>
          Ebooks <span className="m" style={{ fontWeight: 400 }}>· downloadable books</span>
        </h3>
        {!form && !missing && (
          <button
            type="button"
            className="btn sm"
            onClick={() => {
              setNote({ ok: null, text: "" });
              setForm(blank());
            }}
          >
            + Add ebook
          </button>
        )}
      </div>

      {missing && (
        <p className="adm-msg bad" role="alert">
          Ebooks table is not set up yet. Run the SQL for the <code>ebooks</code> table in the Supabase SQL Editor, then refresh this page.
        </p>
      )}

      {note.text && (
        <p className={"adm-msg " + (note.ok ? "ok" : "bad")} role={note.ok ? "status" : "alert"}>
          {note.text}
        </p>
      )}

      {/* Form */}
      {form && (
        <div className="adm-form" style={{ marginTop: 16 }}>
          <div className="grid" style={{ gap: 12 }}>
            <label>
              Title *
              <input value={form.title} onChange={set("title")} placeholder="e.g. Introduction to Cybersecurity" />
            </label>
            <label>
              Author
              <input value={form.author} onChange={set("author")} placeholder="Author name" />
            </label>
            <label>
              Category
              <input value={form.category} onChange={set("category")} placeholder="General" />
            </label>
            <label>
              Cover image URL
              <input value={form.cover_url} onChange={set("cover_url")} placeholder="https://..." />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Download / File URL *
              <input value={form.file_url} onChange={set("file_url")} placeholder="https://drive.google.com/... or any direct link" />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Description
              <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Short description..." />
            </label>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={form.active} onChange={set("active")} /> Active
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={form.featured} onChange={set("featured")} /> Featured
            </label>
          </div>

          <div className="adm-acts" style={{ marginTop: 16 }}>
            <button type="button" className="btn" disabled={busy} onClick={save}>
              {busy ? "Saving..." : form.id ? "Save changes" : "Add ebook"}
            </button>
            <button type="button" className="btn ghost" disabled={busy} onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {!form && !missing && (
        <>
          <div style={{ margin: "16px 0 8px" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ebooks..."
              style={{ maxWidth: 280 }}
            />
          </div>

          {shown.length === 0 ? (
            <p className="m">No ebooks yet. Click “+ Add ebook” to create one.</p>
          ) : (
            <div className="adm-list" style={{ marginTop: 8 }}>
              {shown.map((p) => (
                <div className="adm-row" key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                  {p.cover_url ? (
                    <img src={p.cover_url} alt="" style={{ width: 48, height: 64, objectFit: "cover", borderRadius: 4 }} />
                  ) : (
                    <div style={{ width: 48, height: 64, background: "#f0f0f0", borderRadius: 4 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{p.title}</b>
                    <div className="m">
                      {p.author && <>{p.author} · </>}
                      {p.category}
                      {!p.active && <> · <span style={{ color: "#c00" }}>Inactive</span></>}
                      {p.featured && <> · Featured</>}
                    </div>
                  </div>
                  <div className="adm-acts">
                    <button type="button" className="btn ghost sm" onClick={() => { setNote({ ok: null, text: "" }); setForm(fromRow(p)); }}>
                      Edit
                    </button>
                    <button type="button" className="btn ghost sm" onClick={() => setToDelete(p)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete ebook?"
        message={toDelete ? `Remove “${toDelete.title}”? This cannot be undone.` : ""}
        confirmLabel="Delete"
        onConfirm={async () => {
          await remove(toDelete);
          setToDelete(null);
        }}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}