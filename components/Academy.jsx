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
const DEPTS = [
  ["Computer Basics & Office", "Windows, Word, Excel, PowerPoint, typing."],
  ["Data Analytics", "Excel, SQL, Power BI, Python basics."],
  ["Graphic Design", "Canva, Photoshop, CorelDraw, logos."],
  ["Web Development", "HTML, CSS, JavaScript, WordPress."],
];
const SERVICES = [
  ["Admission office", "Register, pay your seat fee and get your ID card."],
  ["Training hall and computer lab", "Practise on a computer during every class."],
  ["Online class studio", "Live and recorded classes for students outside town."],
  ["Certificates and exams", "Final test and a certificate you can show employers."],
  ["Career support", "Guidance on jobs, freelancing and your first clients."],
];
const MORE = [
  ["Corporate training", "We train your staff in Office, data, design or web, at your office or in our lab. Tell us the team size and we send a quote.", "I want corporate training for my company", "Request a quote"],
  ["Online courses", "Learn from any city with live classes and recorded lessons at the online fee.", null, "See courses"],
  ["Course + laptop + accessories", "Join a course and take a laptop, mouse, flash drive and bag in one deal. Ask for today’s laptop prices.", "I want the course + laptop + accessories combo", "Ask about the combo"],
];
const PLANS = [
  ["Starter", "₦20,000", ["Up to 50 students", "Student login and attendance", "Certificates"], "I want the Starter school plan", "Choose Starter"],
  ["Growth", "₦50,000", ["Up to 300 students", "Video lessons and quizzes", "Online payments"], "I want the Growth school plan", "Choose Growth", true],
  ["Network", "Custom", ["Many branches", "Your own branding", "Priority support"], "I want to talk about the Network school plan", "Talk to us"],
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

const SHOP = [
  { name: "Wireless mouse", price: 7000, img: "/shop/mouse.jpeg", desc: "Quiet click, long battery" },
  { name: "Keyboard", price: 10000, img: "/shop/keyboard.jpeg", desc: "Full size, soft keys" },
  { name: "64GB flash drive", price: 10000, img: "/shop/flash.jpeg", desc: "USB 3.0, metal body" },
  { name: "Laptop charger", price: 15000, img: "/shop/charger.jpeg", desc: "Compatible with common models" },
  { name: "Laptop bag", price: 14000, img: "/shop/bag.jpeg", desc: "Padded, fits 15.6 inch" },
  { name: "Headphones", price: 9000, img: "/shop/headphones.jpeg", desc: "Over-ear, for class & calls" },
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
      wa(`Hello MAFIANA Tech Academy, my name is ${name}. I want to enroll for ${course}.${msg ? " " + msg : ""}`),
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

export default function App() {
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
        <Section
          id="about"
          title="About the academy"
          sub="MAFIANA Tech Academy teaches practical skills you can use for work the same month you learn them. Small classes, real projects and a certificate at the end."
        >
          <div className="grid">
            {ABOUT.map(([t, d]) => (
              <div className="card" key={t}>
                <h3>{t}</h3>
                <p className="m">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="departments"
          title="Departments and student services"
          sub="Four departments teach the courses. Five services support you from registration to your first job."
        >
          <div className="grid">
            {DEPTS.map(([t, d]) => (
              <div className="card" key={t}>
                <h3>{t}</h3>
                <p className="m">{d}</p>
              </div>
            ))}
          </div>
          <div className="grid" style={{ marginTop: 16 }}>
            {SERVICES.map(([t, d]) => (
              <div className="card alt" key={t}>
                <h3>{t}</h3>
                <p className="m">{d}</p>
              </div>
            ))}
          </div>
        </Section>

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

        <Section id="more" title="More ways to learn with us">
          <div className="grid">
            {MORE.map(([t, d, text, label]) => (
              <div className="card" key={t}>
                <h3>{t}</h3>
                <p className="m">{d}</p>
                {text ? (
                  <WaLink text={text}>{label}</WaLink>
                ) : (
                  <a className="btn ghost" href="#courses">
                    {label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="schools"
          title="Run your own academy on MAFIANA"
          sub="Other computer schools can use our system to manage students, fees and certificates. Sample monthly pricing."
        >
          <div className="grid">
            {PLANS.map(([t, price, items, text, label, best]) => (
              <div className={"card plan" + (best ? " best" : "")} key={t}>
                <h3>{t}</h3>
                <div className="price">
                  {price}
                  {price !== "Custom" && <span className="m">/month</span>}
                </div>
                <ul>
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <WaLink ghost={!best} text={text}>
                  {label}
                </WaLink>
              </div>
            ))}
          </div>
        </Section>

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

        <Section
          id="shop"
          title="Student shop"
          sub="Gadgets and accessories for class. Order on WhatsApp and pick up at the academy or arrange delivery."
        >
          <div className="shop-grid">
            {SHOP.map((item) => (
              <article className="shop-card" key={item.name}>
                <div className="shop-img">
                  <img
                    src={item.img}
                    alt={item.name}
                    width="400"
                    height="400"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.classList.add("shop-img-fallback");
                    }}
                  />
                </div>
                <div className="shop-body">
                  <h3>{item.name}</h3>
                  <p className="m">{item.desc}</p>
                  <div className="shop-foot">
                    <b>{naira(item.price)}</b>
                    <a
                      className="btn ghost sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={wa("Hello, I want to buy: " + item.name)}
                    >
                      Order
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

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