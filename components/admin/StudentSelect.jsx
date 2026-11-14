"use client";
import { useState } from "react";

// A student dropdown with a search box on top, so it stays usable with hundreds of students.
export default function StudentSelect({ students, name = "student", label = "Student" }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const list = students.filter((s) => (s.label + " " + s.email).toLowerCase().includes(needle));
  return (
    <>
      <label>{label}</label>
      {students.length > 8 && <input type="search" placeholder="Type a name or email to find a student" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search students" style={{ marginBottom: 8 }} />}
      <select name={name} required disabled={!students.length}>
        {!students.length ? <option value="">No students yet</option>
          : !list.length ? <option value="">No match</option>
          : list.map((s) => <option key={s.id} value={s.id}>{s.label}{s.email && s.email !== s.label ? " (" + s.email + ")" : ""}</option>)}
      </select>
    </>
  );
}
