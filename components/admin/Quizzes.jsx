"use client";
import { useRef, useState } from "react";
import ActionForm from "./ActionForm";
import { COURSE_NAMES } from "../../lib/courses";
import { createQuiz, deleteQuiz } from "../../app/admin/actions";
import { parseQuizCsv, QUIZ_CSV_TEMPLATE } from "../../lib/quizCsv";

const blank = () => ({ q: "", options: ["", "", "", ""], answer: 0 });
const dateOf = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function downloadTemplate() {
  const url = URL.createObjectURL(new Blob(["\uFEFF" + QUIZ_CSV_TEMPLATE], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url; a.download = "quiz-template.csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Builder() {
  const [qs, setQs] = useState([blank()]);
  const [imp, setImp] = useState({ ok: null, text: "", errors: [] });
  const titleRef = useRef(null);
  async function onFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const { questions, errors } = parseQuizCsv(await f.text());
    if (!questions.length) return setImp({ ok: false, text: "Nothing was imported.", errors });
    setQs(questions);
    if (titleRef.current && !titleRef.current.value) titleRef.current.value = f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 120);
    setImp({ ok: true, text: `Imported ${questions.length} question${questions.length === 1 ? "" : "s"}${errors.length ? `, skipped ${errors.length}` : ""}. Check them below, choose the course, then press Create quiz.`, errors });
  }
  const set = (i, patch) => setQs(qs.map((q, k) => (k === i ? { ...q, ...patch } : q)));
  const setOpt = (i, j, v) => set(i, { options: qs[i].options.map((o, k) => (k === j ? v : o)) });
  const addOpt = (i) => qs[i].options.length < 6 && set(i, { options: [...qs[i].options, ""] });
  const delOpt = (i, j) => {
    const q = qs[i];
    if (q.options.length <= 2) return;
    set(i, { options: q.options.filter((_, k) => k !== j), answer: q.answer === j ? 0 : q.answer > j ? q.answer - 1 : q.answer });
  };
  return (
    <ActionForm action={createQuiz} label="Create quiz" busy="Creating..." className="form adm-edit" reset={false} onSuccess={() => { setQs([blank()]); setImp({ ok: null, text: "", errors: [] }); if (titleRef.current) titleRef.current.value = ""; }}>
      <input type="hidden" name="payload" value={JSON.stringify(qs)} />
      <label>Course</label>
      <select name="course">{COURSE_NAMES.map((c) => <option key={c}>{c}</option>)}</select>
      <label>Quiz title</label>
      <input ref={titleRef} name="title" required maxLength={120} placeholder="Excel quiz" />
      <div className="csv-import">
        <b>Import questions from a CSV file</b>
        <p className="m" style={{ margin: "4px 0 10px" }}>Columns: question, option_a, option_b, option_c, option_d, answer (the answer is a letter such as B). Save from Excel or Google Sheets as CSV. Up to 50 questions and 6 options each.</p>
        <div className="adm-acts">
          <input type="file" accept=".csv,text/csv,text/plain" onChange={onFile} aria-label="Choose a CSV file of questions" />
          <button type="button" className="btn ghost sm" onClick={downloadTemplate}>Download template</button>
        </div>
        {imp.text && <p className={"adm-msg " + (imp.ok ? "ok" : "bad")} role={imp.ok ? "status" : "alert"} style={{ marginBottom: 0 }}>{imp.text}</p>}
        {imp.errors.length > 0 && <ul className="m" style={{ margin: "6px 0 0", paddingLeft: 20 }}>{imp.errors.slice(0, 6).map((x, i) => <li key={i}>{x}</li>)}{imp.errors.length > 6 && <li>…and {imp.errors.length - 6} more.</li>}</ul>}
      </div>
      {qs.map((q, i) => (
        <fieldset className="qb" key={i}>
          <legend>Question {i + 1}</legend>
          <input aria-label={"Question " + (i + 1)} value={q.q} onChange={(e) => set(i, { q: e.target.value })} maxLength={300} placeholder="Type the question" />
          {q.options.map((o, j) => (
            <div className="qb-opt" key={j}>
              <input type="radio" name={"ans" + i} checked={q.answer === j} onChange={() => set(i, { answer: j })} aria-label={"Option " + (j + 1) + " is correct"} title="Mark as the correct answer" />
              <input value={o} onChange={(e) => setOpt(i, j, e.target.value)} maxLength={200} placeholder={"Option " + (j + 1)} aria-label={"Option " + (j + 1)} />
              {q.options.length > 2 && <button type="button" className="btn ghost sm" onClick={() => delOpt(i, j)} aria-label={"Remove option " + (j + 1)}>✕</button>}
            </div>
          ))}
          <div className="adm-acts" style={{ marginTop: 8 }}>
            {q.options.length < 6 && <button type="button" className="btn ghost sm" onClick={() => addOpt(i)}>Add option</button>}
            {qs.length > 1 && <button type="button" className="btn danger sm" onClick={() => setQs(qs.filter((_, k) => k !== i))}>Remove question</button>}
          </div>
          <p className="m" style={{ margin: "6px 0 0" }}>Tick the circle beside the correct answer.</p>
        </fieldset>
      ))}
      {qs.length < 50 && <button type="button" className="btn ghost sm" style={{ margin: "12px 0" }} onClick={() => setQs([...qs, blank()])}>Add question</button>}
      <div style={{ height: 6 }} />
    </ActionForm>
  );
}

function QuizRow({ z }) {
  const [open, setOpen] = useState(false);
  const avg = z.attempts.length ? Math.round(z.attempts.reduce((a, t) => a + (t.score / t.total) * 100, 0) / z.attempts.length) : null;
  return (
    <div className="adm-item">
      <div className="adm-item-main">
        <span><b>{z.title}</b> <span className="m">{z.course} · {z.count} question{z.count === 1 ? "" : "s"} · {z.attempts.length} attempt{z.attempts.length === 1 ? "" : "s"}{avg !== null ? " · average " + avg + "%" : ""}</span></span>
        <span className="adm-acts">
          <button type="button" className="btn ghost sm" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Hide results" : "Results"}</button>
          <ActionForm action={deleteQuiz} label="Delete" busy="..." cls="btn danger sm" confirm={"Delete the quiz “" + z.title + "” and all its results?"} className="adm-inline">
            <input type="hidden" name="id" value={z.id} />
          </ActionForm>
        </span>
      </div>
      {open && (
        <div className="adm-edit">
          {!z.attempts.length && <p className="m" style={{ margin: 0 }}>No one has taken this quiz yet.</p>}
          {z.attempts.slice(0, 30).map((t) => <div className="stat" key={t.id}><span>{t.who} <span className="m">· {dateOf(t.created_at)}</span></span><b>{t.score}/{t.total}</b></div>)}
        </div>
      )}
    </div>
  );
}

export default function Quizzes({ quizzes, missing }) {
  return (
    <div className="card" id="quizzes">
      <h3>Quizzes <span className="m">({quizzes.length})</span></h3>
      <p className="m" style={{ margin: "0 0 8px" }}>Multiple-choice quizzes. Students take them in their portal and the score is saved. They can retake a quiz.</p>
      {missing && <p className="adm-msg bad">Lessons and quizzes are not set up yet. Run <code>supabase/add-lessons-quizzes.sql</code> in the Supabase SQL Editor, then refresh this page.</p>}
      <Builder />
      {!missing && !quizzes.length && <p className="m" style={{ marginTop: 12 }}>No quizzes yet.</p>}
      {quizzes.map((z) => <QuizRow key={z.id} z={z} />)}
    </div>
  );
}
