import Shell from "../../components/Shell";
import BlogIndex from "../../components/blog/BlogIndex";
import { posts, POST_CATEGORIES } from "../../lib/posts";
import { waHref } from "../../lib/wa";

export const metadata = {
  title: "Blog | MAF Tech Academy",
  description: "Practical guides on Excel, SQL, web development, design, freelancing and studying online, from the MAF Tech Academy team.",
};

export default function Blog() {
  return (
    <Shell>
      <section className="bl-hero">
        <p className="bl-eyebrow">The academy blog</p>
        <h1>Learn something useful today</h1>
        <p className="sub">Short, practical guides on computer skills, data, web, design and getting your first clients. Written by the people who teach the classes.</p>
      </section>
      <BlogIndex posts={posts} categories={POST_CATEGORIES} />
      <section className="bl-cta">
        <div>
          <h2>Ready to learn it properly?</h2>
          <p>Join a class in person or online, practise on real projects and finish with a certificate.</p>
        </div>
        <div className="adm-acts">
          <a className="btn" href="/courses">Browse courses</a>
          <a className="btn ghost-light" href={waHref("Hello MAF Tech Academy, I read your blog and want to learn more about your courses.")} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a>
        </div>
      </section>
    </Shell>
  );
}
