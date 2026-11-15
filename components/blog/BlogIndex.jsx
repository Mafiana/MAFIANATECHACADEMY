"use client";
import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";

export default function BlogIndex({ posts, categories }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return posts.filter((p) => (cat === "All" || p.category === cat) && (!n || (p.title + " " + p.excerpt + " " + p.category).toLowerCase().includes(n)));
  }, [posts, cat, q]);
  const showFeatured = cat === "All" && !q.trim() && list.length > 0;
  const [first, ...rest] = list;

  return (
    <>
      <div className="bl-tools">
        <div className="bl-chips" role="group" aria-label="Filter by topic">
          {["All", ...categories].map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <input type="search" className="bl-search" placeholder="Search articles" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search articles" />
      </div>
      {!list.length && <p className="m" style={{ marginTop: 28 }}>No article matches that. Try another topic or clear the search.</p>}
      {showFeatured && <div className="bl-feature"><BlogCard post={first} featured /></div>}
      <div className="bl-grid">
        {(showFeatured ? rest : list).map((p) => <BlogCard key={p.slug} post={p} />)}
      </div>
    </>
  );
}
