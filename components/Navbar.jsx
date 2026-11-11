"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// third value true = shown only in the mobile menu
const LINKS = [
  ["About", "/#about", true],
  ["Courses", "/#courses", true],
  ["Blog", "/blog"],
  ["Shop", "/#shop"],
  ["Contact", "/#contact"],
];

function Mark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <rect width="30" height="30" rx="8" fill="#F2B705" />
      <path d="M6 22V8l9 9 9-9v14" fill="none" stroke="#102019" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
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
          <Mark />MAFIANA<span className="lg-long">&nbsp;Tech Academy</span>
        </Link>
        <div className="navlinks" role="navigation" aria-label="Main">
          {LINKS.filter((x) => !x[2]).map(([l, h]) => <Link key={l} href={h}>{l}</Link>)}
        </div>
        <div className="navcta">
          <Link className="btn ghost" href="/login">Login</Link>
          <Link className="btn" href="/#contact">Enroll</Link>
        </div>
        <button className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobmenu" onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {open
              ? <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </div>
      {open && (
        <div id="mobmenu" className="mobmenu wrap" role="navigation" aria-label="Mobile">
          {LINKS.map(([l, h]) => <Link key={l} href={h} onClick={close}>{l}</Link>)}
          <Link href="/login" onClick={close}>Login</Link>
          <Link className="btn" href="/#contact" onClick={close}>Enroll</Link>
        </div>
      )}
    </header>
  );
}
