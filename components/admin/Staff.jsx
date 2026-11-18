"use client";
import { useState } from "react";
import ActionForm from "./ActionForm";
import { COURSE_NAMES } from "../../lib/courses";
import { addInstructor, resetPin, setAccess, setInstructorCourses } from "../../app/admin/actions";

function CourseAssign({ p }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn ghost sm" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Close" : "Courses"}</button>
      {open && (
        <div style={{ flexBasis: "100%" }}>
          <ActionForm action={setInstructorCourses} label="Save courses" busy="Saving..." reset={false} className="adm-edit form">
            <input type="hidden" name="instructor" value={p.id} />
            <p className="m" style={{ margin: "0 0 8px" }}>Tick the courses {p.label} teaches. They will only see those courses and their students. Leave everything unticked to let them see every course.</p>
            {COURSE_NAMES.map((c) => (
              <label key={c} style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink)", margin: "6px 0" }}>
                <input type="checkbox" name="course" value={c} defaultChecked={p.courses.includes(c)} style={{ width: "auto" }} />
                {c}
              </label>
            ))}
            <div style={{ height: 10 }} />
          </ActionForm>
        </div>
      )}
    </>
  );
}

export default function Staff({ instructors }) {
  return (
    <div className="card" id="instructors">
      <h3>Instructors <span className="m">({instructors.length})</span></h3>
      <p className="m" style={{ margin: "0 0 8px" }}>
        Each instructor gets an Access PIN and signs in on the student login page. They get their own panel to see their students, take the class register and manage video lessons and quizzes.
        They cannot see fees, payments or certificates.
      </p>
      <ActionForm action={addInstructor} label="Add instructor and issue PIN" busy="Creating account..." className="form adm-edit">
        <label>Full name</label><input name="name" required minLength={2} maxLength={80} autoComplete="off" />
        <label>Phone number <span className="m">optional</span></label><input name="phone" type="tel" maxLength={30} autoComplete="off" />
        <div style={{ height: 10 }} />
      </ActionForm>
      {!instructors.length && <p className="m" style={{ marginTop: 12 }}>No instructors yet.</p>}
      {instructors.map((p) => (
        <div className="adm-item" key={p.id}>
          <div className="adm-item-main" style={{ flexWrap: "wrap" }}>
            <span><b>{p.label}</b> <span className="m">{p.sub}</span>{p.paused && <span className="badge bad" style={{ marginLeft: 8 }}>Paused</span>}<br /><span className="m">Teaches: {p.courses.length ? p.courses.join(", ") : "all courses"}</span></span>
            <span className="adm-acts">
              <CourseAssign p={p} />
              <ActionForm action={resetPin} label="New PIN" busy="..." cls="btn ghost sm" confirmTitle="Issue a new PIN?" confirm={"Issue a new PIN for " + p.label + "? Their old PIN stops working immediately."} className="adm-inline">
                <input type="hidden" name="student" value={p.id} />
              </ActionForm>
              <ActionForm action={setAccess} label={p.paused ? "Restore" : "Pause"} busy="..." cls={p.paused ? "btn sm" : "btn danger sm"} confirmTitle="Pause access?" confirm={p.paused ? undefined : "Pause " + p.label + "'s access? Their PIN stops working now."} className="adm-inline">
                <input type="hidden" name="student" value={p.id} /><input type="hidden" name="action" value={p.paused ? "restore" : "pause"} />
              </ActionForm>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
