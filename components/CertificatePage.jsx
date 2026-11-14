import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "./Shell";
import PrintButton from "./PrintButton";
import { createClient } from "../lib/supabase/server";

// Shared by the admin and student certificate pages. Row Level Security means a student can only load their own.
export default async function CertificatePage({ id, back, backLabel }) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) notFound();
  const s = createClient();
  const { data: e } = await s.from("enrollments").select("*").eq("id", n).maybeSingle();
  if (!e || !e.certificate_issued) notFound();
  const { data: p } = await s.from("profiles").select("full_name,email").eq("id", e.student_id).maybeSingle();
  const name = p?.full_name || p?.email || "Student";
  const issuedOn = e.certificate_issued_at ? new Date(e.certificate_issued_at + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const number = "MTA-" + String(e.id).padStart(5, "0");

  return (
    <Shell>
      <section className="cert-page">
        <div className="no-print cert-bar">
          <Link className="btn ghost" href={back}>{backLabel}</Link>
          <PrintButton />
        </div>
        <div className="cert" role="img" aria-label={`Certificate of completion for ${name}, ${e.course}`}>
          <div className="cert-in">
            <svg width="54" height="54" viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="30" rx="8" fill="#F2B705" /><path d="M6 22V8l9 9 9-9v14" fill="none" stroke="#102019" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" /></svg>
            <p className="cert-org">MAFIANA Tech Academy</p>
            <h1>Certificate of Completion</h1>
            <p className="cert-small">This is to certify that</p>
            <p className="cert-name">{name}</p>
            <p className="cert-small">has successfully completed the course</p>
            <p className="cert-course">{e.course}</p>
            <p className="cert-small">{e.mode === "online" ? "Online class" : "Physical class"}</p>
            <div className="cert-foot">
              <div><span className="cert-line" /><small>Director, Stanley Mafiana</small></div>
              <div><b>{number}</b><small>Certificate number{issuedOn ? " · Issued " + issuedOn : ""}</small></div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
