"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HeroSlider from "./HeroSlider";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP || "234XXXXXXXXXX"; // set NEXT_PUBLIC_WHATSAPP in .env.local (no +, no spaces)
const REG = 5000;
const naira = (x) => "₦" + x.toLocaleString("en-NG");
const wa = (t) => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;

const COURSES = [
  { n: "Computer Basics + Microsoft Office", w: 4, p: 50000, o: 35000, i: [25000, 25000], d: "Windows, Word, Excel, PowerPoint, internet, typing" },
  { n: "Digital Literacy + Internet Skills", w: 2, p: 30000, o: 20000, i: [], d: "Email, Google, WhatsApp Business, online safety" },
  { n: "Data Analytics", w: 8, p: 150000, o: 100000, i: [50000, 50000, 50000], d: "Excel, SQL, Power BI, Python basics" },
  { n: "Digital Marketing", w: 6, p: 100000, o: 70000, i: [50000, 50000], d: "Facebook Ads, Instagram, TikTok, content creation" },
  { n: "Graphic Design", w: 6, p: 100000, o: 70000, i: [50000, 50000], d: "Canva, Photoshop, CorelDraw, logo design" },
  { n: "Web Development", w: 12, p: 200000, o: 150000, i: [70000, 65000, 65000], d: "HTML, CSS, JavaScript, WordPress" },
];
const COURSE_IMG = [
  ["/courses/computer-basics.svg", "Illustration of a computer showing Word and Excel with a keyboard and mouse"],
  ["/courses/digital-literacy.svg", "Illustration of a web browser, email, chat and online safety shield"],
  ["/courses/data-analytics.svg", "Illustration of a dashboard with bar, donut and line charts and an SQL query"],
  ["/courses/digital-marketing.svg", "Illustration of a social media post on a phone, a megaphone and a growth chart"],
  ["/courses/graphic-design.svg", "Illustration of a logo on a design canvas with colour swatches and a pen"],
  ["/courses/web-development.svg", "Illustration of code beside the web page it builds"],
];
const COMBOS = [
  ["Beginner Combo", "Computer Basics + Digital Literacy", 65000, 80000],
  ["Job Ready Combo", "Computer Basics + Data Analytics", 170000, 200000],
  ["Creator Combo", "Digital Marketing + Graphic Design", 170000, 200000],
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
  ["Digital Marketing", "Ads, social media, content creation."],
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
  ["Corporate training", "We train your staff in Office, data, marketing or design, at your office or in our lab. Tell us the team size and we send a quote.", "I want corporate training for my company", "Request a quote"],
  ["Online courses", "Learn from any city with live classes and recorded lessons at the online fee.", null, "Check online fees"],
  ["Course + laptop + accessories", "Join a course and take a laptop, mouse, flash drive and bag in one deal. Ask for today’s laptop prices.", "I want the course + laptop + accessories combo", "Ask about the combo"],
];
const PLANS = [
  ["Starter", "₦20,000", ["Up to 50 students", "Student login and attendance", "Certificates"], "I want the Starter school plan", "Choose Starter"],
  ["Growth", "₦50,000", ["Up to 300 students", "Video lessons and quizzes", "Online payments"], "I want the Growth school plan", "Choose Growth", true],
  ["Network", "Custom", ["Many branches", "Your own branding", "Priority support"], "I want to talk about the Network school plan", "Talk to us"],
];
const BLOG = [
  ["excel-skills-every-office-needs", "5 Excel skills every office needs", "Sorting, filters, formulas and pivot tables, explained for beginners."],
  ["get-first-freelance-client", "How to get your first freelance client", "Build a small portfolio, price your work and send your first proposal."],
  ["data-analyst-or-web-developer", "Data analyst or web developer: which first?", "What each job pays, what you learn, and how to choose."],
];
const FAQ = [
  ["Can I pay in installments?", "Yes. Pay half to book your seat and the balance before week 3. Digital Literacy is paid once."],
  ["Do I need my own laptop?", "Physical students can use our computer lab. Online students need a laptop. We sell accessories and can help you get one."],
  ["Is there a certificate?", "Yes. The ₦5,000 registration covers your ID card, certificate and materials."],
  ["Can I start with no experience?", "Yes. Computer Basics + Office is made for complete beginners."],
  ["Do you help with jobs?", "Yes. Career support covers job applications, freelancing and finding your first clients."],
];
// SAMPLE REVIEWS: replace with real student words before launch
const REVIEWS = [
  // [quote, name, course, photo]. Put real photos in /public/reviews/ and set the path, e.g. "/reviews/amina.jpg". null shows initials.
  ["I could not use Excel before. After four weeks I now do the monthly report at my office alone.", "Amina", "Computer Basics + Office", null],
  ["The installment plan helped me a lot. I finished Data Analytics and got an internship offer.", "Chidi", "Data Analytics", null],
  ["I now run ads for three shops in my area. The classes were practical from day one.", "Tolu", "Digital Marketing", null],
];
const SHOP = [["Wireless mouse", 7000], ["Keyboard", 10000], ["64GB flash drive", 10000], ["Laptop charger", 15000], ["Laptop bag", 14000], ["Headphones", 9000]];

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

