"use client";
import { useState } from "react";
import ShopSection from "./ShopSection";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HeroSlider from "./HeroSlider";
import CourseCard from "./courses/CourseCard";
import BlogCard from "./blog/BlogCard";
import { CATALOG } from "../lib/catalog";
import { posts } from "../lib/posts";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP || "234XXXXXXXXXX";
const naira = (x) => "₦" + x.toLocaleString("en-NG");
const wa = (t) => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;

const COURSES = CATALOG.map((c) => ({ n: c.name, w: c.weeks, p: c.physical, o: c.online, i: c.installments, d: c.short }));
const COMBOS = [
  ["Beginner Combo", "Computer Basics + Digital Literacy", 65000, 80000],
  ["Job Ready Combo", "Computer Basics + Data Analytics", 170000, 200000],
];
const ABOUT = [
  ["Taught by a working developer", "Founded by Stanley Mafiana, a web developer and IT support specialist who builds for real clients every week."],
  ["Physical or online", "Sit in class with a teacher, or join online for a lower fee. The content is the same."],
  ["Pay small small", "Book your seat with half the fee and pay the balance in installments. Most courses allow it."],
  ["Certificate and ID card", "Every student gets an academy ID card, learning materials and a certificate on completion."],
];
const SERVICES = [
  ["Admission office", "Register, pay your seat fee and get your ID card."],
  ["Training hall and computer lab", "Practise on a computer during every class."],
  ["Online class studio", "Live and recorded classes for students outside town."],
  ["Certificates and exams", "Final test and a certificate you can show employers."],
  ["Career support", "Guidance on jobs, freelancing and finding your first clients."],
];
const SVG = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const SERVICE_ICONS = [
  // Admission office: ID card
  <svg key="a" {...SVG}><rect x="4" y="3" width="16" height="18" rx="2.5" /><path d="M9 3v2.5h6V3" /><circle cx="12" cy="11" r="2.4" /><path d="M7.8 17.5c.7-2 2.2-3 4.2-3s3.5 1 4.2 3" /></svg>,
  // Training hall and computer lab: monitor
  <svg key="b" {...SVG}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>,
  // Online class studio: play button
  <svg key="c" {...SVG}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M10 9l5 3-5 3z" /></svg>,
  // Certificates and exams: certificate with ribbon
  <svg key="d" {...SVG}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h5" /><path d="M14 3l5 5v3" /><path d="M14 3v5h5" /><path d="M8.5 12h4M8.5 15.5h2.5" /><circle cx="17" cy="16" r="2.6" /><path d="M15.6 18.4L15 21l2-1 2 1-.6-2.6" /></svg>,
  // Career support: briefcase
  <svg key="e" {...SVG}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" /><path d="M11 13v2h2v-2" /></svg>,
];
const MORE = [
  ["Corporate training", "We train your staff in Office, data, design or web, at your office or in our lab. Tell us the team size and we send a quote.", "I want corporate training for my company", "Request a quote", "corp"],
  ["Online courses", "Learn from any city with live classes and recorded lessons at the online fee.", null, "See courses", "online"],
  ["Course + laptop + accessories", "Join a course and take a laptop, mouse, flash drive and bag in one deal. Ask for today’s laptop prices.", "I want the course + laptop + accessories combo", "Ask about the combo", "combo"],
];

const TEAM = [
  {
    name: "Stanley Mafiana",
    role: "Director & Lead Instructor",
    initials: "SM",
    twitter: "https://x.com/stanlee12242",
linkedin: "https://www.linkedin.com/in/mafiana-stanley-403773223/",
  },
];
const FAQ = [
  ["Can I pay in installments?", "Yes. Pay half to book your seat and the balance before week 3. Digital Literacy is paid once."],
  ["Do I need my own laptop?", "Physical students can use our computer lab. Online students need a laptop. We sell accessories and can help you get one."],
  ["Is there a certificate?", "Yes. Every student receives an ID card, certificate and materials."],
  ["Can I start with no experience?", "Yes. Computer Basics + Office is made for complete beginners."],
  ["Do you help with jobs?", "Yes. Career support covers job applications, freelancing and finding your first clients."],
];
const REVIEWS = [
  ["I could not use Excel before. After four weeks I now do the monthly report at my office alone.", "Amina", "Computer Basics + Office", null],
  ["The installment plan helped me a lot. I finished Data Analytics and got an internship offer.", "Chidi", "Data Analytics", null],
  ["I now design logos and flyers for three shops in my area. The classes were practical from day one.", "Tolu", "Graphic Design", null],
];

