import Link from "next/link";
import PortalShell from "../../../components/portal/PortalShell";
import { getPortalData, waUrl } from "../../../lib/portalData";
import { naira, COURSE_IMAGES } from "../../../lib/courses";

export const metadata = { title: "My courses | MAFIANA Tech Academy" };

export default async function Courses() {
  const d = await getPortalData();
  const join = waUrl(`Hello MAFIANA Tech Academy, I am ${d.name}. I want to enroll in another course.`);
  return (
    <PortalShell active="courses" role={d.profile?.role}>
      <div><h3 style={{ fontSize: 26 }}>My courses</h3><span className="m" style={{ color: "var(--mute)" }}>The courses you are enrolled in.</span></div>
      {!d.enrollments.length && <div className="card"><p className="m" style={{ margin: 0 }}>You are not enrolled in a course yet. Message the admission office and they will enroll you.</p></div>}
      <div className="grid courses-grid">
        {d.enrollments.map((e) => (
          <article className="card course-card" key={e.id}>
            <div className="course-img">
              {COURSE_IMAGES[e.course] && <img src={COURSE_IMAGES[e.course]} alt="" width="800" height="500" loading="lazy" />}
              <span className="tag-float">{e.mode === "online" ? "Online" : "Physical"}</span>
            </div>
            <div className="course-body">
              <h3>{e.course}</h3>
              <p className="m">Course fee: <b>{naira(e.total_fee)}</b></p>
              <p style={{ margin: "12px 0 16px" }}>{e.certificate_issued ? <span className="pill gold">Certificate ready</span> : <span className="pill">In progress</span>}</p>
              {e.certificate_issued
                ? <Link className="btn course-btn" href={`/portal/certificate/${e.id}`}>View and print certificate</Link>
                : <p className="m" style={{ margin: "auto 0 0" }}>Your certificate appears here once you finish the course and clear your fees.</p>}
            </div>
          </article>
        ))}
      </div>
      {d.enrollments.length > 0 && join && <p style={{ margin: 0 }}><a className="btn ghost" href={join} target="_blank" rel="noopener noreferrer">Enroll in another course</a></p>}
    </PortalShell>
  );
}
