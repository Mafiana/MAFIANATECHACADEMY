"use client";
import { useState } from "react";
import ActionForm from "./ActionForm";
import { COURSE_NAMES, COURSE_FEES, COURSE_WEEKS } from "../../lib/courses";
import { lagosToday, addMonths, prettyDate } from "../../lib/dates";
import { addStudent } from "../../app/admin/actions";

const MONTHS = [[1, "1 month"], [2, "2 months"], [3, "3 months"], [6, "6 months"], [12, "12 months"]];
// Suggest access that covers the course plus two weeks, rounded up to the next choice.
const suggest = (course) => { const need = Math.ceil(((COURSE_WEEKS[course] || 4) * 7 + 14) / 30); return (MONTHS.find(([m]) => m >= need) || MONTHS[MONTHS.length - 1])[0]; };

export default function AddStudent() {
  const first = COURSE_NAMES[0];
  const [f, setF] = useState({ name: "", phone: "", course: first, mode: "physical", fee: COURSE_FEES[first].physical, months: suggest(first) });
  const change = (patch) => setF((x) => {
    const n = { ...x, ...patch };
    if ("course" in patch) n.months = suggest(n.course);
    if ("course" in patch || "mode" in patch) n.fee = COURSE_FEES[n.course][n.mode];
    return n;
  });
  return (
    <ActionForm action={addStudent} label="Add student and issue PIN" busy="Creating account..." className="card form" reset={false} onSuccess={() => setF((x) => ({ ...x, name: "", phone: "" }))}>
      <h3>Add a student</h3>
      <p className="m" style={{ margin: "0 0 4px" }}>Creates the student, enrolls them and issues an Access PIN they use to sign in. No email needed.</p>
      <label>Full name</label>
      <input name="name" required minLength={2} maxLength={80} autoComplete="off" value={f.name} onChange={(e) => change({ name: e.target.value })} />
      <label>Phone number <span className="m">optional, helps you find them later</span></label>
      <input name="phone" type="tel" maxLength={30} autoComplete="off" value={f.phone} onChange={(e) => change({ phone: e.target.value })} />
      <label>Plan: course</label>
      <select name="course" value={f.course} onChange={(e) => change({ course: e.target.value })}>{COURSE_NAMES.map((c) => <option key={c}>{c}</option>)}</select>
      <label>Plan: class type</label>
      <select name="mode" value={f.mode} onChange={(e) => change({ mode: e.target.value })}><option value="physical">Physical</option><option value="online">Online</option></select>
      <label>Course fee (₦) <span className="m">change it if you gave a discount</span></label>
      <input name="fee" type="number" min="0" step="1" required value={f.fee} onChange={(e) => change({ fee: e.target.value })} />
      <label>PIN works for</label>
      <select name="months" value={f.months} onChange={(e) => change({ months: Number(e.target.value) })}>{MONTHS.map(([m, l]) => <option key={m} value={m}>{l}</option>)}</select>
      <p className="m" style={{ margin: "8px 0 14px" }}>Access runs until <b>{prettyDate(addMonths(lagosToday(), f.months))}</b>. You can renew it any time.</p>
    </ActionForm>
  );
}
