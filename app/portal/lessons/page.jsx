import Link from "next/link";
import PortalShell from "../../../components/portal/PortalShell";
import { getPortalData } from "../../../lib/portalData";

export const metadata = { title: "Lessons | MAFIANA Tech Academy" };

export default async function Lessons() {
  const d = await getPortalData();
  // Row Level Security only returns lessons for courses this student is enrolled in.
  const { data: lessons, error } = await d.supabase.from("lessons").select("id,course,title,minutes,position").order("position").order("id");
  const courses = [...new Set(d.enrollments.map((e) => e.course))];
  return (
    <PortalShell active="lessons" role={d.profile?.role}>
      <div><h3 style={{ fontSize: 26 }}>Lessons</h3><span className="m" style={{ color: "var(--mute)" }}>Video lessons for the courses you are enrolled in.</span></div>
      {!courses.length && <div className="card"><p className="m" style={{ margin: 0 }}>You are not enrolled in a course yet. Your lessons appear here after you enroll.</p></div>}
      {courses.length > 0 && (error || !lessons?.length) && <div className="card"><p className="m" style={{ margin: 0 }}>No lessons have been added for your courses yet. Check back soon.</p></div>}
      {courses.map((c) => {
        const list = (lessons || []).filter((l) => l.course === c);
        if (!list.length) return null;
        return (
          <div className="card" key={c}>
            <h3>{c}</h3>
            {list.map((l, i) => (
              <Link href={`/portal/lessons/${l.id}`} className="lesson" key={l.id}>
                <span className="lesson-n">{i + 1}</span>
                <span className="lesson-t">{l.title}</span>
                <span className="m">{l.minutes ? l.minutes + " min" : ""}</span>
                <span className="lesson-go" aria-hidden="true">▶</span>
              </Link>
            ))}
          </div>
        );
      })}
    </PortalShell>
  );
}
