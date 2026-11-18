"use server";
import { publicClient } from "../../lib/supabase/public";

// Adds (+1) or removes (-1) one love on a blog post. Needs supabase/add-blog-loves.sql to have been run.
export async function loveAction(slug, delta) {
  try {
    if (typeof slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,199}$/i.test(slug)) return { ok: false };
    if (delta !== 1 && delta !== -1) return { ok: false };
    const sb = publicClient();
    if (!sb) return { ok: false };
    const { data, error } = await sb.rpc("love_post", { p_slug: slug, p_delta: delta });
    if (error) return { ok: false };
    return { ok: true, count: Number(data) || 0 };
  } catch {
    return { ok: false };
  }
}
