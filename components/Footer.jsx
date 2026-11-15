import Link from "next/link";
import { CONTACT } from "../lib/legal";

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" aria-hidden="true" style={{ marginRight: 8, flex: "none" }}>
      <rect width="30" height="30" rx="8" fill="#F2B705" />
      <path d="M6 22V8l9 9 9-9v14" fill="none" stroke="#102019" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP;
  const social = [
    ["Instagram", CONTACT.social.instagram],
    ["TikTok", CONTACT.social.tiktok],
    ["Facebook", CONTACT.social.facebook],
    ["WhatsApp", wa ? `https://wa.me/${wa}` : ""],
  ].filter(([, u]) => u);

  return (
    <footer className="sf">
      <div className="wrap">
        <div className="sf-cta">
          <div><h3>Ready to start learning?</h3><p>Book your seat today and pay small small.</p></div>
          <Link className="btn" href="/#contact">Enroll now</Link>
        </div>
        <div className="sf-grid">
          <div>
            <Link className="logo sf-logo" href="/"><Mark />MAFIANA Tech Academy</Link>
            <p>Practical computer, data, design and web development training. Learn in class or online and graduate with a certificate.</p>
            {social.length > 0 && (
              <div className="sf-social">
                {social.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}
              </div>
            )}
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/#about">About</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#shop">Shop</Link>
            <Link href="/#faq">FAQ</Link>
          </div>
          <div>
            <h4>Students</h4>
            <Link href="/verify">Verify a certificate</Link>
            <Link href="/#contact">Enroll</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms and Conditions</Link>
          </div>
          <div>
            <h4>Contact</h4>
            {CONTACT.email && <p>{CONTACT.email}</p>}
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
        <div className="sf-bottom">
          <span>© {new Date().getFullYear()} MAFIANA Tech Academy. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}