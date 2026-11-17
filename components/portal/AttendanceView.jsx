"use client";
import { useMemo, useState } from "react";
import "./attendance.css";

const I = ({ children, size = 22, sw = 1.9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const CalIcon = (p) => <I {...p}><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="M8 14h2M14 14h2M8 17.5h2" /></I>;
const CalCheck = (p) => <I {...p}><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="m9 15.5 2 2 4-4" /></I>;
const Check = (p) => <I {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></I>;
const XIcon = (p) => <I {...p}><path d="M6 6l12 12M18 6 6 18" /></I>;
const UserX = (p) => <I {...p}><circle cx="10" cy="8" r="4" /><path d="M3 21c0-3.6 3.1-6 7-6 1.4 0 2.7.3 3.8.9" /><path d="m17 15 4 4M21 15l-4 4" /></I>;
const Bars = (p) => <I {...p}><path d="M5 20V11M12 20V5M19 20v-7" /></I>;
const Alert = (p) => <I {...p}><path d="M12 3.5 2.8 19.5h18.4z" /><path d="M12 10v4.5M12 17.2h.01" /></I>;
const Left = (p) => <I {...p}><path d="m14.5 6-6 6 6 6" /></I>;
const Right = (p) => <I {...p}><path d="m9.5 6 6 6-6 6" /></I>;

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ym = (d) => d.slice(0, 7);
const monthLabel = (key) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
};

// records: [{ id, date: "YYYY-MM-DD", present: boolean, label: "Tuesday 17 Nov" }]
export default function AttendanceView({ pct, present, absent, total, records, error }) {
  // Every month from the first class to the last, so the arrows step through them one by one.
  const months = useMemo(() => {
    if (!records.length) return [];
    const keys = records.map((r) => ym(r.date)).sort();
    const [y0, m0] = keys[0].split("-").map(Number);
    const [y1, m1] = keys[keys.length - 1].split("-").map(Number);
    const out = [];
    for (let y = y0, m = m0; y < y1 || (y === y1 && m <= m1); m === 12 ? (y++, (m = 1)) : m++) out.push(`${y}-${String(m).padStart(2, "0")}`);
    return out;
  }, [records]);
  const [i, setI] = useState(Math.max(0, months.length - 1));
  const key = months[i];

  const view = useMemo(() => {
    if (!key) return null;
    const [y, m] = key.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const rows = records.filter((r) => ym(r.date) === key);
    const state = {};
    rows.forEach((r) => {
      const d = Number(r.date.slice(8, 10));
      state[d] = state[d] === "bad" || !r.present ? "bad" : "ok"; // a day with any missed class shows as absent
    });
    return { first, days, state, rows };
  }, [key, records]);

  return (
    <div className="at">
      <header className="at-head">
        <span className="at-tile"><CalIcon size={30} /></span>
        <div>
          <h1>Attendance</h1>
          <p>Every class your instructor has marked.</p>
        </div>
      </header>

      {error && <div className="at-alert" role="alert"><Alert size={20} /> Some information could not be loaded. Please refresh the page.</div>}

      <div className="at-stats">
        <div className="at-stat s1"><span className="at-ico g"><CalCheck /></span><div><span className="at-lbl">Attendance</span><strong>{total ? pct + "%" : "–"}</strong></div></div>
        <div className="at-stat s2"><span className="at-ico ok"><Check /></span><div><span className="at-lbl">Present</span><strong>{present}</strong></div></div>
        <div className="at-stat s3"><span className="at-ico bad"><UserX /></span><div><span className="at-lbl">Absent</span><strong>{absent}</strong></div></div>
      </div>

      <section className="at-card">
        <h2 className="at-h"><Bars size={20} /> Your Progress</h2>
        <div className="at-prog">
          <div className="at-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Attendance"><i style={{ width: pct + "%" }} /></div>
          <span className="at-pct">{total ? pct + "%" : "–"}</span>
        </div>
        {total > 0 && pct < 75 && (
          <p className="at-alert"><Alert size={22} /> Your attendance is below 75%. Try not to miss more classes so you can finish and get your certificate.</p>
        )}
      </section>

      {!total && <section className="at-card"><p className="at-empty">No attendance recorded yet. It appears here after your first class.</p></section>}

      {view && (
        <section className="at-card">
          <h2 className="at-h"><CalIcon size={22} /> {monthLabel(key)}</h2>
          <div className="at-month">
            <div className="at-cal">
              <div className="at-calhead">
                <button type="button" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Previous month"><Left size={20} /></button>
                <b>{monthLabel(key)}</b>
                <button type="button" onClick={() => setI(i + 1)} disabled={i === months.length - 1} aria-label="Next month"><Right size={20} /></button>
              </div>
              <div className="at-week">{WEEK.map((w) => <span key={w}>{w}</span>)}</div>
              <div className="at-grid">
                {Array.from({ length: view.first }, (_, k) => <span key={"b" + k} />)}
                {Array.from({ length: view.days }, (_, k) => {
                  const d = k + 1, s = view.state[d];
                  return (
                    <span key={d} className="at-cell">
                      {s ? (
                        <span className={"at-mark " + s} role="img" aria-label={`${d} ${monthLabel(key)}: ${s === "ok" ? "present" : "absent"}`}>
                          {s === "ok" ? <Check size={18} sw={2.6} /> : d}
                        </span>
                      ) : d}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="at-list">
              {!view.rows.length && <p className="at-empty">No classes marked this month.</p>}
              {view.rows.map((r) => (
                <div className="at-row" key={r.id}>
                  <span>{r.label}</span>
                  <span className={"at-badge " + (r.present ? "ok" : "bad")}>{r.present ? <Check size={16} sw={2.6} /> : <XIcon size={16} sw={2.6} />}{r.present ? "Present" : "Absent"}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
