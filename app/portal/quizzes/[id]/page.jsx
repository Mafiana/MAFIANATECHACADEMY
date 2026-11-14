import Link from "next/link";
import { notFound } from "next/navigation";
import PortalShell from "../../../../components/portal/PortalShell";
import QuizTaker from "../../../../components/portal/QuizTaker";
import { getPortalData } from "../../../../lib/portalData";

export const metadata = { title: "Quiz | MAFIANA Tech Academy" };

export default async function Quiz({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const d = await getPortalData();
  const { data: z } = await d.supabase.from("quizzes").select("id,course,title,questions").eq("id", id).maybeSingle();
  if (!z) notFound(); // not found, or the student is not enrolled in this course
  return (
    <PortalShell active="quizzes" role={d.profile?.role}>
      <div>
        <Link href="/portal/quizzes" className="m">← All quizzes</Link>
        <h3 style={{ fontSize: 26, marginTop: 6 }}>{z.title}</h3>
        <span className="m" style={{ color: "var(--mute)" }}>{z.course} · {z.questions.length} question{z.questions.length === 1 ? "" : "s"}</span>
      </div>
      <QuizTaker quiz={z} />
    </PortalShell>
  );
}
