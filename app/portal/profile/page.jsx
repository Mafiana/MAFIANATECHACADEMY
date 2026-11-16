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
  const renew = waUrl(
    `Hello MAF Tech Academy, I am ${d.name}${p.student_code ? " (" + p.student_code + ")" : ""}. I want to renew my Access PIN.`
  );
  const help = waUrl(
    `Hello MAF Tech Academy, I am ${d.name}${p.student_code ? " (" + p.student_code + ")" : ""}. I need to update my details or I lost my Access PIN.`
  );
  return (
    <PortalShell active="profile" role={p.role}>
      <div>
        <h3 style={{ fontSize: 26 }}>Profile</h3>
        <span className="m" style={{ color: "var(--mute)" }}>
          Your details, Student ID and Access PIN.
        </span>
      </div>

      <div className="card">
        <h3>My details</h3>
        <div className="stat">
          <span>Name</span>
          <b>{p.full_name || "Not set"}</b>
        </div>
        <div className="stat">
          <span>Student ID</span>
          <b>{p.student_code || "Pending"}</b>
        </div>
        {p.phone && (
          <div className="stat">
            <span>Phone</span>
            <b>{p.phone}</b>
          </div>
        )}
        {p.access_plan && !staff && (
          <div className="stat">
            <span>Plan</span>
            <b>{p.access_plan}</b>
          </div>
        )}
        <div className="stat">
          <span>Account</span>
          <b>{p.role === "admin" ? "Admin" : p.role === "instructor" ? "Instructor" : "Student"}</b>
        </div>
        <p className="m" style={{ margin: "12px 0 0" }}>
          To change your name or phone number,{" "}
          {help ? (
            <a href={help} target="_blank" rel="noopener noreferrer">
              message the academy on WhatsApp
            </a>
          ) : (
            "contact the academy"
          )}
          .
        </p>
      </div>

      <div className="card">
        <h3>Access PIN</h3>
        {p.access_pin ? (
          <>
            <div className="stat">
              <span>Your PIN</span>
              <b style={{ letterSpacing: "0.08em", fontFamily: "ui-monospace, monospace" }}>{p.access_pin}</b>
            </div>
            <p className="m" style={{ margin: "8px 0 0" }}>
              Use this PIN to sign in at the student login page. Keep it private.
            </p>
          </>
        ) : (
          <p className="m" style={{ margin: 0 }}>
            Your Access PIN is not stored on this account yet. If you lost it,{" "}
            {help ? (
              <a href={help} target="_blank" rel="noopener noreferrer">
                message the academy
              </a>
            ) : (
              "contact the academy"
            )}{" "}
            for a new one.
          </p>
        )}
        {staff ? (
          <p className="m" style={{ margin: "12px 0 0" }}>
            Your staff access has no end date.
          </p>
        ) : a ? (
          <>
            <div className="stat" style={{ marginTop: 12 }}>
              <span>Status</span>
              <b>
                <span className={"badge " + (a.expired ? "bad" : a.soon ? "warn" : "ok")}>
                  {a.expired ? "Ended" : a.soon ? "Ending soon" : "Active"}
                </span>
              </b>
            </div>
            <div className="stat">
              <span>Valid until</span>
              <b>{prettyDate(p.access_until)}</b>
            </div>
            <div className="stat">
              <span>Days left</span>
              <b>{Math.max(a.left, 0)}</b>
            </div>
            {(a.soon || a.expired) && renew && (
              <p className="m" style={{ margin: "12px 0 0" }}>
                <a href={renew} target="_blank" rel="noopener noreferrer">
                  Message the academy to renew
                </a>
              </p>
            )}
          </>
        ) : (
          <p className="m" style={{ margin: "12px 0 0" }}>
            No end date has been set yet.
          </p>
        )}
      </div>
    </PortalShell>
  );
}
