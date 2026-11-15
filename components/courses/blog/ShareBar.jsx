"use client";
import { useState } from "react";

export default function ShareBar({ title }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? window.location.href : "");
  const copy = async () => {
    try { await navigator.clipboard.writeText(url()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { window.prompt("Copy this link:", url()); }
  };
  return (
    <div className="bl-share" role="group" aria-label="Share this article">
      <span className="m">Share</span>
      <a className="btn ghost sm" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(title)}`} onClick={(e) => { e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(title + " " + url())}`; }}>WhatsApp</a>
      <button type="button" className="btn ghost sm" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
    </div>
  );
}
