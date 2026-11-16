"use client";
import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function BlogIndex({ posts, categories }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!n || (p.title + " " + p.excerpt + " " + p.category).toLowerCase().includes(n))
    );
  }, [posts, cat, q]);

  const showFeatured = cat === "All" && !q.trim() && list.length > 0;
  const [first, ...rest] = list;

  return (
    <>
      <div className="bl-tools">
        <div className="bl-chips" role="group" aria-label="Filter by topic">
          {["All", ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="bl-search-wrap">
          <span className="bl-search-icon">
            <SearchIcon />
          </span>
          <input
            type="search"
            className="bl-search"
            placeholder="Search articles"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search articles"
          />
        </div>
      </div>

      {!list.length && (
        <p className="m" style={{ marginTop: 28 }}>
          No article matches that. Try another topic or clear the search.
        </p>
      )}

      {showFeatured && (
        <div className="bl-feature">
          <BlogCard post={first} featured />
        </div>
      )}

      <div className="bl-grid">
        {(showFeatured ? rest : list).map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
    </>
  );
}
