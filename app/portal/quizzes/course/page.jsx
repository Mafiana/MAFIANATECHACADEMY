import Link from "next/link";
import PortalShell from "../../../../components/portal/PortalShell";
import CourseAppClient from "./CourseAppClient";
import { getPortalData } from "../../../../lib/portalData";

export const metadata = { title: "Interactive Computer Science Course | MAF Tech Academy" };

export default async function CoursePage() {
  const d = await getPortalData();
  return (
    <PortalShell active="quizzes" role={d.profile?.role}>
      <div>
        <Link href="/portal/quizzes" className="m">← All modules</Link>
        <h3 style={{ fontSize: 26, marginTop: 6 }}>Interactive Computer Science Course</h3>
        <span className="m" style={{ color: "var(--mute)" }}>Lessons, practice activities, module quizzes, a final test and a certificate.</span>
      </div>
      <CourseAppClient />
    </PortalShell>
  );
}