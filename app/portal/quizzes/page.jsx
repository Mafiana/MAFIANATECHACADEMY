import Link from "next/link";
import PortalShell from "../../../components/portal/PortalShell";
import { getPortalData } from "../../../lib/portalData";

export const metadata = { title: "Quizzes | MAFIANA Tech Academy" };

export default async function Quizzes() {
  const d = await getPortalData();
  const { data: quizzes, error } = await d.supabase.from("quizzes").select("id,course,title,questions").order("id");
  const { data: attempts } = await d.supabase.from("quiz_attempts").select("quiz_id,score,total").eq("student_id", d.user.id);
  const courses = [...new Set(d.enrollments.map((e) => e.course))];
  const best = (qid) => (attempts || []).filter((a) => a.quiz_id === qid).sort((a, b) => b.score / b.total - a.score / a.total)[0];
  const tries = (qid) => (attempts || []).filter((a) => a.quiz_id === qid).length;
  return (
    <PortalShell active="quizzes" role={d.profile?.role}>
      <div><h3 style={{ fontSize: 26 }}>Quizzes</h3><span className="m" style={{ color: "var(--mute)" }}>Test what you have learned. You can retake a quiz any time.</span></div>
      {!courses.length && <div className="card"><p className="m" style={{ margin: 0 }}>You are not enrolled in a course yet. Your quizzes appear here after you enroll.</p></div>}
      {courses.length > 0 && (error || !quizzes?.length) && <div className="card"><p className="m" style={{ margin: 0 }}>No quizzes have been added for your courses yet. Check back soon.</p></div>}
      {courses.map((c) => {
        const list = (quizzes || []).filter((z) => z.course === c);
        if (!list.length) return null;
        return (
          <div className="card" key={c}>
            <h3>{c}</h3>
            {list.map((z) => {
              const b = best(z.id);
              return (
                <div className="stat" key={z.id}>
                  <span>{z.title} <span className="m">· {z.questions.length} question{z.questions.length === 1 ? "" : "s"}{b ? ` · best ${b.score}/${b.total}, tried ${tries(z.id)}×` : ""}</span></span>
                  <Link className="btn sm" href={`/portal/quizzes/${z.id}`}>{b ? "Retake" : "Start"}</Link>
                </div>
              );
            })}
          </div>
        );
      })}
    </PortalShell>
  );
}
