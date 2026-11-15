"use client";
import { useState } from "react";
import { naira } from "../../lib/courses";
import { REG_FEE } from "../../lib/catalog";
import { waHref } from "../../lib/wa";

export default function CourseFeeCard({ course: c }) {
  const [mode, setMode] = useState("online");
  const fee = c[mode];
  const inst = mode === "physical" ? c.installments : [];
  return (
    <aside className="fc card" aria-label="Fees and enrollment">
      <div className="seg" role="group" aria-label="Class type">
        {[["online", "Online"], ["physical", "Physical"]].map(([m, l]) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{l}</button>)}
      </div>
      <div className="fc-price" aria-live="polite">{naira(fee)}<span className="m"> course fee</span></div>
      <div className="fc-rows">
        <div><span>Registration (ID card, materials, certificate)</span><b>{naira(REG_FEE)}</b></div>
        <div><span>Total to start</span><b>{naira(fee + REG_FEE)}</b></div>
        <div><span>Payment</span><b>{inst.length ? inst.map(naira).join(" + ") : "Pay once"}</b></div>
      </div>
      <a className="btn fc-btn" target="_blank" rel="noopener noreferrer" href={waHref(`Hello MAF Tech Academy, I want to enroll for ${c.name} (${mode} class).`)}>Enroll on WhatsApp</a>
      <a className="btn ghost fc-btn" target="_blank" rel="noopener noreferrer" href={waHref(`Hello MAF Tech Academy, I have a question about ${c.name}.`)}>Ask a question</a>
      <ul className="fc-incl">
        <li>Certificate on completion</li><li>Academy ID card and learning materials</li><li>Access to your student portal with lessons and quizzes</li><li>Career support after the course</li>
      </ul>
    </aside>
  );
}
