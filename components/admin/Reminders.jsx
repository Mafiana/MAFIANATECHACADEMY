"use client";
import ActionForm from "./ActionForm";
import { sendDueReminders, sendRenewalReminder, markReminded } from "../../app/admin/actions";

const day = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Africa/Lagos" });
const when = (left) => (left > 1 ? left + " days left" : left === 1 ? "ends tomorrow" : left === 0 ? "ends today" : "ended " + -left + " day" + (left === -1 ? "" : "s") + " ago");

export default function Reminders({ due, configured, missing }) {
  const waiting = due.filter((d) => d.waiting).length;
  const noteOpened = (id) => { const fd = new FormData(); fd.set("student", id); markReminded(null, fd); };
  return (
    <div className="card" id="reminders">
      <h3>Renewal reminders <span className="m">({due.length})</span></h3>
      <p className="m" style={{ margin: "0 0 8px" }}>
        Students whose access ends within 14 days, or ended in the last 30. {configured
          ? "Automatic WhatsApp sending is connected. The daily job messages each student 7 days before, 3 days before, on the last day, and once after access ends."
          : "Automatic WhatsApp sending is not connected yet. Tap “Open WhatsApp” to send each message yourself."}
      </p>
      {missing && <p className="adm-msg bad">Run <code>supabase/add-renewal-reminders.sql</code> in the Supabase SQL Editor so reminders can be logged, then refresh this page.</p>}
      {configured && (
        <ActionForm action={sendDueReminders} label={"Send due reminders now" + (waiting ? " (" + waiting + ")" : "")} busy="Sending..." reset={false} className="form adm-edit" confirmTitle="Send reminders?" confirm={waiting ? "Send a WhatsApp reminder to " + waiting + " student" + (waiting === 1 ? "" : "s") + " now?" : "Nobody is waiting for a reminder right now. Check anyway?"} />
      )}
      {!due.length && <p className="m" style={{ marginTop: 12 }}>Nobody needs a reminder right now.</p>}
      {due.slice(0, 40).map((d) => (
        <div className="adm-item" key={d.id}>
          <div className="adm-item-main" style={{ flexWrap: "wrap" }}>
            <span>
              <b>{d.name}</b> <span className="m">{d.plan}</span>
              <span className={"badge " + (d.left <= 0 ? "bad" : "warn")} style={{ marginLeft: 8 }}>{when(d.left)}</span>
              <br />
              <span className="m">{d.last ? "Last reminder " + day(d.last) + (d.lastHow === "wa-link" ? " (opened in WhatsApp)" : "") : "No reminder sent yet"}{d.phoneOk ? "" : " · no valid phone number"}</span>
            </span>
            <span className="adm-acts">
              {configured && d.phoneOk && (
                <ActionForm action={sendRenewalReminder} label="Send WhatsApp" busy="Sending..." cls="btn sm" className="adm-inline">
                  <input type="hidden" name="student" value={d.id} />
                </ActionForm>
              )}
              {d.href && <a className="btn ghost sm" href={d.href} target="_blank" rel="noopener noreferrer" onClick={() => noteOpened(d.id)}>Open WhatsApp</a>}
            </span>
          </div>
        </div>
      ))}
      {due.length > 40 && <p className="m" style={{ marginTop: 10 }}>Showing the first 40 of {due.length}.</p>}
    </div>
  );
}
