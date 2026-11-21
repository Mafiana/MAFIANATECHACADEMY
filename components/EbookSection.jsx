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
      <style>{`
        .ebook-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 28px;
          margin-top: 28px;
        }
        .ebook-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .ebook-card:hover {
          transform: translateY(-6px);
        }
        .ebook-cover-wrap {
          position: relative;
          width: 100%;
          max-width: 180px;
          aspect-ratio: 2 / 3;
          border-radius: 4px 10px 10px 4px;
          overflow: hidden;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.1),
            0 10px 20px rgba(0,0,0,0.15),
            4px 0 8px rgba(0,0,0,0.08);
          background: linear-gradient(145deg, #1a2744, #0d1526);
        }
        .ebook-cover-wrap::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          background: linear-gradient(90deg, rgba(0,0,0,0.35), transparent);
          z-index: 2;
          border-radius: 4px 0 0 4px;
        }
        .ebook-cover-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ebook-cover-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 12px;
          background: linear-gradient(160deg, #1e3a5f 0%, #0f1c2e 100%);
          color: #fff;
          text-align: center;
        }
        .ebook-cover-fallback .eb-badge {
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 10px;
        }
        .ebook-cover-fallback .eb-title {
          font-size: 15px;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 8px;
        }
        .ebook-cover-fallback .eb-author {
          font-size: 11px;
          opacity: 0.8;
          margin-top: auto;
        }
        .ebook-feat {
          position: absolute;
          top: 10px;
          right: 8px;
          background: #f5c518;
          color: #1a1a1a;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 7px;
          border-radius: 4px;
          z-index: 3;
          letter-spacing: 0.3px;
        }
        .ebook-meta {
          margin-top: 12px;
          width: 100%;
          max-width: 180px;
        }
        .ebook-meta h3 {
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 4px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ebook-meta .m {
          font-size: 12px;
          margin: 0;
        }
        .ebook-meta .btn {
          margin-top: 10px;
          width: 100%;
          font-size: 13px;
          padding: 8px 12px;
        }
        @media (max-width: 480px) {
          .ebook-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }
      `}</style>

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
                    e.currentTarget.nextSibling.style.display = "flex";
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
              <h3>{book.title}</h3>
              {book.author && <p className="m">by {book.author}</p>}
              <a
                className="btn sm"
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

      {!list.length && <p className="m" style={{ marginTop: 20 }}>No ebooks match your search.</p>}
    </section>
  );
}
