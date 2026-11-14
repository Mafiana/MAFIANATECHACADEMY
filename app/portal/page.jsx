import Link from "next/link";
import Greeting from "../../components/Greeting";
import PortalShell from "../../components/portal/PortalShell";
import { getPortalData, waUrl, fmtDate } from "../../lib/portalData";
import { naira, COURSE_IMAGES } from "../../lib/courses";

export const metadata = { title: "Student portal | MAFIANA Tech Academy" };

export default async function Portal() {
  const d = await getPortalData();
  const first = d.name.split(" ")[0];
  // Announcements are optional: if the table has not been created yet this quietly shows nothing.
  const { data: ann } = await d.supabase.from("announcements").select("id,title,body,created_at").order("created_at", { ascending: false }).limit(3);
  const enrolled = d.enrollments.length > 0;
  const certs = d.enrollments.filter((e) => e.certificate_issued);
  const pay = waUrl(`Hello MAFIANA Tech Academy, I am ${d.name}. I want to pay my balance of ${naira(d.balance)}.`);
  const join = waUrl(`Hello MAFIANA Tech Academy, I am ${d.name}. I have signed up on the portal and want to enroll in a course.`);

  return (
    <PortalShell active="home" role={d.profile?.role}>
      {d.error && <div className="adm-msg bad" role="alert">Some of your information could not be loaded. Please refresh the page.</div>}

      <div className="p-hero">
        <div>
          <Greeting name={first} />
          <p className="greet-sub">{enrolled ? (d.balance > 0 ? `Your balance is ${naira(d.balance)}.` : "Your fees are fully paid. Well done.") : "You are not enrolled in a course yet."}</p>
        </div>
        {!enrolled && join && <a className="btn" href={join} target="_blank" rel="noopener noreferrer">Enroll on WhatsApp</a>}
        {enrolled && d.balance > 0 && <Link className="btn" href="/portal/payments">How to pay</Link>}
      </div>

      <div className="grid p-stats">
        <div className="card"><div className="m">Fees paid</div><h3>{naira(d.paid)}</h3><div className="m">of {naira(d.fees)}</div></div>
        <div className="card"><div className="m">Balance</div><h3>{naira(d.balance)}</h3><div className="m">{d.balance > 0 ? "still to pay" : enrolled ? "all paid" : "no fees yet"}</div></div>
        <div className="card"><div className="m">Attendance</div><h3>{d.attendance.length ? d.pct + "%" : "–"}</h3><div className="m">{d.present} of {d.attendance.length} class{d.attendance.length === 1 ? "" : "es"}</div></div>
      </div>

      {ann?.length > 0 && (
        <div className="card">
          <h3>Announcements</h3>
          {ann.map((a) => (
            <div className="ann" key={a.id}>
              <b>{a.title}</b><span className="m">{fmtDate(a.created_at)}</span>
              {a.body && <p className="m">{a.body}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3>My courses</h3>
        {enrolled ? d.enrollments.map((e) => (
          <div className="stat" key={e.id}>
            <span>{e.course} <span className="m">({e.mode})</span></span>
            <b>{e.certificate_issued ? <Link href={`/portal/certificate/${e.id}`} className="pill gold" style={{ textDecoration: "none" }}>Certificate ready</Link> : <span className="pill">In progress</span>}</b>
          </div>
        )) : <p className="m">When the admission office enrolls you, your course appears here.</p>}
        {enrolled && <p style={{ margin: "12px 0 0" }}><Link className="btn ghost sm" href="/portal/courses">See course details</Link></p>}
      </div>

      {certs.length > 0 && <p className="m" style={{ margin: 0 }}>You have {certs.length} certificate{certs.length === 1 ? "" : "s"}. Open it from My courses to print or save as PDF.</p>}
    </PortalShell>
  );
}
