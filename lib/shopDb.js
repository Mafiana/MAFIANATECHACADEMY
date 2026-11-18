import { DEFAULT_SHOP } from "./shop";
import { publicClient } from "./supabase/public";

// Products saved in the admin panel. If none are saved yet (or the database cannot be reached),
// the starter list in lib/shop.js is shown instead.
export async function getShopProducts() {
  try {
    const sb = publicClient();
    if (!sb) return DEFAULT_SHOP;
    const { data, error } = await sb.from("shop_products").select("*").eq("active", true).order("sort").order("id");
    if (error || !data?.length) return DEFAULT_SHOP;
    return data.map((r) => ({
      id: String(r.id), name: r.name, cat: r.cat, price: r.price, stock: r.stock,
      img: r.img || "", imgs: Array.isArray(r.imgs) && r.imgs.length ? r.imgs : undefined,
      specs: Array.isArray(r.specs) && r.specs.length ? r.specs : undefined, desc: r.descr || "",
      featured: !!r.featured, isNew: !!r.is_new,
    }));
  } catch {
    return DEFAULT_SHOP;
  }
}
