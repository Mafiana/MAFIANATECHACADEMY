"use client";
import { useMemo, useState } from "react";
import CourseCard from "./CourseCard";

export default function CourseCatalog({ courses, categories, levels }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("featured");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    let out = courses.filter((c) =>
      (cat === "All" || c.category === cat) && (level === "All" || c.level === level) &&
      (!n || [c.name, c.short, c.category, ...c.skills].join(" ").toLowerCase().includes(n)));
    if (sort === "short") out = [...out].sort((a, b) => a.weeks - b.weeks);
    if (sort === "price") out = [...out].sort((a, b) => a.online - b.online);
    return out;
  }, [courses, q, cat, level, sort]);

  return (
    <>
      <div className="cat-tools">
        <input type="search" className="cat-search" placeholder="What do you want to learn? Try Excel, SQL or logo design" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" />
        <div className="cat-row">
          <div className="bl-chips" role="group" aria-label="Filter by subject">
            {["All", ...categories].map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="cat-selects">
            <label><span className="m">Level</span>
              <select value={level} onChange={(e) => setLevel(e.target.value)}><option>All</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
            </label>
            <label><span className="m">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="short">Shortest first</option><option value="price">Lowest fee</option></select>
            </label>
          </div>
        </div>
      </div>
      <p className="m cat-count" aria-live="polite">{list.length} course{list.length === 1 ? "" : "s"}</p>
      {!list.length && <p className="m">No course matches that. Try a different word or clear the filters.</p>}
      <div className="cc-grid">{list.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
    </>
  );
}
