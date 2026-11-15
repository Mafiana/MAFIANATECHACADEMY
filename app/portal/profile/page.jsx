import PortalShell from "../../../components/portal/PortalShell";
import { getPortalData, waUrl } from "../../../lib/portalData";
import { accessSummary } from "../../../lib/access";
import { prettyDate } from "../../../lib/dates";

export const metadata = { title: "Profile | MAF Tech Academy" };

export default async function Profile() {
  const d = await getPortalData();
  const p = d.profile || {};
  const a = accessSummary(p);
  const staff = p.role === "admin" || p.role === "instructor";
  const renew = waUrl(`Hello MAF Tech Academy, I am ${d.name}${p.student_code ? " (" + p.student_code + ")" : ""}. I want to renew my Access PIN.`);
  const help = waUrl(`Hello MAF Tech Academy, I am ${d.name}${p.student_code ? " (" + p.student_code + ")" : ""}. I need to update my details or I lost my Access PIN.`);
  return (
    <PortalShell active="profile" role={p.role}>
      <div><h3 style={{ fontSize: 26 }}>Profile</h3><span className="m" style={{ color: "var(--mute)" }}>Your details and your Access PIN.</span></div>
      <div className="card">
        <h3>My details</h3>
        <div className="stat"><span>Name</span><b>{p.full_name || "Not set"}</b></div>
        {p.student_code && <div className="stat"><span>Student ID</span><b>{p.student_code}</b></div>}
        {p.phone && <div className="stat"><span>Phone</span><b>{p.phone}</b></div>}
        {p.access_plan && !staff && <div className="stat"><span>Plan</span><b>{p.access_plan}</b></div>}
        <div className="stat"><span>Account</span><b>{p.role === "admin" ? "Admin" : p.role === "instructor" ? "Instructor" : "Student"}</b></div>
        <p className="m" style={{ margin: "12px 0 0" }}>To change your name or phone number, {help ? <a href={help} target="_blank" rel="noopener noreferrer">message the academy on WhatsApp</a> : "contact the academy"}.</p>
      </div>
      <div className="card">
        <h3>Access PIN</h3>
        {staff ? <p className="m" style={{ margin: 0 }}>Your staff access has no end date.</p> : a ? (
          <>
            <div className="stat"><span>Status</span><b><span className={"badge " + (a.expired ? "bad" : a.soon ? "warn" : "ok")}>{a.expired ? "Ended" : a.soon ? "Ending soon" : "Active"}</span></b></div>
            <div className="stat"><span>Valid until</span><b>{prettyDate(p.access_until)}</b></div>
            <div className="stat"><span>Days left</span><b>{Math.max(a.left, 0)}</b></div>
          </>
        ) : <p className="m" style={{ margin: 0 }}>No end date has been set.</p>}
        <p className="m" style={{ margin: "12px 0 0" }}>Your PIN is private and cannot be shown again. If you lose it, the academy can issue a new one{renew && !staff ? <> or <a href={renew} target="_blank" rel="noopener noreferrer">renew your access</a></> : ""}.</p>
      </div>
    </PortalShell>
  );
}
