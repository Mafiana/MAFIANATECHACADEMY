"use client";
import { useMemo, useState, useEffect } from "react";
import { DEFAULT_SHOP, SHOP_CATEGORIES } from "../lib/shop";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP || "234XXXXXXXXXX";
const naira = (x) => "₦" + Number(x).toLocaleString("en-NG");
const wa = (t) => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;

const PER_PAGE = 6;

const CATEGORIES = SHOP_CATEGORIES;
const SHOP = DEFAULT_SHOP;

export default function ShopSection() {
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [pic, setPic] = useState(0);

  const list = useMemo(() => (cat === "All" ? SHOP : SHOP.filter((p) => p.cat === cat)), [cat]);
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

      {!list.length && <p className="m">No products in this category yet.</p>}

      <div className="shop-grid">
        {slice.map((item) => (
          <article
            className="shop-card"
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
                <b>{naira(item.price)}</b>
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
              <div className="shop-modal-price">{naira(selected.price)}</div>

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
                className="btn"
                target="_blank"
                rel="noopener noreferrer"
                href={wa("Hello, I want to buy: " + selected.name)}
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
