"use client";
import ActionForm from "./ActionForm";
import { addInstructor, resetPin, setAccess } from "../../app/admin/actions";

export default function Staff({ instructors }) {
  return (
    <div className="card" id="instructors">
      <h3>Instructors <span className="m">({instructors.length})</span></h3>
      <p className="m" style={{ margin: "0 0 8px" }}>
        Each instructor gets an Access PIN and signs in on the student login page. They can take the class register and manage video lessons and quizzes.
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
          <div className="adm-item-main">
            <span><b>{p.label}</b> <span className="m">{p.sub}</span>{p.paused && <span className="badge bad" style={{ marginLeft: 8 }}>Paused</span>}</span>
            <span className="adm-acts">
              <ActionForm action={resetPin} label="New PIN" busy="..." cls="btn ghost sm" confirm={"Issue a new PIN for " + p.label + "? Their old PIN stops working immediately."} className="adm-inline">
                <input type="hidden" name="student" value={p.id} />
              </ActionForm>
              <ActionForm action={setAccess} label={p.paused ? "Restore" : "Pause"} busy="..." cls={p.paused ? "btn sm" : "btn danger sm"} confirm={p.paused ? undefined : "Pause " + p.label + "'s access? Their PIN stops working now."} className="adm-inline">
                <input type="hidden" name="student" value={p.id} /><input type="hidden" name="action" value={p.paused ? "restore" : "pause"} />
              </ActionForm>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
