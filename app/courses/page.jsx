import Shell from "../../components/Shell";
import CourseCatalog from "../../components/courses/CourseCatalog";
import { CATALOG, CATEGORIES, LEVELS } from "../../lib/catalog";
import { waHref } from "../../lib/wa";

export const metadata = {
  title: "Courses | MAF Tech Academy",
  description: "Computer basics and Microsoft Office, digital literacy, data analytics, graphic design and web development. Learn in class or online and get a certificate.",
};

export default function Courses() {
  return (
    <Shell>
      <section className="cat-hero">
        <p className="bl-eyebrow">Courses</p>
        <h1>Skills you can use for work this month</h1>
        <p className="sub">Practical courses taught by working professionals. Study in our lab or online, pay in installments and finish with a certificate.</p>
        <ul className="cat-stats">
          <li><b>{CATALOG.length}</b><span>courses</span></li>
          <li><b>Online + physical</b><span>choose how you learn</span></li>
          <li><b>Certificate</b><span>on every course</span></li>
          <li><b>Pay small small</b><span>installment plans</span></li>
        </ul>
      </section>
      <CourseCatalog courses={CATALOG} categories={CATEGORIES} levels={LEVELS} />
      <section className="bl-cta">
        <div><h2>Not sure where to start?</h2><p>Tell us what you want to do and we will recommend the right course. Most beginners start with Computer Basics + Microsoft Office.</p></div>
        <a className="btn ghost-light" href={waHref("Hello MAF Tech Academy, please help me choose the right course.")} target="_blank" rel="noopener noreferrer">Talk to us on WhatsApp</a>
      </section>
    </Shell>
  );
}
