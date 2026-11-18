"use client";
import { useEffect, useState, useTransition } from "react";
import { loveAction } from "../../app/blog/actions";

function Heart({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export default function LoveButton({ slug, initial = 0 }) {
  const key = "loved:" + slug;
  const [count, setCount] = useState(initial);
  const [loved, setLoved] = useState(false);
  const [pop, setPop] = useState(false);
  const [, start] = useTransition();

  useEffect(() => {
    try {
      setLoved(localStorage.getItem(key) === "1");
    } catch {}
  }, [key]);

  const toggle = () => {
    const next = !loved;
    setLoved(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    if (next) { setPop(true); setTimeout(() => setPop(false), 450); }
    try {
      next ? localStorage.setItem(key, "1") : localStorage.removeItem(key);
    } catch {}
    start(async () => {
      const r = await loveAction(slug, next ? 1 : -1);
      if (r?.ok) setCount(r.count);
    });
  };

  return (
    <div className="bl-love-row">
      <button type="button" className={"bl-love" + (loved ? " on" : "") + (pop ? " pop" : "")} aria-pressed={loved} onClick={toggle}>
        <Heart filled={loved} />
        <span>{loved ? "You loved this" : "Love this post"}</span>
        <b>{count}</b>
      </button>
    </div>
  );
}