function FeeChecker({ idx, setIdx, mode, setMode }) {
  const c = COURSES[idx];
  const fee = c[mode];
  const inst = mode === "p" ? c.i : [];
  return (
    <div className="pay" aria-live="polite">
      <h3>Check your fee</h3>
      <label htmlFor="course">Course</label>
      <select id="course" value={idx} onChange={(e) => setIdx(+e.target.value)}>
        {COURSES.map((x, k) => <option key={x.n} value={k}>{x.n}</option>)}
      </select>
      <label>Class type</label>
      <div className="seg">
        {[["p", "Physical"], ["o", "Online"]].map(([m, l]) => (
          <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>{l}</button>
        ))}
      </div>
      <div className="total">{naira(fee + REG)}</div>
      <div className="rows">
        <div><span>{c.n} ({c.w} weeks)</span><span>{naira(fee)}</span></div>
        <div><span>Registration</span><span>{naira(REG)}</span></div>
        <div><span>{inst.length ? "Installment" : "Payment"}</span><span>{inst.length ? inst.map(naira).join(" + ") : "Pay once"}</span></div>
      </div>
      <WaLink ghost={false} text={`Hello MAFIANA Tech Academy, I want to enroll for ${c.n} (${mode === "p" ? "physical" : "online"} class).`}>
        Book my seat on WhatsApp
      </WaLink>
    </div>
  );
}

function EnrollForm() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState(COURSES[0].n);
  const [msg, setMsg] = useState("");
  const submit = (e) => {
    e.preventDefault();
    window.open(wa(`Hello MAFIANA Tech Academy, my name is ${name}. I want to enroll for ${course}.${msg ? " " + msg : ""}`), "_blank");
  };
  return (
    <form className="card" style={{ maxWidth: 560 }} onSubmit={submit}>
      <label htmlFor="fn">Your name</label>
      <input id="fn" required value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="fc">Course</label>
      <select id="fc" value={course} onChange={(e) => setCourse(e.target.value)}>
        {COURSES.map((c) => <option key={c.n}>{c.n}</option>)}
      </select>
      <label htmlFor="fm">Message (optional)</label>
      <textarea id="fm" rows="3" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button className="btn" type="submit" style={{ marginTop: 14 }}>Send on WhatsApp</button>
    </form>
  );
}

