import { notFound } from "next/navigation";
import Link from "next/link";
import Shell from "../../../components/Shell";
import PostBody from "../../../components/blog/PostBody";
import BlogCard, { Meta } from "../../../components/blog/BlogCard";
import ReadingProgress from "../../../components/blog/ReadingProgress";
import ShareBar from "../../../components/blog/ShareBar";
import LoveButton from "../../../components/blog/LoveButton";
import { publicClient } from "../../../lib/supabase/public";
import { posts, slugify, AUTHOR } from "../../../lib/posts";
import { getAllPosts, relatedIn } from "../../../lib/blogDb";
import { headingsOf } from "../../../lib/sanitizeHtml";
import { getCourse } from "../../../lib/catalog";
import { waHref } from "../../../lib/wa";

export const revalidate = 60; // new posts from the admin panel appear within a minute
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }) {
  const p = (await getAllPosts()).find((x) => x.slug === params.slug);
  if (!p) return {};
  const og = p.cover.startsWith("data:") ? {} : { images: [p.cover] };
  return { title: `${p.title} | MAF Tech Academy`, description: p.excerpt, openGraph: { title: p.title, description: p.excerpt, type: "article", ...og } };
}

export default async function Post({ params }) {
  const all = await getAllPosts();
  const p = all.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const toc = p.html ? headingsOf(p.html) : p.body.filter((b) => b.h).map((b) => b.h);
  const course = p.course ? getCourse(p.course) : null;
  let loves = 0;
  try {
    const sb = publicClient();
    const { data } = sb ? await sb.from("blog_loves").select("loves").eq("slug", p.slug).maybeSingle() : { data: null };
    loves = data?.loves || 0;
  } catch {}
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt, datePublished: p.date,
    author: { "@type": "Organization", name: "MAF Tech Academy" }, publisher: { "@type": "Organization", name: "MAF Tech Academy" },
    ...(site && !p.cover.startsWith("data:") ? { image: (p.cover.startsWith("http") ? "" : site) + p.cover, mainEntityOfPage: `${site}/blog/${p.slug}` } : {}),
  };
  return (
    <Shell>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="bl-article">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>{p.category}</span></nav>
        <header className="bl-head">
          <span className="bl-cat static">{p.category}</span>
          <h1>{p.title}</h1>
          <p className="bl-dek">{p.excerpt}</p>
          <Meta post={p} />
        </header>
        <img className="bl-hero-img" src={p.cover} alt="" width="1200" height="630" />
        <div className="bl-layout">
          <div className="prose bl-prose">
            <PostBody body={p.body} html={p.html} />
            <LoveButton slug={p.slug} initial={loves} />
            <ShareBar title={p.title} />
            <div className="bl-author">
              <span className="bl-av big" aria-hidden="true">M</span>
              <div><b>{AUTHOR.name}</b><p className="m">{AUTHOR.role}. We teach practical skills in computer, data, design and web development, in class and online.</p></div>
            </div>
          </div>
          <aside className="bl-side">
            {toc.length > 1 && (
              <nav className="card bl-toc" aria-label="In this article">
                <b>In this article</b>
                {toc.map((t) => <a key={t} href={`#${slugify(t)}`}>{t}</a>)}
              </nav>
            )}
            <div className="card bl-sidecta">
              <b>{course ? course.name : "Learn with us"}</b>
              <p className="m">{course ? `${course.weeks} weeks · ${course.level} · certificate included` : "Classes in person or online, with a certificate at the end."}</p>
              {course && <Link className="btn" href={`/courses/${course.slug}`}>View the course</Link>}
              <a className={course ? "btn ghost" : "btn"} href={waHref(course ? `Hello MAF Tech Academy, I read your article "${p.title}" and want to join ${course.name}.` : `Hello MAF Tech Academy, I read your article "${p.title}" and want to learn more.`)} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
            </div>
          </aside>
        </div>
      </article>
      <section className="bl-related">
        <h2>Keep reading</h2>
        <div className="bl-grid">{relatedIn(all, p).map((r) => <BlogCard key={r.slug} post={r} />)}</div>
      </section>
    </Shell>
  );
}
