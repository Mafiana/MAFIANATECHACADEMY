"use client";
import { useMemo, useState } from "react";
import ActionForm from "./ActionForm";
import { COURSE_NAMES } from "../../lib/courses";
import { saveRegister } from "../../app/admin/actions";

function Sheet({ date, roster, saved }) {
  // saved: { studentId: present } already stored for this date. New students default to present.
  const [marks, setMarks] = useState(() => Object.fromEntries(roster.map((s) => [s.id, saved[s.id] ?? true])));
  const present = roster.filter((s) => marks[s.id]).length;
  const setAll = (v) => setMarks(Object.fromEntries(roster.map((s) => [s.id, v])));
  const had = Object.keys(saved).length > 0;
  return (
    <ActionForm action={saveRegister} label={had ? "Update register" : "Save register"} reset={false} className="adm-reg">
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="entries" value={JSON.stringify(roster.map((s) => [s.id, marks[s.id]]))} />
      <div className="adm-reg-top">
        <span className="m">{present} present, {roster.length - present} absent{had ? " · already saved for this date, saving will update it" : ""}</span>
        <span className="adm-acts">
          <button type="button" className="btn ghost sm" onClick={() => setAll(true)}>All present</button>
          <button type="button" className="btn ghost sm" onClick={() => setAll(false)}>All absent</button>
        </span>
      </div>
      {roster.map((s) => (
        <div className="adm-item" key={s.id}>
          <div className="adm-item-main">
            <span><b>{s.label}</b></span>
            <span className="seg adm-seg" role="group" aria-label={"Attendance for " + s.label}>
              <button type="button" aria-pressed={marks[s.id]} onClick={() => setMarks({ ...marks, [s.id]: true })}>Present</button>
              <button type="button" aria-pressed={!marks[s.id]} className="abs" onClick={() => setMarks({ ...marks, [s.id]: false })}>Absent</button>
            </span>
          </div>
        </div>
      ))}
      <div style={{ height: 12 }} />
    </ActionForm>
  );
}

export default function Register({ students, enrollments, attendance, today }) {
  const courses = useMemo(() => COURSE_NAMES.filter((c) => enrollments.some((e) => e.course === c)), [enrollments]);
  const [picked, setCourse] = useState("");
  const course = courses.includes(picked) ? picked : courses[0] || "";
  const [date, setDate] = useState(today);

  const roster = useMemo(() => {
    const ids = new Set(enrollments.filter((e) => e.course === course).map((e) => e.student_id));
    return students.filter((s) => ids.has(s.id));
  }, [students, enrollments, course]);
  const saved = useMemo(() => {
    const m = {};
    attendance.filter((a) => a.class_date === date).forEach((a) => { m[a.student_id] = a.present; });
    return m;
  }, [attendance, date]);

  return (
    <div className="card form" id="attendance">
      <h3>Class register</h3>
      <p className="m" style={{ margin: "0 0 4px" }}>Mark the whole class in one go. Pick the course and the date.</p>
      {!courses.length ? <p className="m">Enroll students in a course first, then their class list appears here.</p> : (
        <>
          <div className="adm-reg-pick">
            <div><label>Course</label><select value={course} onChange={(e) => setCourse(e.target.value)}>{courses.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label>Date</label><input type="date" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} /></div>
          </div>
          {roster.length ? <Sheet key={course + date} date={date} roster={roster} saved={saved} /> : <p className="m">No students in this course.</p>}
        </>
      )}
    </div>
  );
}

