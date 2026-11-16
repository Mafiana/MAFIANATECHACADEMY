"use client";
import { useEffect, useState } from "react";
import { DEFAULT_SHOP, loadShop, saveShop, SHOP_CATEGORIES } from "../../lib/shop";

const naira = (x) => "₦" + Number(x || 0).toLocaleString("en-NG");

const blank = () => ({
  id: String(Date.now()),
  name: "",
  price: 0,
  img: "/shop/mouse.jpeg",
  desc: "",
  cat: "Mouse",
  stock: 0,
});

export default function ShopAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => setItems(loadShop()), []);

  function persist(next) {
    setItems(next);
    saveShop(next);
  }

  function save() {
    if (!form.name.trim()) return alert("Product name is required");
    const row = { ...form, price: Number(form.price) || 0, stock: Number(form.stock) || 0 };
    const i = items.findIndex((x) => x.id === row.id);
    const next = i >= 0 ? items.map((x, idx) => (idx === i ? row : x)) : [...items, row];
    persist(next);
    setForm(null);
  }

  function remove(id) {
    if (!confirm("Remove this product?")) return;
    persist(items.filter((x) => x.id !== id));
  }

  function resetDefaults() {
    if (!confirm("Reset shop to default products?")) return;
    persist(DEFAULT_SHOP);
    setForm(null);
  }

  return (
    <div className="card" id="shop-admin">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Student shop</h3>
        <div className="adm-acts">
          <button type="button" className="btn sm" onClick={() => setForm(blank())}>
            Add product
          </button>
          <button type="button" className="btn ghost sm" onClick={resetDefaults}>
            Reset defaults
          </button>
        </div>
      </div>

      <div className="adm-list" style={{ marginTop: 14 }}>
        {items.map((p) => (
          <div className="adm-item" key={p.id}>
            <div className="adm-item-main">
              <span>
                <b>{p.name}</b>{" "}
                <span className="m">
                  {p.cat} · {naira(p.price)} · stock {p.stock}
                </span>
              </span>
              <span className="adm-acts">
                <button type="button" className="btn ghost sm" onClick={() => setForm({ ...p })}>
                  Edit
                </button>
                <button type="button" className="btn danger sm" onClick={() => remove(p.id)}>
                  Delete
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className="adm-edit" style={{ marginTop: 12 }}>
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Description</label>
          <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          <label>Image path</label>
          <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="/shop/mouse.jpeg" />
          <div className="grid" style={{ marginTop: 8 }}>
            <div>
              <label>Price (₦)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div>
              <label>Category</label>
              <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {SHOP_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="adm-acts" style={{ marginTop: 12 }}>
            <button type="button" className="btn" onClick={save}>
              Save product
            </button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}