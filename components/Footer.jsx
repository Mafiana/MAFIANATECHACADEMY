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
  // In the student portal: no WhatsApp button, and the academy name is written MAF Tech Academy.
  const brand = portal ? "MAF Tech Academy" : "MAFIANA Tech Academy";
  const wa = portal ? "" : process.env.NEXT_PUBLIC_WHATSAPP;
  const social = [
    ["Instagram", CONTACT.social.instagram],
    ["TikTok", CONTACT.social.tiktok],
    ["Facebook", CONTACT.social.facebook],
    ["WhatsApp", wa ? `https://wa.me/${wa}` : ""],
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
            {social.length > 0 && (
              <div className="sf-social">
                {social.map(([n, u]) => (
                  <a key={n} href={u} target="_blank" rel="noopener noreferrer">
                    {n}
                  </a>
                ))}
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
            {/* Student login removed as requested */}
            <Link href="/verify">Verify a certificate</Link>
            <Link href="/admin">Admin login</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms and Conditions</Link>
          </div>

          <div>
            <h4>Contact</h4>
            {/* Placeholders removed — only real values show */}
            {address && <p>{address}</p>}
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
            {!address && !phone && !email && !portal && <p>Message us on WhatsApp to enroll.</p>}
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
