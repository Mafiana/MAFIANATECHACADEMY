"use client";
import { useEffect, useState } from "react";

const SLIDES = ["/hero/1.svg", "/hero/2.svg", "/hero/3.svg", "/hero/4.svg"];
const EVERY = 5500; // ms between slides

export default function HeroSlider({ children }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), EVERY);
    return () => clearInterval(t);
  }, [i]);

  return (
    <header className="hero2" id="top">
      <div className="hero2-slides" aria-hidden="true">
        {SLIDES.map((src, k) => (
          <img key={src} src={src} alt="" className={"hero2-slide" + (k === i ? " on" : "")} fetchPriority={k === 0 ? "high" : "low"} />
        ))}
      </div>
      <div className="hero2-shade" aria-hidden="true" />
      <div className="hero2-content">{children}</div>
      <div className="hero2-dots" role="tablist" aria-label="Hero images">
        {SLIDES.map((_, k) => (
          <button key={k} role="tab" aria-selected={k === i} aria-label={`Show image ${k + 1}`} className={k === i ? "on" : ""} onClick={() => setI(k)} />
        ))}
      </div>
    </header>
  );
}
