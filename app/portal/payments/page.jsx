import PortalShell from "../../../components/portal/PortalShell";
import { getPortalData, waUrl, fmtDate } from "../../../lib/portalData";
import { naira } from "../../../lib/courses";
import { CONTACT } from "../../../lib/legal";

export const metadata = { title: "Payments | MAFIANA Tech Academy" };

export default async function Payments() {
  const d = await getPortalData();
  const b = CONTACT.bank || {};
  const proof = waUrl(`Hello MAFIANA Tech Academy, I am ${d.name}. I have paid ${d.balance > 0 ? "part of my balance" : ""} and want to send my payment proof.`);
  const ask = waUrl(`Hello MAFIANA Tech Academy, I am ${d.name}. Please send me the payment details for my balance of ${naira(d.balance)}.`);
  return (
    <PortalShell active="payments" role={d.profile?.role}>
      <div><h3 style={{ fontSize: 26 }}>Payments</h3><span className="m" style={{ color: "var(--mute)" }}>Your fees and every payment we have recorded.</span></div>
      {d.error && <div className="adm-msg bad" role="alert">Some information could not be loaded. Please refresh the page.</div>}

      <div className="card">
        <div className="grid p-stats" style={{ marginBottom: 14 }}>
          <div><div className="m">Total fees</div><h3>{naira(d.fees)}</h3></div>
          <div><div className="m">Paid</div><h3>{naira(d.paid)}</h3></div>
          <div><div className="m">Balance</div><h3>{naira(d.balance)}</h3></div>
        </div>
        <div className="pbar" aria-label={`${d.paidPct}% paid`}><i style={{ width: d.paidPct + "%" }} /></div>
        <p className="m" style={{ margin: "8px 0 0" }}>{d.fees ? `${d.paidPct}% paid` : "You have no fees yet because you are not enrolled in a course."}</p>
      </div>

      {d.balance > 0 && (
        <div className="card">
          <h3>How to pay your balance</h3>
          {b.accountNumber ? (
            <div className="bank">
              <div className="stat"><span>Bank</span><b>{b.bank}</b></div>
              <div className="stat"><span>Account name</span><b>{b.accountName}</b></div>
              <div className="stat"><span>Account number</span><b>{b.accountNumber}</b></div>
              <p className="m" style={{ margin: "10px 0 0" }}>After you pay, send your proof so we can record it. Your balance updates once we do.</p>
            </div>
          ) : <p className="m">Message the admission office for the payment details.</p>}
          <p style={{ margin: "14px 0 0" }}>
            {(b.accountNumber ? proof : ask) && <a className="btn" href={b.accountNumber ? proof : ask} target="_blank" rel="noopener noreferrer">{b.accountNumber ? "Send payment proof on WhatsApp" : "Ask for payment details on WhatsApp"}</a>}
          </p>
        </div>
      )}

      <div className="card">
        <h3>Payment history</h3>
        {d.payments.length ? d.payments.map((p) => (
          <div className="stat" key={p.id}><span>{p.note || "Payment"} <span className="m">· {fmtDate(p.created_at)}</span></span><b>{naira(p.amount)}</b></div>
        )) : <p className="m">No payments recorded yet.</p>}
        <p className="m" style={{ margin: "12px 0 0" }}>Paid but do not see it here? Send your proof on WhatsApp and we will record it.</p>
      </div>
    </PortalShell>
  );
}
