"use client";
import { useState } from "react";
import ActionForm from "./ActionForm";
import { naira } from "../../lib/courses";
import { updatePayment, deletePayment, updateEnrollment, deleteEnrollment } from "../../app/admin/actions";

const dateOf = (d) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export function PaymentRow({ p, who }) {
  const [edit, setEdit] = useState(false);
  return (
    <div className="adm-item">
      <div className="adm-item-main">
        <span><b>{naira(p.amount)}</b> <span className="m">{p.note || "Payment"}{who ? " · " + who : ""}</span></span>
        <span className="m">{dateOf(p.created_at)}</span>
        <span className="adm-acts">
          <button type="button" className="btn ghost sm" onClick={() => setEdit(!edit)} aria-expanded={edit}>{edit ? "Close" : "Edit"}</button>
          <ActionForm action={deletePayment} label="Delete" busy="..." cls="btn danger sm" confirm={"Delete this " + naira(p.amount) + " payment? This cannot be undone."} className="adm-inline">
            <input type="hidden" name="id" value={p.id} />
          </ActionForm>
        </span>
      </div>
      {edit && (
        <ActionForm action={updatePayment} label="Save changes" className="adm-edit form" reset={false}>
          <input type="hidden" name="id" value={p.id} />
          <label>Amount (₦)</label><input name="amount" type="number" min="1" step="1" required defaultValue={p.amount} />
          <label>Note</label><input name="note" defaultValue={p.note || ""} maxLength={120} />
          <div style={{ height: 10 }} />
        </ActionForm>
      )}
    </div>
  );
}

export function EnrollmentRow({ e }) {
  const [edit, setEdit] = useState(false);
  return (
    <div className="adm-item">
      <div className="adm-item-main">
        <span><b>{e.course}</b> <span className="m">{e.mode} · {naira(e.total_fee)}{e.certificate_issued ? " · certificate issued" : ""}</span></span>
        <span />
        <span className="adm-acts">
          <button type="button" className="btn ghost sm" onClick={() => setEdit(!edit)} aria-expanded={edit}>{edit ? "Close" : "Edit"}</button>
          <ActionForm action={deleteEnrollment} label="Delete" busy="..." cls="btn danger sm" confirm={"Delete the " + e.course + " enrollment? This cannot be undone."} className="adm-inline">
            <input type="hidden" name="id" value={e.id} />
          </ActionForm>
        </span>
      </div>
      {edit && (
        <ActionForm action={updateEnrollment} label="Save changes" className="adm-edit form" reset={false}>
          <input type="hidden" name="id" value={e.id} />
          <label>Class type</label>
          <select name="mode" defaultValue={e.mode}><option value="physical">Physical</option><option value="online">Online</option></select>
          <label>Course fee (₦)</label><input name="fee" type="number" min="0" step="1" required defaultValue={e.total_fee} />
          <div style={{ height: 10 }} />
        </ActionForm>
      )}
    </div>
  );
}
