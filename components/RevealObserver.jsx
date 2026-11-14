"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Fades elements in as they scroll into view. Elements already on screen are left alone,
// so nothing flashes. Does nothing when the visitor prefers reduced motion.
const TARGETS = [
  "main section > h2", "main section > .sub", ".fees-text", ".fees > .pay",
  ".grid > *", ".rv-panel", ".rv-card", "details.card", ".portal", ".card.form",
  ".prose > *", ".sf-cta",
].join(",");

export default function RevealObserver() {
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    const seen = new Set();
    document.querySelectorAll(TARGETS).forEach((el) => {
      if (seen.has(el) || el.closest(".topbar")) return;
      seen.add(el);
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) return; // already visible, skip
      const kids = el.parentElement ? Array.from(el.parentElement.children) : [];
      el.style.setProperty("--d", `${Math.min(kids.indexOf(el), 5) * 80}ms`);
      el.classList.add("reveal");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);

  return null;
}
