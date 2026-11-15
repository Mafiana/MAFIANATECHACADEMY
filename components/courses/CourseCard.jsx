import Link from "next/link";
import { naira } from "../../lib/courses";

export default function CourseCard({ course: c }) {
  return (
    <article className="cc">
      <Link href={`/courses/${c.slug}`} className="cc-img" aria-label={c.name} tabIndex={-1}>
        <img src={c.image} alt="" width="800" height="500" loading="lazy" />
        <span className="cc-cat">{c.category}</span>
      </Link>
      <div className="cc-body">
        <div className="cc-brand">MAF Tech Academy</div>
        <h3><Link href={`/courses/${c.slug}`}>{c.name}</Link></h3>
        <p className="m cc-skills">{c.short}</p>
        <ul className="cc-facts" aria-label="Course facts">
          <li>{c.level}</li><li>{c.weeks} weeks</li><li>Certificate</li>
        </ul>
        <div className="cc-foot">
          <div><span className="m">From</span> <b>{naira(c.online)}</b> <span className="m">online</span></div>
          <Link className="btn ghost sm" href={`/courses/${c.slug}`}>View course</Link>
        </div>
      </div>
    </article>
  );
}
