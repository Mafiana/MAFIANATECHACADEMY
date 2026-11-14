"use client";
import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitQuiz } from "../../app/portal/actions";

function Submit({ disabled }) {
  const { pending } = useFormStatus();
  return <button className="btn" disabled={pending || disabled}>{pending ? <><span className="spin" aria-hidden="true" /> Marking...</> : "Submit answers"}</button>;
}

function Inner({ quiz, retry }) {
  const [state, action] = useFormState(submitQuiz, { ok: null, msg: "" });
  const [ans, setAns] = useState(() => quiz.questions.map(() => null));
  const done = state.ok === true;
  const answered = ans.filter((a) => a !== null).length;
  const pct = done ? Math.round((state.score / state.total) * 100) : 0;
  return (
    <form action={action} className="qz">
      <input type="hidden" name="quiz" value={quiz.id} />
      <input type="hidden" name="answers" value={JSON.stringify(ans)} />
      {done && (
        <div className="card qz-score" role="status">
          <h3>You scored {state.score} out of {state.total} ({pct}%)</h3>
          <p className="m" style={{ margin: "4px 0 0" }}>{pct >= 70 ? "Well done." : "Keep going. Review the lessons and try again."} The right answers are marked below.</p>
        </div>
      )}
      {quiz.questions.map((q, i) => (
        <fieldset key={i} className="card qz-q" disabled={done}>
          <legend><span className="m">Question {i + 1}</span><br />{q.q}</legend>
          {q.options.map((o, j) => {
            const picked = ans[i] === j;
            const right = done && state.key[i] === j;
            const wrong = done && picked && state.key[i] !== j;
            return (
              <label key={j} className={"qz-opt" + (picked ? " on" : "") + (right ? " right" : "") + (wrong ? " wrong" : "")}>
                <input type="radio" name={"q" + i} checked={picked} onChange={() => setAns(ans.map((a, k) => (k === i ? j : a)))} />
                <span>{o}</span>
                {right && <b className="qz-tag">Correct</b>}
                {wrong && <b className="qz-tag">Your answer</b>}
              </label>
            );
          })}
        </fieldset>
      ))}
      {!done && (
        <div className="adm-acts">
          <Submit disabled={answered < quiz.questions.length} />
          <span className="m">{answered} of {quiz.questions.length} answered</span>
        </div>
      )}
      {done && (
        <div className="adm-acts">
          <button type="button" className="btn" onClick={retry}>Try again</button>
          <Link className="btn ghost" href="/portal/quizzes">All quizzes</Link>
        </div>
      )}
      {state.ok === false && <p className="adm-msg bad" role="alert">{state.msg}</p>}
    </form>
  );
}

export default function QuizTaker({ quiz }) {
  const [n, setN] = useState(0);
  return <Inner key={n} quiz={quiz} retry={() => { setN(n + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} />;
}
