"use client";
import Link from "next/link";
import ActionForm from "./ActionForm";
import { naira } from "../../lib/courses";
import { setCertificate } from "../../app/admin/actions";

export default function Certificates({ pending, issued }) {
  return (
    <div className="card" id="certificates">
      <h3>Certificates</h3>
      <h4 className="adm-sub">Ready to issue <span className="m">({pending.length})</span></h4>
      {!pending.length && <p className="m">Nothing waiting. Every enrollment already has a certificate.</p>}
      {pending.map((e) => (
        <div className="adm-item" key={e.id}>
          <div className="adm-item-main">
            <span><b>{e.who}</b> <span className="m">{e.course}</span>{e.balance > 0 && <span className="badge bad" style={{ marginLeft: 8 }}>Owes {naira(e.balance)}</span>}</span>
            <span />
            <ActionForm action={setCertificate} label="Issue" busy="..." cls="btn sm" className="adm-inline">
              <input type="hidden" name="id" value={e.id} /><input type="hidden" name="action" value="issue" />
            </ActionForm>
          </div>
        </div>
      ))}
      <h4 className="adm-sub">Issued <span className="m">({issued.length})</span></h4>
      {!issued.length && <p className="m">No certificates issued yet.</p>}
      {issued.map((e) => (
        <div className="adm-item" key={e.id}>
          <div className="adm-item-main">
            <span><b>{e.who}</b> <span className="m">{e.course}</span></span>
            <span />
            <span className="adm-acts">
              <Link className="btn ghost sm" href={`/admin/certificate/${e.id}`}>View and print</Link>
              <ActionForm action={setCertificate} label="Withdraw" busy="..." cls="btn danger sm" confirm={"Withdraw " + e.who + "’s certificate for " + e.course + "?"} className="adm-inline">
                <input type="hidden" name="id" value={e.id} /><input type="hidden" name="action" value="revoke" />
              </ActionForm>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
