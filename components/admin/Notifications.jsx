"use client";
import ActionForm from "./ActionForm";
import { renewAccess } from "../../app/admin/actions";

const MONTHS = [[1, "1 month"], [2, "2 months"], [3, "3 months"], [6, "6 months"], [12, "12 months"]];
const when = (left) => (left > 1 ? left + " days left" : left === 1 ? "ends tomorrow" : left === 0 ? "ends today" : "ended " + -left + " day" + (left === -1 ? "" : "s") + " ago");

// Admin notifications: students whose access ends within 7 days, or ended in the last 30 days. Renew from here.
export default function Notifications({ items }) {
  return (
    <div className="card" id="notifications">
      <h3>🔔 Notifications <span className="m">({items.length})</span></h3>
      {!items.length && <p className="m" style={{ margin: 0 }}>You are all caught up. No student access is ending soon.</p>}
      {items.length > 0 && <p className="m" style={{ margin: "0 0 8px" }}>These students’ access is ending or has just ended. Students whose access ends within 7 days also see a notice in their portal. Renew from here.</p>}
      {items.map((n) => (
        <div className="adm-item" key={n.id}>
          <div className="adm-item-main" style={{ flexWrap: "wrap" }}>
            <span>
              <b>{n.name}</b> <span className="m">{n.plan}</span>
              <span className={"badge " + (n.left <= 0 ? "bad" : "warn")} style={{ marginLeft: 8 }}>{when(n.left)}</span>
              <br />
              <span className="m">Access {n.left < 0 ? "ended" : "ends"} {n.until}</span>
            </span>
            <ActionForm action={renewAccess} label="Renew" busy="..." cls="btn sm" className="adm-inline adm-renew" reset={false}>
              <input type="hidden" name="student" value={n.id} />
              <select name="months" defaultValue="3" aria-label={"Extend " + n.name + " by"}>{MONTHS.map(([m, l]) => <option key={m} value={m}>Extend {l}</option>)}</select>
            </ActionForm>
          </div>
        </div>
      ))}
    </div>
  );
}
