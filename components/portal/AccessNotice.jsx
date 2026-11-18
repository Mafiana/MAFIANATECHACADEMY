// A notification shown at the top of every student portal page when the student's access is about to end.
import { createClient } from "../../lib/supabase/server";
import { accessSummary } from "../../lib/access";
import { prettyDate } from "../../lib/dates";
import { waUrl } from "../../lib/portalData";

export default async function AccessNotice() {
  try {
    const s = createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return null;
    const { data: p } = await s.from("profiles").select("role,full_name,access_until,access_status").eq("id", user.id).maybeSingle();
    if (!p || p.role !== "student") return null;
    const acc = accessSummary(p);
    if (!acc?.soon) return null;
    const when = acc.left === 0 ? "today" : acc.left === 1 ? "tomorrow" : `in ${acc.left} days`;
    const contact = waUrl(`Hello MAF Tech Academy, I am ${p.full_name || "a student"}. I want to renew my Access PIN.`);
    return (
      <div className={"adm-msg " + (acc.left <= 1 ? "bad" : "warn")} role="status">
        <b>🔔 Your access ends {when}</b> ({prettyDate(acc.until)}). Renew before then so you do not lose your lessons, modules and certificate.{" "}
        {contact && <a href={contact} target="_blank" rel="noopener noreferrer">Contact the academy to renew</a>}
      </div>
    );
  } catch {
    return null; // a notice must never break the page
  }
}
