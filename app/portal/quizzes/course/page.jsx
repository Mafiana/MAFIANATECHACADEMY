import Link from "next/link";
import PortalShell from "../../../../components/portal/PortalShell";
import { getPortalData } from "../../../../lib/portalData";

export const metadata = { title: "Interactive Computer Science Course | MAFIANA Tech Academy" };

export default async function CourseApp() {
  const d = await getPortalData();
  return (
    <PortalShell active="quizzes" role={d.profile?.role}>
      <div>
        <Link href="/portal/quizzes" className="m">← All quizzes</Link>
        <h3 style={{ fontSize: 26, marginTop: 6 }}>Interactive Computer Science Course</h3>
        <span className="m" style={{ color: "var(--mute)" }}>Lessons, practice activities, module quizzes, a final test and a certificate.</span>
      </div>
      <iframe
        src="/portal/course-app/index.html"
        title="Interactive Computer Science Course"
        style={{ width: "100%", height: "calc(100vh - 160px)", minHeight: 700, border: "1px solid var(--line)", borderRadius: 14, background: "#fff" }}
      />
    </PortalShell>
  );
}
