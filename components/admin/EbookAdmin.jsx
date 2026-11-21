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

  const run = async (fn) => {
    setBusy(true);
    try {
      const r = await fn();
      setNote({ ok: r.ok, text: r.msg });
      return r;
    } catch {
      setNote({ ok: false, text: "Something went wrong." });
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
    }).forEach(([k, v]) => fd.set(k, v));
    const r = await run(() => saveEbook(null, fd));
    if (r.ok) setForm(null);
  }

  async function remove(e) {
    const fd = new FormData();
    fd.set("id", String(e.id));
    await run(() => deleteEbook(null, fd));
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="card" id="ebook-admin">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>
          Ebooks <span className="m" style={{ fontWeight: 400 }}>· shown on the homepage</span>
        </h3>
        {!form && !missing && (
          <button type="button" className="btn sm" onClick={() => { setNote({ ok: null, text: "" }); setForm(blank()); }}>
            + Add ebook
          </button>
        )}
      </div>

      {missing && (
        <p className="adm-msg bad" role="alert">
          Ebooks table is missing. Run <code>supabase/add-ebooks-support.sql</code> in the Supabase SQL Editor.
        </p>
      )}
      {note.text && (
        <p className={"adm-msg " + (note.ok ? "ok" : "bad")} role={note.ok ? "status" : "alert"}>
          {note.text}
        </p>
      )}

      {!form && (
        <div className="adm-list" style={{ marginTop: 18 }}>
          {!ebooks.length && !missing && <p className="m">No ebooks yet. Click “+ Add ebook”.</p>}
          {ebooks.map((e) => (
            <div className="adm-item" key={e.id}>
              <div className="adm-item-main">
                <b>
                  {e.title} {!e.active && <span className="badge bad">Hidden</span>}{" "}
                  {e.featured && <span className="badge warn">Featured</span>}
                </b>
                <span className="m">
                  {e.author ? e.author + " · " : ""}
                  {e.category}
                </span>
              </div>
              <div className="adm-acts">
                <button type="button" className="btn ghost sm" onClick={() => { setNote({ ok: null, text: "" }); setForm(fromRow(e)); }}>
                  Edit
                </button>
                <button type="button" className="btn danger sm" onClick={() => setToDelete(e)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="adm-edit" style={{ marginTop: 20 }}>
          <h4 style={{ margin: "0 0 14px" }}>{form.id ? "Edit ebook" : "New ebook"}</h4>
          <div className="shop-form-grid">
            <div className="full">
              <label>Title</label>
              <input value={form.title} onChange={set("title")} maxLength={120} placeholder="Ebook title" />
            </div>
            <div>
              <label>Author</label>
              <input value={form.author} onChange={set("author")} maxLength={80} />
            </div>
            <div>
              <label>Category</label>
              <input value={form.category} onChange={set("category")} maxLength={40} placeholder="e.g. Cybersecurity" />
            </div>
            <div className="full">
              <label>Short description</label>
              <input value={form.description} onChange={set("description")} maxLength={300} />
            </div>
            <div className="full">
              <label>Cover image URL</label>
              <input value={form.cover_url} onChange={set("cover_url")} placeholder="https://…" />
            </div>
            <div className="full">
              <label>Download / file URL (PDF, Google Drive, etc.)</label>
              <input value={form.file_url} onChange={set("file_url")} placeholder="https://…" required />
            </div>
            <div className="full">
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ width: "auto" }} />
                Show on homepage
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: "auto" }} />
                Featured
              </label>
            </div>
          </div>
          <div className="adm-acts" style={{ marginTop: 16 }}>
            <button type="button" className="btn" disabled={busy} onClick={save}>
              {busy ? "Saving…" : "Save ebook"}
            </button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Remove this ebook?"
        message={toDelete ? `"${toDelete.title}" will be removed.` : ""}
        confirmLabel="Remove"
        danger
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          const e = toDelete;
          setToDelete(null);
          remove(e);
        }}
      />
    </div>
  );
}
