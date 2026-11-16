"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// third value true = shown only in the mobile menu
const LINKS = [
  ["About", "/#about", true],
  // Courses removed from navbar as requested
  ["Blog", "/blog"],
  ["Shop", "/#shop"],
  ["Contact", "/#contact"],
];

function Mark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <rect width="30" height="30" rx="8" fill="#F2B705" />
      <path
        d="M6 22V8l9 9 9-9v14"
        fill="none"
        stroke="#102019"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="topbar">
      <div className="wrap bar">
        <Link className="logo" href="/" onClick={close}>
          <Mark />
          {/* Text hidden on mobile via CSS */}
          <span className="logo-text">
            MAF<span className="lg-long">&nbsp;Tech Academy</span>
          </span>
        </Link>

        <div className="navlinks" role="navigation" aria-label="Main">
          {LINKS.filter((x) => !x[2]).map(([l, h]) => (
            <Link key={l} href={h}>
              {l}
            </Link>
          ))}
        </div>

        <div className="navcta">
          {/* Enroll button removed as requested */}
          <Link className="btn ghost nav-login" href="/login" aria-label="Login">
            <UserIcon />
            Login
          </Link>
        </div>

        <button
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobmenu"
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {open ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobmenu" className="mobmenu wrap" role="navigation" aria-label="Mobile">
          {LINKS.map(([l, h]) => (
            <Link key={l} href={h} onClick={close}>
              {l}
            </Link>
          ))}
          <Link href="/login" onClick={close} className="mob-login">
            <UserIcon />
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
