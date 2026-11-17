export const SHOP_CATEGORIES = ["All", "Laptop", "Mouse", "Keyboard", "Flash", "Bag", "Charger", "Headset"];

// img = main picture. imgs (optional) = extra pictures shown as thumbnails. specs (optional) = the "System configuration" table.
// To use a real photo, put it in /public/shop and change the file name below.
const COMMON = [["Condition", "UK used, Grade A"], ["Warranty", "30 days"]];

export const DEFAULT_SHOP = [
  {
    id: "l1", name: "HP EliteBook 840 G5", price: 320000, cat: "Laptop", stock: 6,
    img: "/shop/laptop-hp-elitebook-1.svg", imgs: ["/shop/laptop-hp-elitebook-1.svg", "/shop/laptop-hp-elitebook-2.svg"],
    desc: "Slim business laptop. Fast, light and tough, great for office work and learning to code.",
    specs: [["Processor", "Intel Core i5-8350U (4 cores, up to 3.6 GHz)"], ["Memory (RAM)", "8 GB DDR4 (upgradeable)"], ["Storage", "256 GB SSD"], ["Display", "14\" Full HD (1920 × 1080)"], ["Graphics", "Intel UHD 620"], ["Operating system", "Windows 11 Pro"], ["Battery", "About 6 to 8 hours"], ["Ports", "2 × USB-A, USB-C, HDMI, LAN"], ["Extras", "Backlit keyboard, fingerprint reader, webcam"], ...COMMON],
  },
  {
    id: "l2", name: "Lenovo ThinkPad T480", price: 295000, cat: "Laptop", stock: 8,
    img: "/shop/laptop-thinkpad-t480-1.svg", imgs: ["/shop/laptop-thinkpad-t480-1.svg", "/shop/laptop-thinkpad-t480-2.svg"],
    desc: "The classic student and office workhorse. Great keyboard and long battery life.",
    specs: [["Processor", "Intel Core i5-8250U (4 cores, up to 3.4 GHz)"], ["Memory (RAM)", "8 GB DDR4 (upgradeable)"], ["Storage", "256 GB SSD"], ["Display", "14\" Full HD (1920 × 1080)"], ["Graphics", "Intel UHD 620"], ["Operating system", "Windows 11 Pro"], ["Battery", "About 6 to 8 hours"], ["Ports", "2 × USB-A, 2 × USB-C, HDMI, LAN"], ["Extras", "Backlit keyboard, fingerprint reader, webcam"], ...COMMON],
  },
  {
    id: "l3", name: "Dell Latitude 7490", price: 310000, cat: "Laptop", stock: 5,
    img: "/shop/laptop-dell-latitude-1.svg", imgs: ["/shop/laptop-dell-latitude-1.svg", "/shop/laptop-dell-latitude-2.svg"],
    desc: "Lightweight and quick. A solid choice for Excel, design and web development classes.",
    specs: [["Processor", "Intel Core i5-8350U (4 cores, up to 3.6 GHz)"], ["Memory (RAM)", "8 GB DDR4 (upgradeable)"], ["Storage", "256 GB SSD"], ["Display", "14\" Full HD (1920 × 1080)"], ["Graphics", "Intel UHD 620"], ["Operating system", "Windows 11 Pro"], ["Battery", "About 6 to 8 hours"], ["Ports", "2 × USB-A, USB-C, HDMI, LAN, SD card reader"], ["Extras", "Backlit keyboard, webcam"], ...COMMON],
  },
  {
    id: "l4", name: "Apple MacBook Air M1", price: 950000, cat: "Laptop", stock: 3,
    img: "/shop/laptop-macbook-air-1.svg", imgs: ["/shop/laptop-macbook-air-1.svg", "/shop/laptop-macbook-air-2.svg"],
    desc: "Very fast and quiet with all-day battery. Ideal for design, video and development.",
    specs: [["Processor", "Apple M1 chip (8-core CPU, 7-core GPU)"], ["Memory (RAM)", "8 GB unified memory"], ["Storage", "256 GB SSD"], ["Display", "13.3\" Retina (2560 × 1600)"], ["Graphics", "Apple M1 integrated GPU"], ["Operating system", "macOS"], ["Battery", "Up to 18 hours (Apple rating)"], ["Ports", "2 × Thunderbolt / USB 4, headphone jack"], ["Extras", "Touch ID, backlit keyboard, FaceTime HD camera"], ...COMMON],
  },
  { id: "1", name: "Wireless mouse", price: 7000, img: "/shop/mouse.jpeg", desc: "Quiet click, long battery", cat: "Mouse", stock: 20 },
  { id: "2", name: "Keyboard", price: 10000, img: "/shop/keyboard.jpeg", desc: "Full size, soft keys", cat: "Keyboard", stock: 15 },
  { id: "3", name: "64GB flash drive", price: 10000, img: "/shop/flash.jpeg", desc: "USB 3.0, metal body", cat: "Flash", stock: 40 },
  { id: "4", name: "Laptop charger", price: 15000, img: "/shop/charger.jpeg", desc: "Compatible with common models", cat: "Charger", stock: 12 },
  { id: "5", name: "Laptop bag", price: 14000, img: "/shop/bag.jpeg", desc: "Padded, fits 15.6 inch", cat: "Bag", stock: 18 },
  { id: "6", name: "Headphones", price: 9000, img: "/shop/headphones.jpeg", desc: "Over-ear, for class & calls", cat: "Headset", stock: 10 },
  { id: "h1", name: "Wireless Bluetooth headphones", price: 18000, img: "/shop/headset-bluetooth.svg", desc: "Foldable over-ear, Bluetooth, long battery for study sessions", cat: "Headset", stock: 12 },
  { id: "h2", name: "USB headset with microphone", price: 8500, img: "/shop/headset-usb-mic.svg", desc: "Clear mic for online classes and meetings. Plug and play.", cat: "Headset", stock: 20 },
  { id: "h3", name: "Gaming headset", price: 14500, img: "/shop/headset-gaming.svg", desc: "Comfortable padded ear cups with a boom microphone", cat: "Headset", stock: 9 },
  { id: "h4", name: "Wireless earbuds", price: 12000, img: "/shop/headset-earbuds.svg", desc: "Pocket-size with a charging case, good for calls and music", cat: "Headset", stock: 15 },
  { id: "7", name: "USB mouse (wired)", price: 4500, img: "/shop/mouse.jpeg", desc: "Simple and reliable", cat: "Mouse", stock: 25 },
  { id: "8", name: "128GB flash drive", price: 16000, img: "/shop/flash.jpeg", desc: "More space for projects", cat: "Flash", stock: 14 },
];

const KEY = "maf_shop_products";
const fix = (list) => list.map((p) => (p.cat === "Audio" ? { ...p, cat: "Headset" } : p)); // the Audio tab is now Headset

export function loadShop() {
  if (typeof window === "undefined") return DEFAULT_SHOP;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SHOP;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? fix(parsed) : DEFAULT_SHOP;
  } catch {
    return DEFAULT_SHOP;
  }
}

export function saveShop(list) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("maf-shop-updated"));
}
