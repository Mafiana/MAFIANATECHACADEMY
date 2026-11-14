import { posts } from "../lib/posts";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return [
    { url: base }, { url: `${base}/blog` }, { url: `${base}/privacy` }, { url: `${base}/terms` },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date })),
  ];
}
