import { notFound } from "next/navigation";
import Link from "next/link";
import Shell from "../../../components/Shell";
import { posts, getPost } from "../../../lib/posts";

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }) {
  const p = getPost(params.slug);
  return p ? { title: `${p.title} | MAFIANA Tech Academy`, description: p.excerpt } : {};
}

export default function Post({ params }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  return (
    <Shell>
      <article className="prose">
        <h1 style={{ fontSize: "clamp(32px,5vw,48px)", margin: "20px 0 8px" }}>{p.title}</h1>
        <p className="m" style={{ color: "var(--mute)" }}>{p.date}</p>
        {p.body.map((t, i) => <p key={i}>{t}</p>)}
        <p><Link className="btn" href="/#contact">Enroll now</Link></p>
      </article>
    </Shell>
  );
}
