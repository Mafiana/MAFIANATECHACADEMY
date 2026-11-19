"use client";
import { useState } from "react";

export default function CopyButton({ text, label = "Copy", className = "btn ghost sm" }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    }
  };

  return (
    <button type="button" className={className} onClick={copy}>
      {done ? "Copied" : label}
    </button>
  );
}