"use client";
import { useState } from "react";
import { prettyDate } from "../../lib/dates";
import { CopyModal } from "../Modal";

// Shows a freshly issued Access PIN. The PIN is also saved on the student profile.
export default function PinCard({ card }) {
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(card.pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setManual(true);
    }
  };
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="pin-slip" role="region" aria-label={`Access PIN for ${card.name}`}>
      <div className="pin-slip-head">
        <b>MAF Tech Academy</b>
        <span>Access slip</span>
      </div>
      <div className="pin-slip-name">{card.name}</div>
      <div className="pin-slip-meta">
        {card.code && (
          <span>
            Student ID <b>{card.code}</b>
          </span>
        )}
        {card.plan && (
          <span>
            Plan <b>{card.plan}</b>
          </span>
        )}
        {card.until ? (
          <span>
            Valid until <b>{prettyDate(card.until)}</b>
          </span>
        ) : (
          <span>
            <b>Staff access</b>
          </span>
        )}
      </div>
      <div className="pin-slip-label">Your Access PIN</div>
      <div className="pin-slip-pin" aria-live="polite">
        {card.pin}
      </div>
      <p className="pin-slip-how">
        Sign in at <b>{site || "our website"}/login</b> and type this PIN. The student can also see it on their Profile
        page.
      </p>
      <div className="pin-slip-actions no-print">
        <button type="button" className="btn sm" onClick={copy}>
          {copied ? "Copied" : "Copy PIN"}
        </button>
        <button type="button" className="btn ghost sm" onClick={() => window.print()}>
          Print slip
        </button>
      </div>
      <p className="pin-slip-warn no-print">This PIN is saved on the student profile. Use “New PIN” only if it must be replaced.</p>
      <CopyModal open={manual} title="Copy this PIN" text={card.pin} onClose={() => setManual(false)} />
    </div>
  );
}
