"use client";
import { useRef, useState } from "react";
import { SHOP_CATEGORIES } from "../../lib/shop";
import { resizeImage } from "../../lib/resizeImage";
import { deleteProduct, saveProduct, seedShop, uploadShopImage } from "../../app/admin/actions";

const naira = (x) => "₦" + Number(x || 0).toLocaleString("en-NG");
const specsToText = (specs) => (Array.isArray(specs) ? specs.map(([k, v]) => `${k}: ${v}`).join("\n") : "");

const blank = () => ({ id: "", name: "", cat: "Laptop", price: "", stock: "", descr: "", img: "", imgs: [], specs: "", active: true });
const fromRow = (r) => ({ id: String(r.id), name: r.name, cat: r.cat, price: String(r.price), stock: String(r.stock), descr: r.descr || "", img: r.img || "", imgs: Array.isArray(r.imgs) ? r.imgs : [], specs: specsToText(r.specs), active: r.active });

// Products saved here are what the homepage Student shop shows (changes appear within about a minute).
export default function ShopAdmin({ products = [], missing = false }) {
  const [form, setForm] = useState(null);
  const [note, setNote] = useState({ ok: null, text: "" });
  const [busy, setBusy] = useState(false);
  const mainRef = useRef(null);
  const moreRef = useRef(null);

  const run = async (fn) => {
    setBusy(true);
    try { const r = await fn(); setNote({ ok: r.ok, text: r.msg }); return r; }
    catch { setNote({ ok: false, text: "Something went wrong. Check your connection and try again." }); return { ok: false }; }
    finally { setBusy(false); }
  };

  async function pickImage(e, kind) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const r = await run(async () => {
      const blob = await resizeImage(f, 1000, 0.85);
      const fd = new FormData();
      fd.set("photo", new File([blob], "product.jpg", { type: "image/jpeg" }));
      return uploadShopImage(null, fd);
    });
    if (!r.ok) return;
    setForm((x) => (kind === "main" ? { ...x, img: r.url, imgs: x.imgs.length ? x.imgs : [r.url] } : { ...x, imgs: [...(x.imgs.length || !x.img ? x.imgs : [x.img]), r.url].slice(0, 8) }));
  }

  async function save() {
    const fd = new FormData();
    Object.entries({ ...form, imgs: JSON.stringify(form.imgs), active: form.active ? "1" : "0" }).forEach(([k, v]) => fd.set(k, v));
    const r = await run(() => saveProduct(null, fd));
    if (r.ok) setForm(null);
  }

  async function remove(p) {
    if (!confirm(`Remove "${p.name}" from the shop?`)) return;
    const fd = new FormData(); fd.set("id", String(p.id));
    await run(() => deleteProduct(null, fd));
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="card" id="shop-admin">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Student shop <span className="m" style={{ fontWeight: 400 }}>· shown on the homepage</span></h3>
        {!form && !missing && <button type="button" className="btn sm" onClick={() => { setNote({ ok: null, text: "" }); setForm(blank()); }}>+ Add product</button>}
      </div>

      {missing && <p className="adm-msg bad" role="alert">Shop storage is not set up yet. Run supabase/add-content-tables.sql in the Supabase SQL Editor, then refresh this page.</p>}
      {note.text && <p className={"adm-msg " + (note.ok ? "ok" : "bad")} role={note.ok ? "status" : "alert"}>{note.text}</p>}

      {!form && !missing && !products.length && (
        <div className="csv-import">
          <b>The homepage is showing the built-in starter products.</b>
          <p className="m" style={{ margin: "4px 0 10px" }}>Load them into the database to edit prices, stock, pictures and specs, or add your own.</p>
          <button type="button" className="btn sm" disabled={busy} onClick={() => run(() => seedShop(null, new FormData()))}>{busy ? "Loading..." : "Load starter products"}</button>
        </div>
      )}

      {!form && (
        <div className="adm-list" style={{ marginTop: 18 }}>
          {products.map((p) => (
            <div className="adm-item shop-admin-row" key={p.id}>
              <div className="shop-admin-thumb"><img src={p.img || ""} alt="" onError={(e) => (e.currentTarget.style.display = "none")} /></div>
              <div className="shop-admin-info">
                <b>{p.name} {!p.active && <span className="badge bad">Hidden</span>}</b>
                <span className="m">{p.cat} · {naira(p.price)} · stock {p.stock}{p.specs?.length ? " · has specs" : ""}</span>
              </div>
              <div className="adm-acts">
                <button type="button" className="btn ghost sm" onClick={() => { setNote({ ok: null, text: "" }); setForm(fromRow(p)); }}>Edit</button>
                <button type="button" className="btn danger sm" onClick={() => remove(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="adm-edit shop-admin-form" style={{ marginTop: 20 }}>
          <h4 style={{ margin: "0 0 14px" }}>{form.id ? "Edit product" : "New product"}</h4>
          <div className="shop-form-grid">
            <div><label>Name</label><input value={form.name} onChange={set("name")} placeholder="Product name" maxLength={100} /></div>
            <div>
              <label>Category</label>
              <select value={form.cat} onChange={set("cat")}>{SHOP_CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}</select>
            </div>
            <div><label>Price (₦)</label><input type="number" min="0" value={form.price} onChange={set("price")} /></div>
            <div><label>Stock</label><input type="number" min="0" value={form.stock} onChange={set("stock")} /></div>
            <div className="full"><label>Short description</label><input value={form.descr} onChange={set("descr")} maxLength={300} /></div>

            <div className="full">
              <label>Main picture</label>
              <div className="img-up">
                {form.img && <img className="cover" src={form.img} alt="Main picture" />}
                <button type="button" className="btn ghost sm" disabled={busy} onClick={() => mainRef.current?.click()}>{busy ? "Uploading..." : form.img ? "Change picture" : "Upload picture"}</button>
                {form.img && <button type="button" className="btn ghost sm" onClick={() => setForm({ ...form, img: "" })}>Remove</button>}
              </div>
              <input ref={mainRef} type="file" accept="image/*" hidden onChange={(e) => pickImage(e, "main")} />
            </div>

            <div className="full">
              <label>More pictures <span className="m">(shown as small thumbnails when a customer opens the product)</span></label>
              <div className="img-up">
                {form.imgs.map((u, i) => (
                  <span key={u + i} style={{ position: "relative" }}>
                    <img className="cover" style={{ width: 80, height: 60 }} src={u} alt={`Picture ${i + 1}`} />
                    <button type="button" aria-label={`Remove picture ${i + 1}`} onClick={() => setForm({ ...form, imgs: form.imgs.filter((_, k) => k !== i) })} style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", border: 0, background: "#c62828", color: "#fff", cursor: "pointer", lineHeight: 1 }}>×</button>
                  </span>
                ))}
                {form.imgs.length < 8 && <button type="button" className="btn ghost sm" disabled={busy} onClick={() => moreRef.current?.click()}>+ Add picture</button>}
              </div>
              <input ref={moreRef} type="file" accept="image/*" hidden onChange={(e) => pickImage(e, "more")} />
            </div>

            <div className="full">
              <label>System configuration / specs <span className="m">(one per line, like “Processor: Intel Core i5”. Leave empty for products without specs)</span></label>
              <textarea rows={8} value={form.specs} onChange={set("specs")} placeholder={"Processor: Intel Core i5-8350U\nMemory (RAM): 8 GB DDR4\nStorage: 256 GB SSD\nDisplay: 14\" Full HD"} style={{ width: "100%", font: "inherit", padding: 10, border: "1.5px solid var(--line)", borderRadius: 10 }} />
            </div>

            <div className="full">
              <label style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink)" }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ width: "auto" }} />
                Show this product in the shop
              </label>
            </div>
          </div>

          <div className="adm-acts" style={{ marginTop: 16 }}>
            <button type="button" className="btn" disabled={busy} onClick={save}>{busy ? "Saving..." : "Save product"}</button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