export default function App() {
  const [idx, setIdx] = useState(2);
  const [mode, setMode] = useState("p");
  const pick = (k) => { setIdx(k); document.getElementById("fees").scrollIntoView({ behavior: "smooth", block: "center" }); };

  return (
    <>
      <Navbar />
      <HeroSlider>
        <h1>Learn. Build. Earn.</h1>
        <p>Computer, data, marketing, design and web development. Learn in class or online, then get a certificate and a job-ready portfolio.</p>
        <div className="hero-cta">
          <a className="btn" href="#courses">See all courses</a>
          <Link className="btn ghost-light" href="/portal">Preview student portal</Link>
        </div>
      </HeroSlider>
      <div className="wrap">
        <Section id="about" title="About the academy" sub="MAFIANA Tech Academy teaches practical skills you can use for work the same month you learn them. Small classes, real projects and a certificate at the end.">
          <div className="grid">{ABOUT.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="m">{d}</p></div>)}</div>
        </Section>

        <Section id="departments" title="Departments and student services" sub="Five departments teach the courses. Five services support you from registration to your first job.">
          <div className="grid">{DEPTS.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="m">{d}</p></div>)}</div>
          <div className="grid" style={{ marginTop: 16 }}>{SERVICES.map(([t, d]) => <div className="card alt" key={t}><h3>{t}</h3><p className="m">{d}</p></div>)}</div>
        </Section>

        <Section id="courses" title="Courses" sub="Pick a course to see its fee. Combo deals save you up to ₦30,000.">
          <div className="grid courses-grid">
            {COURSES.map((c, k) => (
              <article key={c.n} className="card course-card">
                <div className="course-img">
                  <img src={COURSE_IMG[k][0]} alt={COURSE_IMG[k][1]} width="800" height="500" loading="lazy" />
                  <span className="tag-float">{c.w} weeks</span>
                </div>
                <div className="course-body">
                  <h3>{c.n}</h3>
                  <p className="m">{c.d}</p>
                  <div className="course-price"><b>{naira(c.o)}</b><span className="m"> online</span><span className="m"> · {naira(c.p)} physical</span></div>
                  <button className="btn ghost course-btn" onClick={() => pick(k)}>Check fee</button>
                </div>
              </article>
            ))}
          </div>
          <div className="grid" style={{ marginTop: 16 }}>
            {COMBOS.map(([t, d, now, was]) => (
              <div className="card" key={t}><h3>{t}</h3><div className="m">{d}</div><b>{naira(now)}</b> <s className="m">{naira(was)}</s></div>
            ))}
          </div>
          <p className="sub" style={{ marginTop: 20 }}>Early bird: first 10 students who pay in full get ₦10,000 off. Bring a friend and you both get ₦5,000 off.</p>
        </Section>

        <section id="fees" className="fees">
          <div className="fees-text">
            <h2>Check your fee</h2>
            <p className="sub">Choose a course and class type. You see the full cost, the installment plan and can book your seat on WhatsApp.</p>
          </div>
          <FeeChecker idx={idx} setIdx={setIdx} mode={mode} setMode={setMode} />
        </section>

        <Section id="more" title="More ways to learn with us">
          <div className="grid">
            {MORE.map(([t, d, text, label]) => (
              <div className="card" key={t}><h3>{t}</h3><p className="m">{d}</p>
                {text ? <WaLink text={text}>{label}</WaLink> : <a className="btn ghost" href="#fees">{label}</a>}
              </div>
            ))}
          </div>
        </Section>


        <Section id="schools" title="Run your own academy on MAFIANA" sub="Other computer schools can use our system to manage students, fees and certificates. Sample monthly pricing.">
          <div className="grid">
            {PLANS.map(([t, price, items, text, label, best]) => (
              <div className={"card plan" + (best ? " best" : "")} key={t}>
                <h3>{t}</h3>
                <div className="price">{price}{price !== "Custom" && <span className="m">/month</span>}</div>
                <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
                <WaLink ghost={!best} text={text}>{label}</WaLink>
              </div>
            ))}
          </div>
        </Section>

        <section id="reviews">
          <div className="rv-panel">
            <h2 style={{ textAlign: "center" }}>What our students say</h2>
            <p className="sub" style={{ textAlign: "center", margin: "10px auto 0" }}>Real results from people who finished a course.</p>
            <div className="rv">
              {REVIEWS.map(([q, name, course, photo]) => (
                <figure className="rv-card" key={name}>
                  <div className="rv-av">{photo ? <img src={photo} alt={name} /> : name[0]}</div>
                  <div className="rv-stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <figcaption><b>{name}</b><span className="rv-role">{course}</span></figcaption>
                  <blockquote>{q}</blockquote>
                </figure>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 36 }}><a className="btn" href="#contact">Join the next class</a></p>
          </div>
        </section>

        <Section id="blog" title="From the blog" sub="Short guides to help you start and earn.">
          <div className="grid">{BLOG.map(([slug, t, d]) => <Link className="card" style={{ textDecoration: "none" }} href={`/blog/${slug}`} key={slug}><h3>{t}</h3><p className="m">{d}</p></Link>)}
          </div>
          <p style={{ marginTop: 16 }}><Link className="btn ghost" href="/blog">All posts</Link></p>
          <div hidden></div>
        </Section>

        <Section id="faq" title="Questions students ask">
          <div style={{ maxWidth: 720 }}>
            {FAQ.map(([q, a]) => <details className="card" key={q}><summary>{q}</summary><p className="m">{a}</p></details>)}
          </div>
        </Section>

        <Section id="shop" title="Student shop" sub="Everything you need for class, bought at the academy. Add a mouse and flash drive to your fee for ₦7,000.">
          <div className="grid">
            {SHOP.map(([n, p]) => (
              <div className="card" key={n}><h3>{n}</h3><b style={{ fontSize: 22 }}>{naira(p)}</b><br />
                <a className="btn ghost" style={{ marginTop: 12 }} target="_blank" rel="noopener noreferrer" href={wa("Hello, I want to buy: " + n)}>Order on WhatsApp</a>
              </div>
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
