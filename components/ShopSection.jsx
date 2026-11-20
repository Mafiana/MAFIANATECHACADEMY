"use client";
import { useMemo, useState, useEffect } from "react";
import { DEFAULT_SHOP, SHOP_CATEGORIES } from "../lib/shop";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP || "234XXXXXXXXXX";
// Prices are not shown to students. Each product shows whether it is available.
const stockLabel = (item) => (Number(item.stock) > 0 ? "In stock" : "Out of stock");
const stockClass = (item) => "shop-stock" + (Number(item.stock) > 0 ? "" : " out");
const soldOut = (item) => !(Number(item.stock) > 0);
// Featured products first, then the rest, then sold-out products last.
const rank = (item) => (soldOut(item) ? 2 : item.featured ? 0 : 1);
const haystack = (item) => [item.name, item.desc, item.cat, ...(item.specs || []).flat()].join(" ").toLowerCase();

function Badges({ item }) {
  if (!item.featured && !item.isNew && !soldOut(item)) return null;
  return (
    <span className="shop-badges">
      {soldOut(item) ? <span className="shop-badge sold">Sold out</span> : null}
      {item.featured && !soldOut(item) ? <span className="shop-badge feat">★ Featured</span> : null}
      {item.isNew && !soldOut(item) ? <span className="shop-badge new">New</span> : null}
    </span>
  );
}
const wa = (t) => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;

const PER_PAGE = 6;

const CATEGORIES = SHOP_CATEGORIES;

export default function ShopSection({ products }) {
  const SHOP = products && products.length ? products : DEFAULT_SHOP;
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [pic, setPic] = useState(0);

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return SHOP
      .map((p, i) => [p, i])
      .filter(([p]) => (cat === "All" || p.cat === cat) && words.every((w) => haystack(p).includes(w)))
      .sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1])
      .map(([p]) => p);
  }, [cat, q, SHOP]);
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const slice = list.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const pickCat = (c) => {
    setCat(c);
    setPage(1);
  };

  // Close modal on Escape + lock body scroll while open
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <section id="shop">
      <h2>Student shop</h2>
      <p className="sub">
        Gadgets and accessories for class. Order on WhatsApp and pick up at the academy or arrange delivery.
      </p>

      <div className="shop-tools">
        <div className="shop-search">
          <svg className="shop-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input type="search" className="bl-search" placeholder="Search the shop (for example mouse, laptop, 8GB)" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search the student shop" />
        </div>
        <div className="bl-chips" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => pickCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="m cat-count" aria-live="polite">
        {list.length} item{list.length === 1 ? "" : "s"}
        {totalPages > 1 ? ` · page ${safePage} of ${totalPages}` : ""}
      </p>

      {!list.length && <p className="m">{q.trim() ? `No products match “${q.trim()}”.` : "No products in this category yet."}</p>}

      <div className="shop-grid">
        {slice.map((item) => (
          <article
            className={"shop-card" + (soldOut(item) ? " is-sold" : "") + (item.featured && !soldOut(item) ? " is-featured" : "")}
            key={item.id || item.name}
            role="button"
            tabIndex={0}
            onClick={() => { setSelected(item); setPic(0); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(item);
                setPic(0);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="shop-img">
              <Badges item={item} />
              <img
                src={item.img}
                alt={item.name}
                width="400"
                height="400"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.classList.add("shop-img-fallback");
                }}
              />
            </div>
            <div className="shop-body">
              <h3>{item.name}</h3>
              <p className="m">{item.desc}</p>
              <div className="shop-foot">
                <b className={stockClass(item)}>{stockLabel(item)}</b>
                <span className="btn ghost sm">View</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="shop-pager">
          <button
            type="button"
            className="btn ghost sm"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            className="btn ghost sm"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {/* Product detail modal — centered card, not full screen */}
      {selected && (
        <div
          className="shop-modal-overlay"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="shop-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="shop-modal-img">
              <Badges item={selected} />
              <img src={(selected.imgs && selected.imgs[pic]) || selected.img} alt={selected.name} />
            </div>
            {selected.imgs && selected.imgs.length > 1 && (
              <div className="shop-thumbs" role="group" aria-label="Product pictures">
                {selected.imgs.map((src, i) => (
                  <button key={src} type="button" aria-current={i === pic} aria-label={`Picture ${i + 1}`} onClick={() => setPic(i)}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}

            <div className="shop-modal-body">
              <h3>{selected.name}</h3>
              <p className="m">{selected.desc}</p>
              <div className={"shop-modal-price " + stockClass(selected)}>{stockLabel(selected)}</div>

              {selected.specs && (
                <>
                  <h4 className="shop-specs-title">System configuration</h4>
                  <table className="shop-specs">
                    <tbody>
                      {selected.specs.map(([k, v]) => (
                        <tr key={k}>
                          <th scope="row">{k}</th>
                          <td>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <a
                className="btn shop-wa-btn"
                target="_blank"
                rel="noopener noreferrer"
                href={wa(soldOut(selected) ? "Hello, when will " + selected.name + " be back in stock?" : "Hello, I want to buy: " + selected.name)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.524-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {soldOut(selected) ? "Ask about restock on WhatsApp" : "Order on WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
