import Link from "next/link";
import Shell from "../../components/Shell";
import { posts } from "../../lib/posts";

export const metadata = { title: "Blog | MAFIANA Tech Academy", description: "Short guides on Excel, freelancing and choosing a tech career." };

export default function Blog() {
  return (
    <Shell>
      <section>
        <h2>Blog</h2>
        <p className="sub">Short guides to help you start and earn.</p>
        <div className="grid">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card" style={{ textDecoration: "none" }}>
              <h3>{p.title}</h3><p className="m">{p.excerpt}</p><span className="tag">{p.date}</span>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
