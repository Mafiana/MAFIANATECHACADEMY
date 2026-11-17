import { posts as staticPosts } from "./posts";
import { publicClient } from "./supabase/public";
import { sanitizeHtml, wordCount } from "./sanitizeHtml";

// Posts written in the admin panel (Supabase) are shown together with the built-in posts in lib/posts.js.
const COVERS = { Office: "/blog/office.svg", Career: "/blog/career.svg", Data: "/blog/data.svg", Web: "/blog/web.svg", Design: "/blog/design.svg", Learning: "/blog/learning.svg" };

export async function getDbPosts() {
  try {
    const sb = publicClient();
    if (!sb) return [];
    const { data, error } = await sb.from("blog_posts").select("slug,title,excerpt,category,cover,body_html,created_at").eq("published", true).order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r) => {
      const html = sanitizeHtml(r.body_html);
      return {
        slug: r.slug, title: r.title, excerpt: r.excerpt, category: r.category,
        date: String(r.created_at).slice(0, 10),
        cover: r.cover || COVERS[r.category] || "/blog/learning.svg",
        course: null, body: [], html,
        minutes: Math.max(2, Math.round(wordCount(html) / 200)),
      };
    });
  } catch {
    return [];
  }
}

export async function getAllPosts() {
  const db = await getDbPosts();
  const taken = new Set(db.map((p) => p.slug));
  return [...db, ...staticPosts.filter((p) => !taken.has(p.slug))].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const relatedIn = (all, post, n = 3) => {
  const same = all.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = all.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...same, ...rest].slice(0, n);
};
