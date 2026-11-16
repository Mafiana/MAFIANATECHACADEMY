"use client";
import { useEffect, useState } from "react";
import { CATALOG, CATEGORIES, LEVELS } from "../../lib/catalog";

const KEY = "maf_courses";
const naira = (x) => "₦" + Number(x || 0).toLocaleString("en-NG");

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return CATALOG.map((c) => ({ ...c }));
}

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => setCourses(load()), []);

  function persist(next) {
    setCourses(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function save() {
    if (!form.name.trim() || !form.slug.trim()) return alert("Name and slug are required");
    const row = {
      ...form,
      weeks: Number(form.weeks) || 0,
      physical: Number(form.physical) || 0,
      online: Number(form.online) || 0,
    };
    const i = courses.findIndex((c) => c.slug === row.slug);
    const next = i >= 0 ? courses.map((c, idx) => (idx === i ? row : c)) : [...courses, row];
    persist(next);
    setForm(null);
  }

  return (
    <div className="card" id="courses-admin">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Courses</h3>
        <button
          type="button"
          className="btn sm"
          onClick={() =>
            setForm({
              slug: "",
              name: "",
              category: CATEGORIES[0],
              level: LEVELS[0],
              weeks: 4,
              physical: 0,
              online: 0,
              short: "",
              tagline: "",
              image: "/courses/computer-basics.svg",
            })
          }
        >
          + Add course
        </button>
      </div>

      {/* Course list */}
      <div className="adm-list" style={{ marginTop: 18 }}>
        {courses.map((c) => (
          <div className="adm-item course-admin-row" key={c.slug}>
            <div className="course-admin-info">
              <b>{c.name}</b>
              <span className="m">
                {c.category} · {c.weeks} wks · from {naira(c.online)}
              </span>
            </div>
            <button type="button" className="btn ghost sm" onClick={() => setForm({ ...c })}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit / Add form */}
      {form && (
        <div className="adm-edit course-admin-form" style={{ marginTop: 20 }}>
          <h4 style={{ margin: "0 0 16px" }}>
            {courses.some((c) => c.slug === form.slug) ? "Edit course" : "New course"}
          </h4>

          <div className="course-form-grid">
            <div>
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Graphic Design"
              />
            </div>

            <div>
              <label>Slug (URL)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="graphic-design"
              />
            </div>

            <div className="full">
              <label>Short description</label>
              <input
                value={form.short || ""}
                onChange={(e) => setForm({ ...form, short: e.target.value })}
                placeholder="Canva, Photoshop, CorelDraw..."
              />
            </div>

            <div className="full">
              <label>Tagline</label>
              <input
                value={form.tagline || ""}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Design logos, posters and flyers"
              />
            </div>

            <div>
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Level</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Weeks</label>
              <input
                type="number"
                value={form.weeks}
                onChange={(e) => setForm({ ...form, weeks: e.target.value })}
              />
            </div>

            <div>
              <label>Physical fee (₦)</label>
              <input
                type="number"
                value={form.physical}
                onChange={(e) => setForm({ ...form, physical: e.target.value })}
              />
            </div>

            <div>
              <label>Online fee (₦)</label>
              <input
                type="number"
                value={form.online}
                onChange={(e) => setForm({ ...form, online: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-acts" style={{ marginTop: 18 }}>
            <button type="button" className="btn" onClick={save}>
              Save course
            </button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>

          <p className="m" style={{ marginTop: 12, fontSize: 13 }}>
            Design mode stores edits in this browser only. Wire to Supabase when you are ready.
          </p>
        </div>
      )}
    </div>
  );
}