import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "../../../components/Shell";
import CourseCard from "../../../components/courses/CourseCard";
import CourseFeeCard from "../../../components/courses/CourseFeeCard";
import { CATALOG, getCourse } from "../../../lib/catalog";
import { naira } from "../../../lib/courses";

export const generateStaticParams = () => CATALOG.map((c) => ({ slug: c.slug }));

export function generateMetadata({ params }) {
  const c = getCourse(params.slug);
  return c ? { title: `${c.name} | MAF Tech Academy`, description: `${c.tagline} ${c.weeks} weeks, ${c.level.toLowerCase()}, certificate included.`, openGraph: { title: c.name, description: c.tagline, images: [c.image] } } : {};
}

const FAQ = [
  ["Can I pay in installments?", "Yes. Most courses let you pay half to book your seat and the balance in installments. Digital Literacy is paid once. The fee card shows the plan."],
  ["Is there a certificate?", "Yes. Finish the course, pass the final test and clear your fees to receive a certificate. Anyone can verify it on our website."],
  ["Do I get lessons I can watch again?", "Yes. Your student portal has video lessons and quizzes for the course, so you can revise any time."],
  ["Physical or online: what is the difference?", "The content is the same. Physical students sit in class and use our computer lab. Online students join from anywhere at a lower fee and need their own laptop."],
];

export default function Course({ params }) {
  const c = getCourse(params.slug);
  if (!c) notFound();
  const others = CATALOG.filter((x) => x.slug !== c.slug && (x.category === c.category || true)).sort((a, b) => (a.category === c.category ? -1 : 0) - (b.category === c.category ? -1 : 0)).slice(0, 3);
  const ld = {
    "@context": "https://schema.org", "@type": "Course", name: c.name, description: c.about,
    provider: { "@type": "Organization", name: "MAF Tech Academy" },
    offers: { "@type": "Offer", priceCurrency: "NGN", price: c.online, category: "Paid" },
  };
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="cd">
        <header className="cd-hero">
          <div className="cd-hero-in">
            <nav className="crumbs light" aria-label="Breadcrumb"><Link href="/courses">Courses</Link><span aria-hidden="true">/</span><span>{c.category}</span></nav>
            <h1>{c.name}</h1>
            <p className="cd-tag">{c.tagline}</p>
            <ul className="cd-badges">
              <li>{c.level}</li><li>{c.weeks} weeks</li><li>Online or physical</li><li>Certificate included</li>
            </ul>
            <p className="cd-from">From <b>{naira(c.online)}</b> online · <b>{naira(c.physical)}</b> physical</p>
          </div>
        </header>

        <div className="cd-layout">
          <div className="cd-main">
            <section aria-labelledby="about"><h2 id="about">About this course</h2><p>{c.about}</p></section>

            <section className="cd-learn" aria-labelledby="learn">
              <h2 id="learn">What you’ll learn</h2>
              <ul className="cd-checks">{c.learn.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>

            <section aria-labelledby="skills">
              <h2 id="skills">Skills you’ll gain</h2>
              <ul className="cd-chips">{c.skills.map((s) => <li key={s}>{s}</li>)}</ul>
            </section>

            <section aria-labelledby="syllabus">
              <h2 id="syllabus">Syllabus</h2>
              <p className="m">{c.modules.length} modules over {c.weeks} weeks. The order may change slightly to suit the class.</p>
              <div className="cd-syl">
                {c.modules.map((m, i) => (
                  <details key={m.title} open={i === 0}>
                    <summary><span className="cd-wk">Week {i + 1}</span><span>{m.title}</span></summary>
                    <ul>{m.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                  </details>
                ))}
              </div>
            </section>

            <div className="cd-two">
              <section aria-labelledby="who"><h2 id="who">Who it’s for</h2><ul className="cd-dots">{c.audience.map((x) => <li key={x}>{x}</li>)}</ul></section>
              <section aria-labelledby="req"><h2 id="req">What you need</h2><ul className="cd-dots">{c.requirements.map((x) => <li key={x}>{x}</li>)}</ul></section>
            </div>

            <section aria-labelledby="careers">
              <h2 id="careers">Where it can take you</h2>
              <p className="m">Roles this course helps you prepare for. We cannot promise a job, but our career support helps you apply and find your first clients.</p>
              <ul className="cd-chips alt">{c.careers.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>

            <section aria-labelledby="faq">
              <h2 id="faq">Questions</h2>
              {FAQ.map(([q, a]) => <details className="card" key={q}><summary>{q}</summary><p className="m">{a}</p></details>)}
            </section>
          </div>
          <div className="cd-side"><CourseFeeCard course={c} /></div>
        </div>

        <section className="cd-more">
          <h2>More courses you may like</h2>
          <div className="cc-grid">{others.map((x) => <CourseCard key={x.slug} course={x} />)}</div>
          <p style={{ marginTop: 18 }}><Link className="btn ghost" href="/courses">Browse all courses</Link></p>
        </section>
      </div>
    </Shell>
  );
}
