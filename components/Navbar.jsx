"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { createClient } from "../lib/supabase/client";
import { signOut } from "../app/auth-actions";

const LINKS = [
  ["About", "/#about", true],
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

function useViewer() {
  const [v, setV] = useState({ ready: false, user: null });
  useEffect(() => {
    let off = false;
    let sub;
    try {
      const sb = createClient();
      const load = async () => {
        const { data: { user } } = await sb.auth.getUser();
        if (!user) return !off && setV({ ready: true, user: null });
        let { data: p, error } = await sb.from("profiles").select("full_name,role,avatar_url").eq("id", user.id).maybeSingle();
        if (error) ({ data: p } = await sb.from("profiles").select("full_name,role").eq("id", user.id).maybeSingle());
        if (off) return;
        const staff = p?.role === "admin" || p?.role === "instructor";
        setV({
          ready: true,
          user: {
            name: p?.full_name || user.email?.split("@")[0] || "Student",
            avatar: p?.avatar_url || "",
            href: staff ? "/admin" : "/portal",
            role: p?.role || "student",
          },
        });
      };
      load().catch(() => !off && setV({ ready: true, user: null }));
      sub = sb.auth.onAuthStateChange(() => load().catch(() => {})).data.subscription;
    } catch {
      setV({ ready: true, user: null });
    }
    return () => {
      off = true;
      sub?.unsubscribe();
    };
  }, []);
  return v;
}

function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const pathname = usePathname() || "";

  // CRITICAL: when already on /portal/*, only show Log out
  const inPortal = pathname.startsWith("/portal");
  const staff = user.role === "admin" || user.role === "instructor" || user.href === "/admin";

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="nav-menu" ref={box}>
      <button
        type="button"
        className="nav-user"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen(!open)}
      >
        <span className="av-wrap">
          <Avatar name={user.name} src={user.avatar} size={40} />
          <i className="av-dot" aria-hidden="true" />
        </span>
        <span className="nm">{user.name}</span>
        <svg className={"chev" + (open ? " up" : "")} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="nav-drop" role="menu">
          {!inPortal && (
            <Link href={user.href} role="menuitem" onClick={() => setOpen(false)}>
              {staff ? "Admin panel" : "My dashboard"}
            </Link>
          )}
          <form action={signOut}>
            <button type="submit" role="menuitem" className="out">
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { ready, user } = useViewer();
  const pathname = usePathname() || "";
  const inPortal = pathname.startsWith("/portal");

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
          {!ready ? (
            <span className="nav-slot" aria-hidden="true" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <Link className="btn ghost nav-login" href="/login" aria-label="Login">
              <UserIcon />
              Login
            </Link>
          )}
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
          {ready && user ? (
            inPortal ? (
              <form action={signOut}>
                <button type="submit" className="mob-user out" onClick={close}>
                  <span className="av-wrap">
                    <Avatar name={user.name} src={user.avatar} size={32} />
                    <i className="av-dot" aria-hidden="true" />
                  </span>
                  Log out
                </button>
              </form>
            ) : (
              <Link href={user.href} onClick={close} className="mob-user">
                <span className="av-wrap">
                  <Avatar name={user.name} src={user.avatar} size={32} />
                  <i className="av-dot" aria-hidden="true" />
                </span>
                {user.name}
              </Link>
            )
          ) : (
            <Link href="/login" onClick={close} className="mob-login">
              <UserIcon />
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
