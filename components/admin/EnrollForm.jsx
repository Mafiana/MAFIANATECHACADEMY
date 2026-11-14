"use client";
import { useState } from "react";
import ActionForm from "./ActionForm";
import StudentSelect from "./StudentSelect";
import { COURSE_NAMES, COURSE_FEES } from "../../lib/courses";
import { enroll } from "../../app/admin/actions";

export default function EnrollForm({ students }) {
  const [course, setCourse] = useState(COURSE_NAMES[0]);
  const [mode, setMode] = useState("physical");
  const [fee, setFee] = useState(COURSE_FEES[COURSE_NAMES[0]].physical);
  const change = (c, m) => { setCourse(c); setMode(m); setFee(COURSE_FEES[c][m]); };
  return (
    <ActionForm action={enroll} label="Enroll student" busy="Enrolling..." className="card form" reset={false}>
      <h3>Enroll a student</h3>
      <StudentSelect students={students} />
      <label>Course</label>
      <select name="course" value={course} onChange={(e) => change(e.target.value, mode)}>{COURSE_NAMES.map((c) => <option key={c}>{c}</option>)}</select>
      <label>Class type</label>
      <select name="mode" value={mode} onChange={(e) => change(course, e.target.value)}><option value="physical">Physical</option><option value="online">Online</option></select>
      <label>Course fee (₦) <span className="m">filled in for you, change it if you gave a discount</span></label>
      <input name="fee" type="number" min="0" step="1" required value={fee} onChange={(e) => setFee(e.target.value)} />
      <div style={{ height: 14 }} />
    </ActionForm>
  );
}
