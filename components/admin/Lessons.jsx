"use client";
import { useState } from "react";
import ActionForm from "./ActionForm";
import { COURSE_NAMES } from "../../lib/courses";
import { addLesson, updateLesson, deleteLesson } from "../../app/admin/actions";

function LessonRow({ l }) {
  const [edit, setEdit] = useState(false);
  return (
    <div className="adm-item">
      <div className="adm-item-main">
        <span><b>{l.position}. {l.title}</b> <span className="m">{l.minutes ? l.minutes + " min · " : ""}<a href={l.video_url} target="_blank" rel="noopener noreferrer">open link</a></span></span>
        <span className="adm-acts">
          <button type="button" className="btn ghost sm" onClick={() => setEdit(!edit)} aria-expanded={edit}>{edit ? "Close" : "Edit"}</button>
          <ActionForm action={deleteLesson} label="Delete" busy="..." cls="btn danger sm" confirm={"Delete the lesson “" + l.title + "”?"} className="adm-inline">
            <input type="hidden" name="id" value={l.id} />
          </ActionForm>
        </span>
      </div>
      {edit && (
        <ActionForm action={updateLesson} label="Save changes" className="adm-edit form" reset={false}>
          <input type="hidden" name="id" value={l.id} />
          <label>Title</label><input name="title" required maxLength={120} defaultValue={l.title} />
          <label>Video link</label><input name="url" type="url" required defaultValue={l.video_url} />
          <label>Minutes</label><input name="minutes" type="number" min="0" max="600" defaultValue={l.minutes ?? ""} />
          <label>Order in the course</label><input name="position" type="number" min="1" max="999" defaultValue={l.position} />
          <div style={{ height: 10 }} />
        </ActionForm>
      )}
    </div>
  );
}

export default function Lessons({ lessons, missing }) {
  return (
    <div className="card" id="lessons">
      <h3>Video lessons <span className="m">({lessons.length})</span></h3>
      <p className="m" style={{ margin: "0 0 8px" }}>Upload your video to YouTube (Unlisted works well), Vimeo or Google Drive, then paste the link here. Only students enrolled in the course can see the lesson in their portal.</p>
      {missing && <p className="adm-msg bad">Lessons and quizzes are not set up yet. Run <code>supabase/add-lessons-quizzes.sql</code> in the Supabase SQL Editor, then refresh this page.</p>}
      <ActionForm action={addLesson} label="Add lesson" busy="Adding..." className="form adm-edit">
        <label>Course</label>
        <select name="course">{COURSE_NAMES.map((c) => <option key={c}>{c}</option>)}</select>
        <label>Lesson title</label>
        <input name="title" required maxLength={120} placeholder="SQL joins" />
        <label>Video link</label>
        <input name="url" type="url" required placeholder="https://www.youtube.com/watch?v=..." />
        <label>Minutes <span className="m">optional</span></label>
        <input name="minutes" type="number" min="0" max="600" inputMode="numeric" />
        <label>Order in the course <span className="m">optional, leave empty to add at the end</span></label>
        <input name="position" type="number" min="1" max="999" inputMode="numeric" />
        <div style={{ height: 10 }} />
      </ActionForm>
      {!missing && !lessons.length && <p className="m" style={{ marginTop: 12 }}>No lessons yet.</p>}
      {COURSE_NAMES.filter((c) => lessons.some((l) => l.course === c)).map((c) => (
        <div key={c}>
          <h4 className="adm-sub">{c}</h4>
          {lessons.filter((l) => l.course === c).map((l) => <LessonRow key={l.id} l={l} />)}
        </div>
      ))}
    </div>
  );
}
