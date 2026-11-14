"use client";
import { useMemo, useState } from "react";
import ActionForm from "./ActionForm";
import { PaymentRow, EnrollmentRow } from "./rows";
import { naira } from "../../lib/courses";
import { recordPayment } from "../../app/admin/actions";

const STATUS = { owing: ["Owing", "bad"], part: ["Part paid", "warn"], paid: ["Paid", "ok"], none: ["No course", "mute"] };
const FILTERS = [["all", "All"], ["owing", "Owing"], ["part", "Part paid"], ["paid", "Paid"], ["none", "No course"]];

export default function Students({ students }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");
  const [open, setOpen] = useState(null);

  const counts = useMemo(() => {
    const c = { all: students.length, owing: 0, part: 0, paid: 0, none: 0 };
    students.forEach((s) => { c[s.status]++; });
    return c;
  }, [students]);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return students.filter((s) => (f === "all" || s.status === f) && (!n || (s.label + " " + s.email + " " + s.courses.join(" ")).toLowerCase().includes(n)));
  }, [students, q, f]);

  return (
    <div className="card" id="students">
      <h3>Students <span className="m">({students.length})</span></h3>
      <input type="search" className="adm-search" placeholder="Search by name, email or course" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search students" />
      <div className="adm-chips" role="group" aria-label="Filter by payment status">
        {FILTERS.map(([k, l]) => <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>{l} <span>{counts[k]}</span></button>)}
      </div>
      {!students.length && <p className="m">No students yet. They appear here after they sign up on the login page.</p>}
      {students.length > 0 && !list.length && <p className="m">No student matches that search.</p>}
      <div className="adm-list">
        {list.map((s) => {
          const [sl, tone] = STATUS[s.status];
          const isOpen = open === s.id;
          return (
            <div className={"adm-row" + (isOpen ? " open" : "")} key={s.id}>
              <button type="button" className="adm-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                <span className="adm-name"><b>{s.label}</b><small>{s.email}</small></span>
                <span className="adm-courses">{s.courses.length ? s.courses.join(", ") : <i>No course yet</i>}</span>
                <span className="adm-money"><b>{naira(s.balance)}</b><small>balance</small></span>
                <span className={"badge " + tone}>{sl}</span>
                <span className="adm-att" title="Attendance, last 120 days"><b>{s.total ? s.pct + "%" : "–"}</b><small>attend</small></span>
              </button>
              {isOpen && (
                <div className="adm-detail">
                  <div className="adm-sums">
                    <div><small>Total fees</small><b>{naira(s.fees)}</b></div>
                    <div><small>Paid</small><b>{naira(s.paid)}</b></div>
                    <div><small>Balance</small><b>{naira(s.balance)}</b></div>
                    <div><small>Classes attended</small><b>{s.present} of {s.total}</b></div>
                  </div>
                  <h4>Enrollments</h4>
                  {s.enrollments.length ? s.enrollments.map((e) => <EnrollmentRow key={e.id} e={e} />) : <p className="m">Not enrolled yet. Use “Enroll a student” below.</p>}
                  <h4>Payments</h4>
                  {s.payments.length ? s.payments.map((p) => <PaymentRow key={p.id} p={p} />) : <p className="m">No payments yet.</p>}
                  <ActionForm action={recordPayment} label="Add payment" className="adm-quick form">
                    <input type="hidden" name="student" value={s.id} />
                    <label>Quick add a payment (₦)</label>
                    <input name="amount" type="number" min="1" step="1" required inputMode="numeric" placeholder="Amount" />
                    <input name="note" placeholder="Note (optional)" maxLength={120} style={{ marginTop: 8 }} />
                    <div style={{ height: 10 }} />
                  </ActionForm>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
