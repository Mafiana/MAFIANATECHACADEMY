"use client";
import { useMemo, useState } from "react";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP || "234XXXXXXXXXX";
const naira = (x) => "₦" + Number(x).toLocaleString("en-NG");
const wa = (t) => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;

const PER_PAGE = 6;

const CATEGORIES = ["All", "Laptop", "Mouse", "Keyboard", "Flash", "Bag", "Charger", "Audio"];

const SHOP = [
  { name: "Wireless mouse", price: 7000, img: "/shop/mouse.jpeg", desc: "Quiet click, long battery", cat: "Mouse" },
  { name: "Keyboard", price: 10000, img: "/shop/keyboard.jpeg", desc: "Full size, soft keys", cat: "Keyboard" },
  { name: "64GB flash drive", price: 10000, img: "/shop/flash.jpeg", desc: "USB 3.0, metal body", cat: "Flash" },
  { name: "Laptop charger", price: 15000, img: "/shop/charger.jpeg", desc: "Compatible with common models", cat: "Charger" },
  { name: "Laptop bag", price: 14000, img: "/shop/bag.jpeg", desc: "Padded, fits 15.6 inch", cat: "Bag" },
  { name: "Headphones", price: 9000, img: "/shop/headphones.jpeg", desc: "Over-ear, for class & calls", cat: "Audio" },
  { name: "USB mouse (wired)", price: 4500, img: "/shop/mouse.jpeg", desc: "Simple and reliable", cat: "Mouse" },
  { name: "128GB flash drive", price: 16000, img: "/shop/flash.jpeg", desc: "More space for projects", cat: "Flash" },
  { name: "Laptop stand", price: 12000, img: "/shop/bag.jpeg", desc: "Raises the screen to eye level", cat: "Laptop" },
];

export default function ShopSection() {
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);

  const list = useMemo(
    () => (cat === "All" ? SHOP : SHOP.filter((p) => p.cat === cat)),
    [cat]
  );

  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const slice = list.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function pickCat(c) {
    setCat(c);
    setPage(1);
  }

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
          <article className="shop-card" key={item.name}>
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
                <a
                  className="btn ghost sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={wa("Hello, I want to buy: " + item.name)}
                >
                  Order
                </a>
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
    </section>
  );
}