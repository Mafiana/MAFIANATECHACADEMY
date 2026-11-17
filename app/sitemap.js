import { getAllPosts } from "../lib/blogDb";

export default async function sitemap() {
  const posts = await getAllPosts();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return [
    { url: base }, { url: `${base}/blog` }, { url: `${base}/privacy` }, { url: `${base}/terms` },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date })),
  ];
}
