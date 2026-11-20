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

export default function Footer({ portal = false }) {
  const brand = "MAF Tech Academy";
  const social = [
    ["Instagram", CONTACT.social.instagram],
    ["TikTok", CONTACT.social.tiktok],
    ["Facebook", CONTACT.social.facebook],
  ].filter(([, u]) => u);

  // Only show real contact lines (skip placeholders)
  const address = CONTACT.address && !/add your address/i.test(CONTACT.address) ? CONTACT.address : null;
  const phone = CONTACT.phone && !/add your phone/i.test(CONTACT.phone) ? CONTACT.phone : null;
  const email = CONTACT.email && !/your-domain|example\.com/i.test(CONTACT.email) ? CONTACT.email : null;

  return (
    <footer className="sf">
      <div className="wrap">
        <div className="sf-cta">
          <div>
            <h3>Ready to start learning?</h3>
            <p>Book your seat today and pay small small.</p>
          </div>
          <Link className="btn" href="/#contact">
            Enroll now
          </Link>
        </div>

        <div className="sf-grid">
          <div>
            <Link className="logo sf-logo" href="/">
              <Mark />
              {brand}
            </Link>
            <p>
              Practical computer, data, design and web development training. Learn in class or online and graduate with a
              certificate.
            </p>
           <div className="sf-social">
  {social.map(([n, u]) => (
    <a key={n} href={u} target="_blank" rel="noopener noreferrer">
      {n}
    </a>
  ))}
  <a href="https://x.com/stanlee12242" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  </a>
  <a href="https://www.linkedin.com/in/mafiana-stanley-403773223/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  </a>
</div>
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
            {/* Student login removed as requested */}
            <Link href="/verify">Verify a certificate</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms and Conditions</Link>
          </div>

          <div>
            <h4>Contact</h4>
            {/* Placeholders removed — only real values show */}
            {address && <p>{address}</p>}
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
            {!address && !phone && !email && !portal && <p>Use the enroll form to reach us.</p>}
          </div>
        </div>

        <div className="sf-bottom">
          <span>© {new Date().getFullYear()} {brand}. All rights reserved.</span>
          {/* Registration fee line removed as requested */}
        </div>
      </div>
    </footer>
  );
}
