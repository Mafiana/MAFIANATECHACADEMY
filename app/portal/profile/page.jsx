import PortalShell from "../../../components/portal/PortalShell";
import PasswordForm from "../../../components/portal/PasswordForm";
import { getPortalData, waUrl } from "../../../lib/portalData";

export const metadata = { title: "Profile | MAFIANA Tech Academy" };

export default async function Profile() {
  const d = await getPortalData();
  const help = waUrl(`Hello MAFIANA Tech Academy, I am ${d.name} (${d.profile?.email || ""}). I need to update my details.`);
  return (
    <PortalShell active="profile" role={d.profile?.role}>
      <div><h3 style={{ fontSize: 26 }}>Profile</h3><span className="m" style={{ color: "var(--mute)" }}>Your account details and password.</span></div>
      <div className="card">
        <h3>My details</h3>
        <div className="stat"><span>Name</span><b>{d.profile?.full_name || "Not set"}</b></div>
        <div className="stat"><span>Email</span><b style={{ overflowWrap: "anywhere" }}>{d.profile?.email || d.user.email}</b></div>
        <div className="stat"><span>Account</span><b>{d.profile?.role === "admin" ? "Staff" : "Student"}</b></div>
        <p className="m" style={{ margin: "12px 0 0" }}>To change your name or email, {help ? <a href={help} target="_blank" rel="noopener noreferrer">message the academy on WhatsApp</a> : "contact the academy"}.</p>
      </div>
      <PasswordForm />
    </PortalShell>
  );
}
