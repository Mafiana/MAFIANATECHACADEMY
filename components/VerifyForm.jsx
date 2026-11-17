"use client";
import { useState } from "react";

const DEMO = {
  "MTA-00001": {
    name: "Amina Yusuf",
    course: "Computer Basics + Microsoft Office",
    mode: "Physical",
    issued: "12 October 2026",
    status: "valid",
  },
  "MTA-00002": {
    name: "Chidi Okeke",
    course: "Data Analytics",
    mode: "Online",
    issued: "3 November 2026",
    status: "valid",
  },
  "MTA-00003": {
    name: "Tolu Adeyemi",
    course: "Graphic Design",
    mode: "Physical",
    issued: "20 September 2026",
    status: "revoked",
  },
};

export default function VerifyForm() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    const key = code.trim().toUpperCase().replace(/\s+/g, "");
    setBusy(true);
    setSearched(true);
    // Small delay so the UI feels intentional
    setTimeout(() => {
      setResult(DEMO[key] || null);
      setBusy(false);
    }, 350);
  }

  return (
    <div className="vf-wrap">
      <form className="vf-card" onSubmit={submit}>
        <div className="vf-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3l7 3v5c0 4.5-2.8 7.8-7 9-4.2-1.2-7-4.5-7-9V6l7-3z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="vf-title">Enter certificate number</h2>
        <p className="vf-help">
          Find the code at the bottom of the printed certificate. Example: <code>MTA-00001</code>
        </p>

        <label className="vf-label" htmlFor="cert">
          Certificate number
        </label>
        <div className="vf-row">
          <input
            id="cert"
            className="vf-input"
            required
            placeholder="MTA-00001"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button className="btn vf-btn" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Verify"}
          </button>
        </div>

        <p className="vf-demos">
          Demo codes for testing:{" "}
          {["MTA-00001", "MTA-00002", "MTA-00003"].map((c) => (
            <button key={c} type="button" className="vf-chip" onClick={() => setCode(c)}>
              {c}
            </button>
          ))}
        </p>
      </form>

      {searched && !result && !busy && (
        <div className="vf-result vf-result-bad" role="alert">
          <div className="vf-result-head">
            <span className="vf-status bad">Not found</span>
          </div>
          <p>
            No certificate matches <b>{code.trim().toUpperCase() || "that number"}</b>. Check the spelling and try
            again, or contact the academy if you believe this is an error.
          </p>
        </div>
      )}

      {result && !busy && (
        <div className={"vf-result " + (result.status === "valid" ? "vf-result-ok" : "vf-result-bad")} role="status">
          <div className="vf-result-head">
            <div>
              <p className="vf-eyebrow">Verification result</p>
              <h3>Certificate details</h3>
            </div>
            <span className={"vf-status " + (result.status === "valid" ? "ok" : "bad")}>
              {result.status === "valid" ? "Valid" : "Revoked"}
            </span>
          </div>

          <div className="vf-grid">
            <div className="vf-field">
              <span>Student name</span>
              <b>{result.name}</b>
            </div>
            <div className="vf-field">
              <span>Course</span>
              <b>{result.course}</b>
            </div>
            <div className="vf-field">
              <span>Class type</span>
              <b>{result.mode}</b>
            </div>
            <div className="vf-field">
              <span>Date issued</span>
              <b>{result.issued}</b>
            </div>
          </div>

          {result.status === "valid" ? (
            <p className="vf-note ok">
              This certificate was issued by MAF Tech Academy and is currently valid.
            </p>
          ) : (
            <p className="vf-note bad">
              This certificate has been revoked and should not be accepted as proof of completion.
            </p>
          )}
        </div>
      )}
    </div>
  );
}