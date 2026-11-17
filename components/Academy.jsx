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
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/",
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
        {/* ===== About the academy ===== */}
        <Section
          id="about"
          title="About the academy"
          sub="MAF Tech Academy teaches practical skills you can use for work the same month you learn them. Small classes, real projects and a certificate at the end."
        >
          <div className="about-grid">
            {ABOUT.map(([t, d], i) => (
              <article className="about-card" key={t} style={{ "--i": i }}>
                <div className="about-icon" aria-hidden="true">
                  {i === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4L7.5 17l.9-5L4.8 8.2l5-.7L12 3z" />
                      <path d="M12 14v7M8 21h8" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="18" height="12" rx="2" />
                      <path d="M8 20h8M12 16v4" />
                      <circle cx="8.5" cy="10" r="1.2" fill="currentColor" />
                      <circle cx="15.5" cy="10" r="1.2" fill="currentColor" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  )}
                  {i === 3 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M7 9h10M7 13h6" />
                      <circle cx="17" cy="13" r="1.5" fill="currentColor" />
                    </svg>
                  )}
                </div>
                <h3>{t}</h3>
                <p className="m">{d}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ===== Student services ===== */}
        <Section
          id="services"
          title="Student services"
          sub="Five services support you from registration to your first job."
        >
          <div className="svc-block">
            <div className="svc-grid">
              {SERVICES.map(([t, d], i) => (
                <article className="svc-card" key={t} style={{ "--i": i }}>
                  <div className="svc-visual">
                    <div className="svc-icon" aria-hidden="true">
                      {i === 0 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                          <rect x="9" y="3" width="6" height="4" rx="1" />
                          <path d="M9 12h6M9 16h4" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <rect x="3" y="4" width="18" height="12" rx="2" />
                          <path d="M8 20h8M12 16v4" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <circle cx="12" cy="12" r="2" />
                          <path d="M16.24 7.76a6 6 0 010 8.49M7.76 7.76a6 6 0 000 8.49M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
                        </svg>
                      )}
                      {i === 3 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M12 3l9 5-9 5-9-5 9-5z" />
                          <path d="M3 13v5l9 5 9-5v-5" />
                          <path d="M12 13v10" />
                        </svg>
                      )}
                      {i === 4 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M5 19l4-8 4 4 6-10" />
                          <path d="M13 5h6v6" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="svc-body">
                    <h3>{t}</h3>
                    <p className="m">{d}</p>
                  </div>
                </article>
              ))}
            </div>
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
          <div className="grid" style={{ marginTop: 28 }}>
            {COMBOS.map(([t, d, now, was]) => (
              <div className="card" key={t}>
                <h3>{t}</h3>
                <div className="m">{d}</div>
                <b>{naira(now)}</b> <s className="m">{naira(was)}</s>
              </div>
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
                <div className="more-img" aria-hidden="true">
                  {i === 0 && (
                    <svg className="more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg className="more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="4" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 18v3" />
                      <circle cx="12" cy="11" r="2.5" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg className="more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="3" y="4" width="14" height="12" rx="1.5" />
                      <path d="M7 20h6M10 16v4" />
                      <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                    </svg>
                  )}
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

        {/* ===== Meet the team ===== */}
        <Section id="team" title="Meet the team" sub="The people who teach and support you at MAF Tech Academy.">
          <div className="team-grid">
            {TEAM.map((m) => (
              <article className="team-card" key={m.name}>
                <div className="team-avatar" aria-hidden="true">{m.initials}</div>
                <h3>{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <div className="team-social">
                  <a href={m.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on Twitter`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  </a>
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </article>
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