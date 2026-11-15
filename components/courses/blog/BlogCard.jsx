import Link from "next/link";
import { AUTHOR, longDate } from "../../lib/posts";

export function Meta({ post }) {
  return (
    <div className="bl-meta">
      <span className="bl-av" aria-hidden="true">M</span>
      <span>{AUTHOR.name}</span><span aria-hidden="true">·</span>
      <time dateTime={post.date}>{longDate(post.date)}</time><span aria-hidden="true">·</span>
      <span>{post.minutes} min read</span>
    </div>
  );
}

export default function BlogCard({ post, featured = false }) {
  return (
    <article className={"bl-card" + (featured ? " featured" : "")}>
      <Link href={`/blog/${post.slug}`} className="bl-cover" aria-label={post.title} tabIndex={-1}>
        <img src={post.cover} alt="" width="1200" height="630" loading={featured ? "eager" : "lazy"} />
        <span className="bl-cat">{post.category}</span>
      </Link>
      <div className="bl-body">
        <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p className="m">{post.excerpt}</p>
        <Meta post={post} />
      </div>
    </article>
  );
}
