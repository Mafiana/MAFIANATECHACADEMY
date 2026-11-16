"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "maf_blog_posts";

const empty = () => ({
  id: String(Date.now()),
  title: "",
  excerpt: "",
  category: "Learning",
  bodyHtml: "<p></p>",
  updated: new Date().toISOString(),
});

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => setPosts(load()), []);

  function persist(next) {
    setPosts(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function startNew() {
    const p = empty();
    setEditing(p);
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = p.bodyHtml;
    }, 0);
  }

  function startEdit(p) {
    setEditing({ ...p });
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = p.bodyHtml || "<p></p>";
    }, 0);
  }

  function cmd(command, value = null) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  function save() {
    if (!editing?.title.trim()) return alert("Add a title");
    const bodyHtml = editorRef.current?.innerHTML || "";
    const row = { ...editing, bodyHtml, updated: new Date().toISOString() };
    const i = posts.findIndex((x) => x.id === row.id);
    const next = i >= 0 ? posts.map((x, idx) => (idx === i ? row : x)) : [row, ...posts];
    persist(next);
    setEditing(null);
  }

  function remove(id) {
    if (!confirm("Delete this post?")) return;
    persist(posts.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  return (
    <div className="card" id="blog">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Blog</h3>
        {!editing && (
          <button type="button" className="btn sm" onClick={startNew}>
            New post
          </button>
        )}
      </div>

      {!editing && (
        <div className="adm-list" style={{ marginTop: 14 }}>
          {!posts.length && <p className="m">No posts yet. Create one to practise the editor.</p>}
          {posts.map((p) => (
            <div className="adm-item" key={p.id}>
              <div className="adm-item-main">
                <span>
                  <b>{p.title}</b> <span className="m">{p.category}</span>
                </span>
                <span className="adm-acts">
                  <button type="button" className="btn ghost sm" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button type="button" className="btn danger sm" onClick={() => remove(p.id)}>
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
          <label>Category</label>
          <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
            {["Office", "Career", "Data", "Web", "Design", "Learning"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

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
            <button type="button" className="btn" onClick={save}>
              Save post
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