export const SHOP_CATEGORIES = ["All", "Laptop", "Mouse", "Keyboard", "Flash", "Bag", "Charger", "Audio"];

export const DEFAULT_SHOP = [
  { id: "1", name: "Wireless mouse", price: 7000, img: "/shop/mouse.jpeg", desc: "Quiet click, long battery", cat: "Mouse", stock: 20 },
  { id: "2", name: "Keyboard", price: 10000, img: "/shop/keyboard.jpeg", desc: "Full size, soft keys", cat: "Keyboard", stock: 15 },
  { id: "3", name: "64GB flash drive", price: 10000, img: "/shop/flash.jpeg", desc: "USB 3.0, metal body", cat: "Flash", stock: 40 },
  { id: "4", name: "Laptop charger", price: 15000, img: "/shop/charger.jpeg", desc: "Compatible with common models", cat: "Charger", stock: 12 },
  { id: "5", name: "Laptop bag", price: 14000, img: "/shop/bag.jpeg", desc: "Padded, fits 15.6 inch", cat: "Bag", stock: 18 },
  { id: "6", name: "Headphones", price: 9000, img: "/shop/headphones.jpeg", desc: "Over-ear, for class & calls", cat: "Audio", stock: 10 },
  { id: "7", name: "USB mouse (wired)", price: 4500, img: "/shop/mouse.jpeg", desc: "Simple and reliable", cat: "Mouse", stock: 25 },
  { id: "8", name: "128GB flash drive", price: 16000, img: "/shop/flash.jpeg", desc: "More space for projects", cat: "Flash", stock: 14 },
];

const KEY = "maf_shop_products";

export function loadShop() {
  if (typeof window === "undefined") return DEFAULT_SHOP;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SHOP;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_SHOP;
  } catch {
    return DEFAULT_SHOP;
  }
}

export function saveShop(list) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("maf-shop-updated"));
}