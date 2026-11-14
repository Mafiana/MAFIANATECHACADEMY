"use client";
import { useMemo, useState } from "react";
import { PaymentRow } from "./rows";
import { naira } from "../../lib/courses";

export default function Payments({ payments }) {
  const [q, setQ] = useState("");
  const [show, setShow] = useState(15);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? payments.filter((p) => (p.who + " " + (p.note || "")).toLowerCase().includes(n)) : payments;
  }, [payments, q]);
  const total = list.reduce((a, p) => a + p.amount, 0);
  return (
    <div className="card" id="payments">
      <h3>Payments <span className="m">({list.length}, {naira(total)})</span></h3>
      <input type="search" className="adm-search" placeholder="Search by student or note" value={q} onChange={(e) => { setQ(e.target.value); setShow(15); }} aria-label="Search payments" />
      {!payments.length && <p className="m">No payments recorded yet.</p>}
      {payments.length > 0 && !list.length && <p className="m">No payment matches that search.</p>}
      {list.slice(0, show).map((p) => <PaymentRow key={p.id} p={p} who={p.who} />)}
      {list.length > show && <button type="button" className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => setShow(show + 20)}>Show more</button>}
    </div>
  );
}
