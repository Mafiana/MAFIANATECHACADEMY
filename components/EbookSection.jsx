"use client";
import { useState } from "react";

export default function EbookSection({ ebooks = [] }) {
  const [q, setQ] = useState("");
  const list = ebooks.filter(
    (e) =>
      !q.trim() ||
      (e.title + " " + e.author + " " + e.category + " " + e.description)
        .toLowerCase()
        .includes(q.trim().toLowerCase())
  );

  if (!ebooks.length) return null;

  return (
    <section id="ebooks">
      <h2>Ebooks & Resources</h2>
      <p className="sub">
        Free and paid learning materials from the academy. Download or request access.
      </p>

      {ebooks.length > 4 && (
        <div className="shop-search" style={{ marginBottom: 8, marginTop: 16 }}>
          <input
            type="search"
            className="bl-search"
            placeholder="Search ebooks…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search ebooks"
          />
        </div>
      )}

      <div className="ebook-grid">
        {list.map((book) => (
          <article className="ebook-card" key={book.id}>
            <div className="ebook-cover-wrap">
              {book.featured && <span className="ebook-feat">★ Featured</span>}
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.nextElementSibling;
                    if (fb) fb.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="ebook-cover-fallback"
                style={{ display: book.cover ? "none" : "flex" }}
              >
                <span className="eb-badge">{book.category || "Ebook"}</span>
                <span className="eb-title">{book.title}</span>
                {book.author && <span className="eb-author">{book.author}</span>}
              </div>
            </div>

            <div className="ebook-meta">
              {book.category && <span className="ebook-cat">{book.category}</span>}
              <h3>{book.title}</h3>
              {book.author && <p className="ebook-author">by {book.author}</p>}
              {book.description && (
                <p className="ebook-desc">{book.description}</p>
              )}
              <a
                className="btn sm ebook-dl"
                href={book.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          </article>
        ))}
      </div>

      {!list.length && (
        <p className="m" style={{ marginTop: 20 }}>
          No ebooks match your search.
        </p>
      )}
    </section>
  );
}