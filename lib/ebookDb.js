import { publicClient } from "./supabase/public";

export async function getEbooks() {
  try {
    const sb = publicClient();
    if (!sb) return [];
    const { data, error } = await sb
      .from("ebooks")
      .select("*")
      .eq("active", true)
      .order("sort")
      .order("id");
    if (error || !data) return [];
    return data.map((r) => ({
      id: String(r.id),
      title: r.title,
      author: r.author || "",
      description: r.description || "",
      cover: r.cover_url || "",
      file: r.file_url,
      category: r.category || "General",
      featured: !!r.featured,
    }));
  } catch {
    return [];
  }
}
