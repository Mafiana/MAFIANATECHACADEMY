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
    if (typeof saveEbook !== "function") {
      setNote({ ok: false, text: "saveEbook action is missing. Check app/admin/actions.js" });
      return;
    }
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
    if (typeof deleteEbook !== "function") {
      setNote({ ok: false, text: "deleteEbook action is missing. Check app/admin/actions.js" });
      return;
    }
    const fd = new FormData();
    fd.set("id", String(p.id));
    await run(() => deleteEbook(null, fd));
  }

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const shown = ebooks.filter(
    (p) =>
      !q.trim() ||
      (p.title + " " + (p.author || "") + " " + (p.category || ""))
        .toLowerCase()
        .includes(q.trim().toLowerCase())
  );

  return (
    <div className="card" id="ebooks-admin">
      {/* ========== HEADER ========== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>
            Ebooks{" "}
            <span className="m" style={{ fontWeight: 400 }}>
              · downloadable books
            </span>
          </h3>
          {!missing && !form && (
            <p className="m" style={{ margin: "4px 0 0" }}>
              {ebooks.length === 0
                ? "No ebooks yet. Add the first one to show on the homepage."
                : `${ebooks.length} ebook${ebooks.length === 1 ? "" : "s"} · Active ones appear on the homepage`}
            </p>
          )}
        </div>

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
        <p className="adm-msg bad" role="alert" style={{ marginTop: 14 }}>
          Ebooks table is not set up yet. Run the SQL for the <code>ebooks</code> table in the Supabase SQL Editor, then
          refresh this page.
        </p>
      )}

      {note.text && (
        <p
          className={"adm-msg " + (note.ok ? "ok" : "bad")}
          role={note.ok ? "status" : "alert"}
          style={{ marginTop: 14 }}
        >
          {note.text}
        </p>
      )}

      {/* ========== EDIT / ADD FORM ========== */}
      {form && (
        <div
          className="adm-edit"
          style={{
            marginTop: 22,
            padding: "22px 20px",
            borderRadius: 14,
            background: "var(--mint, #f4faf7)",
            border: "1px solid var(--line, #dce8e2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h4 style={{ margin: 0, fontSize: 17 }}>{form.id ? "Edit ebook" : "New ebook"}</h4>
            <button type="button" className="btn ghost sm" onClick={() => setForm(null)} disabled={busy}>
              ← Back to list
            </button>
          </div>

          {/* Main layout: cover preview + fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: 24,
              alignItems: "start",
            }}
            className="ebook-edit-layout"
          >
            {/* Cover preview column */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 120,
                  height: 160,
                  margin: "0 auto",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "linear-gradient(160deg, #1e3a5f 0%, #0f1c2e 100%)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15), 3px 0 8px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "center",
                  padding: 8,
                  position: "relative",
                }}
              >
                {form.cover_url ? (
                  <img
                    src={form.cover_url}
                    alt="Cover preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span style={{ opacity: 0.85, lineHeight: 1.3 }}>
                    {(form.title || "Cover").slice(0, 18)}
                  </span>
                )}
                {form.featured && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 6,
                      background: "#f5c518",
                      color: "#1a1a1a",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 5px",
                      borderRadius: 3,
                    }}
                  >
                    ★
                  </span>
                )}
              </div>
              <p className="m" style={{ marginTop: 10, fontSize: 12 }}>
                Cover preview
              </p>
            </div>

            {/* Fields column */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px 16px",
              }}
              className="ebook-fields"
            >
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  Title <span style={{ color: "#c62828" }}>*</span>
                </span>
                <input
                  value={form.title}
                  onChange={set("title")}
                  placeholder="e.g. Introduction to Cybersecurity"
                  maxLength={120}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Author</span>
                <input value={form.author} onChange={set("author")} placeholder="Author name" maxLength={80} />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Category</span>
                <input value={form.category} onChange={set("category")} placeholder="General" maxLength={40} />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Cover image URL</span>
                <input
                  value={form.cover_url}
                  onChange={set("cover_url")}
                  placeholder="https://..."
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  gridColumn: "1 / -1",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  Download / File URL <span style={{ color: "#c62828" }}>*</span>
                </span>
                <input
                  value={form.file_url}
                  onChange={set("file_url")}
                  placeholder="https://drive.google.com/... or any direct link"
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  gridColumn: "1 / -1",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>Description</span>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
                  placeholder="Short description…"
                  maxLength={300}
                  style={{ resize: "vertical", minHeight: 72 }}
                />
              </label>
            </div>
          </div>

          {/* Options + actions */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--line, #dce8e2)",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={form.active} onChange={set("active")} style={{ width: "auto" }} />
                Active (show on homepage)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={form.featured} onChange={set("featured")} style={{ width: "auto" }} />
                Featured ★
              </label>
            </div>

            <div className="adm-acts" style={{ margin: 0 }}>
              <button type="button" className="btn" disabled={busy} onClick={save}>
                {busy ? "Saving..." : form.id ? "Save changes" : "Add ebook"}
              </button>
              <button type="button" className="btn ghost" disabled={busy} onClick={() => setForm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== LIST + SEARCH ========== */}
      {!form && !missing && (
        <>
          {/* Search — always shown when there is at least one ebook */}
          {ebooks.length > 0 && (
            <div style={{ margin: "18px 0 12px" }}>
              <div className="adm-searchbox" style={{ maxWidth: 320, margin: 0 }}>
                <svg
                  className="adm-search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  className="adm-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search ebooks…"
                  aria-label="Search ebooks"
                />
              </div>
            </div>
          )}

          {ebooks.length === 0 ? (
            <div
              style={{
                marginTop: 24,
                padding: "36px 20px",
                textAlign: "center",
                borderRadius: 14,
                background: "var(--mint, #f0f7f4)",
                border: "1.5px dashed var(--line, #c5d5cc)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.7 }}>📚</div>
              <b style={{ fontSize: 16 }}>No ebooks yet</b>
              <p className="m" style={{ margin: "8px auto 18px", maxWidth: 320 }}>
                Add downloadable books and resources. Active ones appear on the homepage under “Ebooks & Resources”.
              </p>
              <button
                type="button"
                className="btn sm"
                onClick={() => {
                  setNote({ ok: null, text: "" });
                  setForm(blank());
                }}
              >
                + Add your first ebook
              </button>
            </div>
          ) : shown.length === 0 ? (
            <p className="m" style={{ marginTop: 8 }}>
              No ebooks match “{q}”.
            </p>
          ) : (
            <div className="adm-list">
              {shown.map((p) => (
                <div
                  key={p.id}
                  className="adm-item"
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--line, #eee)",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 60,
                      borderRadius: 5,
                      overflow: "hidden",
                      background: "linear-gradient(160deg, #1e3a5f, #0f1c2e)",
                      flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    }}
                  >
                    {p.cover_url && (
                      <img
                        src={p.cover_url}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <b style={{ fontSize: 15 }}>{p.title}</b>
                      {!p.active && <span className="badge bad">Hidden</span>}
                      {p.featured && <span className="badge warn">★ Featured</span>}
                    </div>
                    <div className="m" style={{ marginTop: 2 }}>
                      {p.author && <>{p.author} · </>}
                      {p.category || "General"}
                    </div>
                  </div>

                  <div className="adm-acts" style={{ flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => {
                        setNote({ ok: null, text: "" });
                        setForm(fromRow(p));
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn danger sm" onClick={() => setToDelete(p)}>
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
        danger
        onConfirm={() => {
          const p = toDelete;
          setToDelete(null);
          remove(p);
        }}
        onCancel={() => setToDelete(null)}
      />

      <style>{`
        @media (max-width: 720px) {
          .ebook-edit-layout {
            grid-template-columns: 1fr !important;
          }
          .ebook-edit-layout > div:first-child {
            order: -1;
          }
          .ebook-fields {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}