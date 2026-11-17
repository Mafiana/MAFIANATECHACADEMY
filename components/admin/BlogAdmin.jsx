"use client";
import { useEffect, useRef, useState } from "react";
import { resizeImage } from "../../lib/resizeImage";
import { uploadBlogImage, savePost, deletePost, importPosts } from "../../app/admin/actions";

const KEY = "maf_blog_posts"; // older practice posts that were only saved in this browser

const empty = () => ({ id: "", title: "", excerpt: "", cover: "", category: "Learning", bodyHtml: "<p></p>", published: true });

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function BlogAdmin({ posts = [], missing = false }) {
  const [saved, setSaved] = useState([]); // browser-only practice posts, offered for import once
  const [editing, setEditing] = useState(null);
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const coverRef = useRef(null);
  const range = useRef(null);
  const [note, setNote] = useState({ ok: null, text: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => setSaved(load()), []);

  // Uploads a picture to storage and returns its web address. If storage is not set up yet, the (small) picture is kept inside the post instead.
  async function upload(file) {
    setBusy(true);
    setNote({ ok: null, text: "" });
    try {
      const blob = await resizeImage(file, 1400, 0.85);
      const fd = new FormData();
      fd.set("photo", new File([blob], "image.jpg", { type: "image/jpeg" }));
      let r;
      try { r = await uploadBlogImage(null, fd); } catch { r = { ok: false, msg: "" }; }
      if (r.ok) { setNote({ ok: true, text: "Picture uploaded." }); return r.url; }
      const small = await resizeImage(file, 900, 0.7);
      const url = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(small); });
      setNote({ ok: false, text: (r.msg || "Upload failed.") + " The picture was saved inside the post instead." });
      return url;
    } catch (e) {
      setNote({ ok: false, text: e.message || "Could not use that picture." });
      return "";
    } finally { setBusy(false); }
  }

  function keepSpot() {
    const sel = window.getSelection();
    if (sel?.rangeCount && editorRef.current?.contains(sel.anchorNode)) range.current = sel.getRangeAt(0).cloneRange();
  }

  async function onInlineImage(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const url = await upload(f);
    if (!url) return;
    const ed = editorRef.current;
    ed.focus();
    if (range.current) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range.current); }
    else { const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    document.execCommand("insertHTML", false, `<img src="${url}" alt="${(f.name || "image").replace(/[<>"&]/g, "")}" /><p><br></p>`);
  }

  async function onCover(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const url = await upload(f);
    if (url) setEditing((x) => ({ ...x, cover: url }));
  }

  function startNew() {
    const p = empty();
    setEditing(p);
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = p.bodyHtml;
    }, 0);
  }

  function startEdit(p) {
    setEditing({ id: String(p.id), title: p.title, excerpt: p.excerpt, cover: p.cover || "", category: p.category, bodyHtml: p.body_html, published: p.published });
    setNote({ ok: null, text: "" });
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = p.body_html || "<p></p>";
    }, 0);
  }

  function cmd(command, value = null) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  async function save() {
    if (!editing?.title.trim()) return setNote({ ok: false, text: "Add a title for the post." });
    const fd = new FormData();
    fd.set("id", editing.id); fd.set("title", editing.title); fd.set("excerpt", editing.excerpt);
    fd.set("category", editing.category); fd.set("cover", editing.cover || "");
    fd.set("body", editorRef.current?.innerHTML || ""); fd.set("published", editing.published ? "1" : "0");
    setBusy(true);
    try {
      const r = await savePost(null, fd);
      setNote({ ok: r.ok, text: r.msg });
      if (r.ok) setEditing(null);
    } catch { setNote({ ok: false, text: "Could not save. Check your connection and try again." }); }
    setBusy(false);
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"? It disappears from the blog.`)) return;
    const fd = new FormData(); fd.set("id", String(p.id));
    const r = await deletePost(null, fd);
    setNote({ ok: r.ok, text: r.msg });
    if (r.ok && editing?.id === String(p.id)) setEditing(null);
  }

  async function importSaved() {
    const fd = new FormData(); fd.set("posts", JSON.stringify(saved));
    const r = await importPosts(null, fd);
    setNote({ ok: r.ok, text: r.msg });
    if (r.ok) { localStorage.removeItem(KEY); setSaved([]); }
  }

  return (
    <div className="card" id="blog">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Blog <span className="m" style={{ fontWeight: 400 }}>· posts here appear on the public blog</span></h3>
        {!editing && (
          <button type="button" className="btn sm" onClick={startNew}>
            New post
          </button>
        )}
      </div>

      {missing && <p className="adm-msg bad" role="alert">Blog storage is not set up yet. Run supabase/add-content-tables.sql in the Supabase SQL Editor, then refresh this page.</p>}
      {!editing && note.text && <p className={"adm-msg " + (note.ok ? "ok" : "bad")} role={note.ok ? "status" : "alert"}>{note.text}</p>}
      {!editing && !missing && saved.length > 0 && (
        <div className="csv-import">
          <b>{saved.length} post{saved.length === 1 ? "" : "s"} saved only in this browser</b>
          <p className="m" style={{ margin: "4px 0 10px" }}>These were written before posts could be published. Import them to put them on the blog.</p>
          <button type="button" className="btn sm" onClick={importSaved}>Import and publish</button>
        </div>
      )}
      {!editing && (
        <div className="adm-list" style={{ marginTop: 14 }}>
          {!posts.length && !missing && <p className="m">No posts written here yet. The blog currently shows the built-in articles. Press New post to add yours.</p>}
          {posts.map((p) => (
            <div className="adm-item" key={p.id}>
              <div className="adm-item-main">
                <span>
                  <b>{p.title}</b> <span className="m">{p.category}</span> {!p.published && <span className="badge bad">Draft</span>}
                </span>
                <span className="adm-acts">
                  <button type="button" className="btn ghost sm" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button type="button" className="btn danger sm" onClick={() => remove(p)}>
                    Delete
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="editor-shell" style={{ marginTop: 16 }}>
          <label>Title</label>
          <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Post title" />
          <label>Excerpt</label>
          <input value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Short summary" />
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} style={{ width: "auto" }} />
            Published (untick to keep it as a draft)
          </label>
          <label>Category</label>
          <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
            {["Office", "Career", "Data", "Web", "Design", "Learning"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <label>Cover image</label>
          <div className="img-up">
            {editing.cover && <img className="cover" src={editing.cover} alt="Cover preview" />}
            <button type="button" className="btn ghost sm" disabled={busy} onClick={() => coverRef.current?.click()}>{busy ? "Uploading..." : editing.cover ? "Change cover" : "Upload cover image"}</button>
            {editing.cover && <button type="button" className="btn ghost sm" onClick={() => setEditing({ ...editing, cover: "" })}>Remove</button>}
          </div>
          <input ref={coverRef} type="file" accept="image/*" hidden onChange={onCover} />
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onInlineImage} />
          {note.text && <p className={"adm-msg " + (note.ok ? "ok" : "bad")} role={note.ok ? "status" : "alert"}>{note.text}</p>}

          <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
            <button type="button" title="Bold" onClick={() => cmd("bold")}>
              <b>B</b>
            </button>
            <button type="button" title="Italic" onClick={() => cmd("italic")}>
              <i>I</i>
            </button>
            <button type="button" title="Underline" onClick={() => cmd("underline")}>
              <u>U</u>
            </button>
            <span className="editor-sep" />
            <button type="button" title="Heading" onClick={() => cmd("formatBlock", "h2")}>
              H2
            </button>
            <button type="button" title="Paragraph" onClick={() => cmd("formatBlock", "p")}>
              P
            </button>
            <span className="editor-sep" />
            <button type="button" title="Bullet list" onClick={() => cmd("insertUnorderedList")}>
              • List
            </button>
            <button type="button" title="Numbered list" onClick={() => cmd("insertOrderedList")}>
              1. List
            </button>
            <span className="editor-sep" />
            <button type="button" title="Link" onClick={() => cmd("createLink", prompt("URL") || "")}>
              Link
            </button>
            <span className="editor-sep" />
            <button type="button" title="Insert a picture" disabled={busy} onMouseDown={(e) => { keepSpot(); e.preventDefault(); }} onClick={() => fileRef.current?.click()}>
              {busy ? "Uploading..." : "🖼 Image"}
            </button>
            <button type="button" title="Remove format" onClick={() => cmd("removeFormat")}>
              Clear
            </button>
          </div>

          <div
            ref={editorRef}
            className="editor-canvas"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Write your article…"
          />

          <div className="adm-acts" style={{ marginTop: 14 }}>
            <button type="button" className="btn" disabled={busy} onClick={save}>
              {busy ? "Saving..." : "Save post"}
            </button>
            <button type="button" className="btn ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}