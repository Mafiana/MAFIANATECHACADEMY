"use client";
import { useEffect, useState } from "react";

// A thin bar at the top of the screen that fills as you read down the article.
export default function ReadingProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = document.querySelector(".bl-article");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setW(Math.min(100, Math.max(0, (-r.top / Math.max(total, 1)) * 100)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return <div className="bl-progress" role="progressbar" aria-label="Reading progress" aria-valuenow={Math.round(w)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: w + "%" }} /></div>;
}
