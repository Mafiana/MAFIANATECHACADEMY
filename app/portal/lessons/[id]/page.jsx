import Link from "next/link";
import { notFound } from "next/navigation";
import PortalShell from "../../../../components/portal/PortalShell";
import { getPortalData } from "../../../../lib/portalData";
import { videoEmbed } from "../../../../lib/video";

export const metadata = { title: "Lesson | MAFIANA Tech Academy" };

export default async function Lesson({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const d = await getPortalData();
  const { data: l } = await d.supabase.from("lessons").select("*").eq("id", id).maybeSingle();
  if (!l) notFound(); // not found, or the student is not enrolled in this course
  const { data: sibs } = await d.supabase.from("lessons").select("id,title,position").eq("course", l.course).order("position").order("id");
  const at = (sibs || []).findIndex((x) => x.id === l.id);
  const prev = at > 0 ? sibs[at - 1] : null;
  const next = at >= 0 && at < (sibs || []).length - 1 ? sibs[at + 1] : null;
  const embed = videoEmbed(l.video_url);

  return (
    <PortalShell active="lessons" role={d.profile?.role}>
      <div>
        <Link href="/portal/lessons" className="m">← All lessons</Link>
        <h3 style={{ fontSize: 26, marginTop: 6 }}>{l.title}</h3>
        <span className="m" style={{ color: "var(--mute)" }}>{l.course}{l.minutes ? " · " + l.minutes + " min" : ""}</span>
      </div>
      {embed ? (
        <div className="video"><iframe src={embed} title={l.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
      ) : (
        <div className="card"><p className="m" style={{ marginTop: 0 }}>This video opens on another website.</p><a className="btn" href={l.video_url} target="_blank" rel="noopener noreferrer">Open video</a></div>
      )}
      {embed && <p className="m" style={{ margin: 0 }}>Video not playing? <a href={l.video_url} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>.</p>}
      <div className="adm-acts" style={{ justifyContent: "space-between" }}>
        {prev ? <Link className="btn ghost" href={`/portal/lessons/${prev.id}`}>← Previous</Link> : <span />}
        {next ? <Link className="btn" href={`/portal/lessons/${next.id}`}>Next lesson →</Link> : <Link className="btn ghost" href="/portal/quizzes">Take a quiz</Link>}
      </div>
    </PortalShell>
  );
}