function Section({ id, title, sub, children }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      {children}
    </section>
  );
}

function WaLink({ text, ghost = true, children }) {
  return (
    <a className={ghost ? "btn ghost" : "btn"} href={wa(text)} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function EnrollForm() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState(COURSES[0]?.n || "");
  const [msg, setMsg] = useState("");
  const submit = (e) => {
    e.preventDefault();
    window.open(
      wa(`Hello MAF Tech Academy, my name is ${name}. I want to enroll for ${course}.${msg ? " " + msg : ""}`),
      "_blank"
    );
  };
  return (
    <form className="card" style={{ maxWidth: 560 }} onSubmit={submit}>
      <label htmlFor="fn">Your name</label>
      <input id="fn" required value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="fc">Course</label>
      <select id="fc" value={course} onChange={(e) => setCourse(e.target.value)}>
        {COURSES.map((c) => (
          <option key={c.n}>{c.n}</option>
        ))}
      </select>
      <label htmlFor="fm">Message (optional)</label>
      <textarea id="fm" rows="3" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button className="btn" type="submit" style={{ marginTop: 14 }}>
        Send on WhatsApp
      </button>
    </form>
  );
}

export default function App({ shop }) {
  return (
    <>
      <Navbar />
      <HeroSlider>
        <h1>Learn. Practice. Grow.</h1>
        <p>
          Computer, data, design and web development. Learn in class or online, then get a certificate and a
          job-ready portfolio.
        </p>
        <div className="hero-cta">
          <a className="btn" href="#courses">
            See all courses
          </a>
          <Link className="btn ghost-light" href="/portal">
            Preview student portal
          </Link>
        </div>
      </HeroSlider>

      <div className="wrap">
        {/* ===== About the academy – alternating image / text ===== */}
        <Section
          id="about"
          title="About the academy"
          sub="MAF Tech Academy teaches practical skills you can use for work the same month you learn them. Small classes, real projects and a certificate at the end."
        >
          <style>{`
            .about-alt { display: flex; flex-direction: column; gap: 48px; margin-top: 28px; }
            .about-row { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; }
            .about-img { border-radius: 16px; overflow: hidden; aspect-ratio: 16/10; background: var(--mint); min-height: 220px; }
            .about-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .about-body h3 { font-size: 24px; margin: 0 0 12px; }
            .about-body p { margin: 0; color: var(--mute); font-size: 16px; line-height: 1.65; }
            @media (max-width: 720px) {
              .about-row { grid-template-columns: 1fr !important; gap: 16px !important; }
              .about-row .about-body { order: 2 !important; }
              .about-row .about-img { order: 1 !important; min-height: 180px; }
            }
          `}</style>
          <div className="about-alt">
            {/* 1. Image then text */}
            <div className="about-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
              <div className="about-img" style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "16/10", background: "var(--mint)", minHeight: 220 }}>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80" alt="Students learning together" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div className="about-body">
                <h3 style={{ fontSize: 24, margin: "0 0 12px" }}>{ABOUT[0][0]}</h3>
                <p style={{ margin: 0, color: "var(--mute)", fontSize: 16, lineHeight: 1.65 }}>{ABOUT[0][1]}</p>
              </div>
            </div>

            {/* 2. Text then image */}
            <div className="about-row reverse" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
              <div className="about-body" style={{ order: 1 }}>
                <h3 style={{ fontSize: 24, margin: "0 0 12px" }}>{ABOUT[1][0]}</h3>
                <p style={{ margin: 0, color: "var(--mute)", fontSize: 16, lineHeight: 1.65 }}>{ABOUT[1][1]}</p>
              </div>
              <div className="about-img" style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "16/10", background: "var(--mint)", minHeight: 220, order: 2 }}>
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80" alt="Online and physical classes" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>

            {/* 3. Image then text */}
            <div className="about-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
              <div className="about-img" style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "16/10", background: "var(--mint)", minHeight: 220 }}>
                <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80" alt="Flexible payment plans" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div className="about-body">
                <h3 style={{ fontSize: 24, margin: "0 0 12px" }}>{ABOUT[2][0]}</h3>
                <p style={{ margin: 0, color: "var(--mute)", fontSize: 16, lineHeight: 1.65 }}>{ABOUT[2][1]}</p>
              </div>
            </div>

            {/* 4. Text then image */}
            <div className="about-row reverse" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
              <div className="about-body" style={{ order: 1 }}>
                <h3 style={{ fontSize: 24, margin: "0 0 12px" }}>{ABOUT[3][0]}</h3>
                <p style={{ margin: 0, color: "var(--mute)", fontSize: 16, lineHeight: 1.65 }}>{ABOUT[3][1]}</p>
              </div>
              <div className="about-img" style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "16/10", background: "var(--mint)", minHeight: 220, order: 2 }}>
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=80" alt="Certificate and ID card" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          </div>
        </Section>

        {/* ===== Student services ===== */}
        <Section
          id="services"
          title="Student services Cycle"
          sub="Five services cycle you from registration to your first job."
        >
          <div className="svc-block svc-layout">
            <div className="svc-copy">
              <h3>Support at every step of your training</h3>
              <p>
                Your journey starts at our Admission Office, where you register and get your ID. From there, you’ll master
                your skills in our Training Hall or join our Online Studio from anywhere in the world. Once your final
                exams are passed, you’ll walk away with a Certificate to show employers. But we don’t stop there—our Career
                Support team steps in to help you land your first job or freelance client, bridging the gap between the
                classroom and your career.
              </p>
              <WaLink text="I want to register at MAF Tech Academy" ghost={false}>Talk to the admission office</WaLink>
            </div>
            <ol className="svc-cycle">
              {SERVICES.map(([t, d], i) => (
                <li className="svc-node" key={t} style={{ "--i": i }}>
                  <div className="svc-circle">
                    <span className="svc-icon" aria-hidden="true">{SERVICE_ICONS[i]}</span>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                  <span className="svc-arrow" aria-hidden="true">
                    <svg viewBox="0 0 48 32" fill="currentColor">
                      <path d="M2 11h26V3a2 2 0 013.4-1.4l14 13a2 2 0 010 2.9l-14 13A2 2 0 0128 29v-8H2a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                    </svg>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* ===== Courses ===== */}
        <Section
          id="courses"
          title="Courses"
          sub="Practical courses you can take in class or online. Open a course to see what you will learn, the full syllabus and the fee. Combo deals save you up to ₦30,000."
        >
          <div className="cc-grid">
            {CATALOG.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>

          <p style={{ marginTop: 20 }}>
            <Link className="btn" href="/courses">
              Browse all courses
            </Link>
          </p>
          <div className="combo-grid">
  {COMBOS.map(([t, d, now, was]) => (
    <article className="combo-card" key={t}>
      <div className="combo-badge">Combo deal</div>
      <h3>{t}</h3>
      <p className="combo-desc">{d}</p>
      <div className="combo-price">
        <b>{naira(now)}</b>
        <s>{naira(was)}</s>
      </div>
      <div className="combo-save">You save {naira(was - now)}</div>
    </article>
  ))}
</div>
          <p className="sub" style={{ marginTop: 20 }}>
            Early bird: first 10 students who pay in full get ₦10,000 off. Bring a friend and you both get ₦5,000
            off.
          </p>
        </Section>

        {/* ===== More ways ===== */}
        <Section id="more" title="More ways to learn with us">
          <div className="more-list">
            {MORE.map(([t, d, text, label], i) => (
              <div className={"more-row" + (i % 2 === 1 ? " reverse" : "")} key={t}>
               <div className="more-img">
  {i === 0 && <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80" alt="Corporate training" />}
  {i === 1 && <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Online courses" />}
  {i === 2 && <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80" alt="Course + laptop" />}
</div>
                <div className="more-body">
                  <h3>{t}</h3>
                  <p>{d}</p>
                  {text ? (
                    <WaLink text={text}>{label}</WaLink>
                  ) : (
                    <a className="btn ghost" href="#courses">
                      {label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== Run your own academy (Pricing) ===== */}
        <Section
          id="schools"
          title="Run your own academy on MAFIANA"
          sub="Other computer schools can use our system to manage students, fees and certificates. Sample monthly pricing."
        >
          <div className="plans-grid">
            {/* Starter */}
            <article className="plan-card">
              <div className="plan-top">
                <div className="plan-icon starter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div>
                  <h3>Starter</h3>
                  <p className="plan-desc">Perfect for small schools and training centers.</p>
                </div>
              </div>
              <div className="plan-price">
                ₦20,000<span>/month</span>
              </div>
              <ul className="plan-features">
                <li>Up to 50 students</li>
                <li>Student login and attendance</li>
                <li>Certificates</li>
              </ul>
              <WaLink text="I want the Starter school plan" ghost>
                Choose Starter →
              </WaLink>
            </article>

            {/* Growth (Most Popular) */}
            <article className="plan-card popular">
              <div className="popular-badge">★ Most Popular</div>
              <div className="plan-top dark">
                <div className="plan-icon growth">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 17l6-6 4 4 8-8" />
                    <path d="M14 7h7v7" />
                  </svg>
                </div>
                <div>
                  <h3>Growth</h3>
                  <p className="plan-desc">Ideal for growing institutions.</p>
                </div>
              </div>
              <div className="plan-price">
                ₦50,000<span>/month</span>
              </div>
              <ul className="plan-features">
                <li>Up to 300 students</li>
                <li>Video lessons and quizzes</li>
                <li>Online payments</li>
              </ul>
              <WaLink text="I want the Growth school plan" ghost={false}>
                Choose Growth →
              </WaLink>
            </article>

            {/* Network */}
            <article className="plan-card">
              <div className="plan-top">
                <div className="plan-icon network">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="5" cy="19" r="2" />
                    <circle cx="19" cy="19" r="2" />
                    <path d="M12 7v4M12 11l-5 6M12 11l5 6" />
                  </svg>
                </div>
                <div>
                  <h3>Network</h3>
                  <p className="plan-desc">For large institutions and networks.</p>
                </div>
              </div>
              <div className="plan-price custom">Custom</div>
              <ul className="plan-features">
                <li>Many branches</li>
                <li>Your own branding</li>
                <li>Priority support</li>
              </ul>
              <WaLink text="I want to talk about the Network school plan" ghost>
                Talk to us →
              </WaLink>
            </article>
          </div>
        </Section>

        {/* ===== Reviews ===== */}
        <section id="reviews">
          <div className="rv-panel">
            <h2 style={{ textAlign: "center" }}>What our students say</h2>
            <p className="sub" style={{ textAlign: "center", margin: "10px auto 0" }}>
              Real results from people who finished a course.
            </p>
            <div className="rv">
              {REVIEWS.map(([q, name, course, photo]) => (
                <figure className="rv-card" key={name}>
                  <div className="rv-av">{photo ? <img src={photo} alt={name} /> : name[0]}</div>
                  <div className="rv-stars" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <figcaption>
                    <b>{name}</b>
                    <span className="rv-role">{course}</span>
                  </figcaption>
                  <blockquote>{q}</blockquote>
                </figure>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 36 }}>
              <a className="btn" href="#contact">
                Join the next class
              </a>
            </p>
          </div>
        </section>

        {/* ===== Blog ===== */}
        <Section id="blog" title="From the blog" sub="Short, practical guides to help you start and earn.">
          <div className="bl-grid">
            {posts.slice(0, 3).map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
          <p style={{ marginTop: 20 }}>
            <Link className="btn ghost" href="/blog">
              Read all articles
            </Link>
          </p>
        </Section>

        {/* ===== FAQ ===== */}
        <Section id="faq" title="Questions students ask">
          <div style={{ maxWidth: 720 }}>
            {FAQ.map(([q, a]) => (
              <details className="card" key={q}>
                <summary>{q}</summary>
                <p className="m">{a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* ===== Shop ===== */}
        <ShopSection products={shop} />

        {/* ===== Contact ===== */}
        <section id="contact">
          <h2>Enroll or ask a question</h2>
          <p className="sub">Fill this in and it opens WhatsApp with your message ready to send.</p>
          <EnrollForm />
        </section>
      </div>

      <Footer />
    </>
  );
}